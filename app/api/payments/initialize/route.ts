import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import { amountInKobo, checkoutSchema } from "@/lib/payment-validation"
import { paystackRequest } from "@/lib/paystack"
import { writeClient } from "@/lib/sanity.server"
import { siteConfig } from "@/lib/seo"
import { rateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"
export async function POST(request: Request) {
  if (!process.env.PAYSTACK_SECRET_KEY) return NextResponse.json({ error: "Online giving is not available yet. Please use the bank transfer details below." }, { status: 503 })
  if (!rateLimit(`checkout:${request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"}`, 5)) return NextResponse.json({ error: "Please wait before trying again." }, { status: 429 })
  if (Number(request.headers.get("content-length") || 0) > 10_000) return NextResponse.json({ error: "Submission is too large." }, { status: 413 })
  try {
    const raw = await request.text()
    if (raw.length > 10_000) return NextResponse.json({ error: "Submission is too large." }, { status: 413 })
    const parsed = checkoutSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    const input = parsed.data
    const amount = amountInKobo(input.amount)
    const reference = `MW-${randomUUID()}`
    let planCode: string | undefined
    if (input.frequency === "monthly") {
      const plan = await paystackRequest<{ plan_code: string }>("/plan", { name: `MedWHOLE monthly gift ${reference}`, interval: "monthly", amount, currency: "NGN", send_invoices: true, send_sms: false })
      planCode = plan.plan_code
    }
    await writeClient.create({
      _id: `private.donation-payment-${reference}`, _type: "donationPayment", reference,
      fullName: input.fullName, email: input.email.toLowerCase(), amount, currency: "NGN",
      frequency: input.frequency, designation: input.designation, community: input.community,
      status: "pending", submittedAt: new Date().toISOString(), ...(planCode ? { planCode } : {}),
    })
    const result = await paystackRequest<{ authorization_url: string }>("/transaction/initialize", {
      email: input.email.toLowerCase(), amount, currency: "NGN", reference,
      callback_url: `${siteConfig.url}/give/complete`,
      channels: planCode ? ["card"] : ["card", "bank_transfer"],
      ...(planCode ? { plan: planCode } : {}),
      metadata: { donationReference: reference, designation: input.designation, community: input.community, cancel_action: `${siteConfig.url}/give` },
    })
    const checkout = new URL(result.authorization_url)
    if (checkout.protocol !== "https:" || checkout.hostname !== "checkout.paystack.com") throw new Error("INVALID_CHECKOUT_URL")
    return NextResponse.json({ url: checkout.href }, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return NextResponse.json({ error: "We could not start your payment. Please try again or use bank transfer." }, { status: 502 })
  }
}
