import "server-only"
import { createPrivatePayloadDocument, listPrivatePayloadDocuments, updatePrivatePayloadDocument } from "./payload"
import type { CmsDocument } from "./types"

export type PaymentInput = {
  reference: string; parentReference?: string; amountMinor: number; currency: string;
  fullName: string; email: string; frequency: "one-off" | "monthly";
  designation?: string; community?: string; planCode?: string; receiptSent?: boolean;
  status: string; providerStatus: string; paidAt?: string; submittedAt: string;
}
export type PaymentRecord = CmsDocument & PaymentInput

export async function findPayment(field: "reference" | "planCode", value: string): Promise<PaymentRecord | null> {
  const query = new URLSearchParams({ [`where[${field}][equals]`]: value, limit: "1", depth: "0" })
  const result = await listPrivatePayloadDocuments<PaymentRecord>("donation-payments", query.toString())
  return result.docs[0] || null
}

export async function createPayment(data: PaymentInput): Promise<PaymentRecord> {
  try {
    return await createPrivatePayloadDocument<PaymentRecord>("donation-payments", data)
  } catch (error) {
    // The unique reference handles simultaneous webhook and browser callbacks.
    const existing = await findPayment("reference", data.reference)
    if (!existing || existing.amountMinor !== data.amountMinor || existing.currency !== data.currency || existing.email.toLowerCase() !== data.email.toLowerCase()) throw error
    return existing
  }
}

export async function updatePayment(id: string, data: Record<string, unknown>): Promise<PaymentRecord> {
  return updatePrivatePayloadDocument<PaymentRecord>("donation-payments", id, data)
}
