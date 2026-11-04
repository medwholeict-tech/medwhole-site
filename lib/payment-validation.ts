import { z } from "zod"

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  amount: z.string().regex(/^\d{1,8}(?:\.\d{1,2})?$/).refine((value) => Number(value) >= 100 && Number(value) <= 10_000_000, "Enter an amount between ₦100 and ₦10,000,000."),
  frequency: z.enum(["one-off", "monthly"]),
  designation: z.string().trim().min(1).max(160),
  community: z.enum(["", "gosa", "kunyami", "toge"]).default(""),
  website: z.string().max(0).optional(),
})

export function amountInKobo(amount: string) {
  const [whole, fraction = ""] = amount.split(".")
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"))
}

export function paymentMatches(expected: { amount: number; currency: string; reference: string }, actual: { amount: number; currency: string; reference: string; status: string }) {
  return actual.status === "success" && actual.amount === expected.amount && actual.currency === expected.currency && actual.reference === expected.reference
}
