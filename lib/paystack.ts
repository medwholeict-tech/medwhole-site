import "server-only"
import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { Resend } from "resend"
import { writeClient } from "@/lib/sanity.server"
import { paymentMatches } from "./payment-validation"
import { recordPayloadEmailDelivery } from "@/lib/cms/email-delivery"

export async function paystackRequest<T>(path: string, body?: Record<string, unknown>): Promise<T> {
  if (!process.env.PAYSTACK_SECRET_KEY) throw new Error("PAYSTACK_NOT_CONFIGURED")
  const response = await fetch(`https://api.paystack.co${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store", signal: AbortSignal.timeout(15_000),
  })
  const result = await response.json()
  if (!response.ok || result.status !== true) throw new Error("PAYSTACK_REQUEST_FAILED")
  return result.data as T
}

export function validPaystackSignature(raw: string, signature: string | null) {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret || !signature || !/^[a-f\d]{128}$/i.test(signature)) return false
  return timingSafeEqual(Buffer.from(signature, "hex"), createHmac("sha512", secret).update(raw).digest())
}

type Verification = { reference: string; status: string; amount: number; currency: string; paid_at?: string; metadata?: { donationReference?: string }; customer?: { email?: string }; plan?: { plan_code?: string } | string; plan_object?: { plan_code?: string } }

export async function settlePaystackPayment(reference: string) {
  if (!/^[A-Za-z0-9._=-]{6,120}$/.test(reference)) throw new Error("INVALID_REFERENCE")
  const actual = await paystackRequest<Verification>(`/transaction/verify/${encodeURIComponent(reference)}`)
  const originalReference = actual.metadata?.donationReference || reference
  let original: any = /^[A-Za-z0-9-]{6,120}$/.test(originalReference) ? await writeClient.getDocument(`private.donation-payment-${originalReference}`) : null
  // Later subscription charges have new references. Each checkout has its own plan.
  const planCode = actual.plan_object?.plan_code || (typeof actual.plan === "object" ? actual.plan?.plan_code : actual.plan)
  if (!original && planCode) {
    original = await writeClient.fetch(`*[_type == "donationPayment" && planCode == $planCode && frequency == "monthly"][0]`, { planCode })
  }
  if (!original) return { status: "ignored" }
  if (!paymentMatches({ reference, amount: original.amount, currency: original.currency }, actual) || actual.customer?.email?.toLowerCase() !== original.email.toLowerCase()) return { status: "unconfirmed" }
  const id = `private.donation-charge-${createHash("sha256").update(reference).digest("hex")}`
  await writeClient.createIfNotExists({
    _id: id, _type: "donationPayment", reference, parentReference: original.reference,
    fullName: original.fullName, email: original.email, amount: actual.amount, currency: actual.currency,
    frequency: original.frequency, designation: original.designation, community: original.community,
    status: "paid", paidAt: actual.paid_at || new Date().toISOString(), submittedAt: new Date().toISOString(),
  })
  await writeClient.patch(original._id).set({ status: "paid", paidAt: actual.paid_at || new Date().toISOString() }).commit()
  const charge: any = await writeClient.getDocument(id)
  if (!charge.receiptSent && process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM, to: original.email, replyTo: "info@medwhole.org",
      subject: `MedWHOLE donation receipt — ${reference}`,
      text: `Thank you for your gift to MedWHOLE Alliance for Health and Development.\n\nReference: ${reference}\nAmount: NGN ${(actual.amount / 100).toFixed(2)}\nDesignation: ${original.designation}\n${original.community ? `Community: ${original.community}\n` : ""}\nYour payment has been confirmed. Programme reporting is published at https://www.medwhole.org/impact.\n\ninfo@medwhole.org`,
    }, { idempotencyKey: `donation-receipt-${reference}` })
    if (result.error) {
      await recordPayloadEmailDelivery({ template: "donation-payment-receipt", recordId: reference, recipient: original.email, status: "failed", error: result.error })
      throw new Error("RECEIPT_DELIVERY_FAILED")
    }
    await recordPayloadEmailDelivery({ template: "donation-payment-receipt", recordId: reference, recipient: original.email, providerId: result.data?.id, status: "sent" })
    await writeClient.patch(id).set({ receiptSent: true }).commit()
  }
  return { status: "paid", reference, amount: actual.amount / 100, currency: actual.currency }
}
