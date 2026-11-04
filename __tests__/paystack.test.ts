import { createHmac } from "node:crypto"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { amountInKobo, checkoutSchema, paymentMatches } from "../lib/payment-validation"

vi.mock("server-only", () => ({}))
const database = vi.hoisted(() => new Map<string, any>())
vi.mock("@/lib/sanity.server", () => ({ writeClient: {
  getDocument: vi.fn(async (id: string) => database.get(id)),
  createIfNotExists: vi.fn(async (record: any) => { if (!database.has(record._id)) database.set(record._id, record); return database.get(record._id) }),
  patch: vi.fn((id: string) => ({ set: (values: any) => ({ commit: async () => database.set(id, { ...database.get(id), ...values }) }) })),
  fetch: vi.fn(async (_query: string, params: { planCode: string }) => [...database.values()].find((record) => record.planCode === params.planCode)),
} }))
import { settlePaystackPayment, validPaystackSignature } from "../lib/paystack"

beforeEach(() => {
  database.clear()
  vi.stubEnv("PAYSTACK_SECRET_KEY", "sk_test_example")
  vi.stubEnv("RESEND_API_KEY", "")
})

describe("donation payment boundaries", () => {
  it("converts decimal amounts without floating point drift", () => {
    expect(amountInKobo("1234.56")).toBe(123456)
    expect(amountInKobo("100.1")).toBe(10010)
  })
  it("rejects invalid amounts and bot-filled forms", () => {
    const valid = { fullName: "Ada Okafor", email: "ada@example.com", amount: "5000", frequency: "monthly", designation: "Health" }
    expect(checkoutSchema.safeParse(valid).success).toBe(true)
    for (const amount of ["-100", "NaN", "10e5", "100.001", "0", "10000001"]) expect(checkoutSchema.safeParse({ ...valid, amount }).success).toBe(false)
    expect(checkoutSchema.safeParse({ ...valid, website: "spam" }).success).toBe(false)
  })
  it("requires a successful status, exact reference, amount and currency", () => {
    const expected = { amount: 500000, currency: "NGN", reference: "MW-test" }
    expect(paymentMatches(expected, { ...expected, status: "success" })).toBe(true)
    expect(paymentMatches(expected, { ...expected, amount: 1, status: "success" })).toBe(false)
    expect(paymentMatches(expected, { ...expected, currency: "USD", status: "success" })).toBe(false)
    expect(paymentMatches(expected, { ...expected, status: "pending" })).toBe(false)
    expect(paymentMatches(expected, { ...expected, reference: "another", status: "success" })).toBe(false)
  })
  it("authenticates the exact raw webhook payload", () => {
    const raw = '{"event":"charge.success"}'
    const signature = createHmac("sha512", "sk_test_example").update(raw).digest("hex")
    expect(validPaystackSignature(raw, signature)).toBe(true)
    expect(validPaystackSignature(raw + " ", signature)).toBe(false)
    expect(validPaystackSignature(raw, null)).toBe(false)
    expect(validPaystackSignature(raw, "not-a-signature")).toBe(false)
  })
  it("records a verified charge only once across callback and webhook retries", async () => {
    database.set("private.donation-payment-MW-test", { _id: "private.donation-payment-MW-test", reference: "MW-test", amount: 500000, currency: "NGN", email: "ada@example.com", fullName: "Ada Okafor", designation: "Health", frequency: "one-off" })
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ status: true, data: { reference: "MW-test", amount: 500000, currency: "NGN", status: "success", customer: { email: "ada@example.com" } } }) })))
    expect(await settlePaystackPayment("MW-test")).toMatchObject({ status: "paid", amount: 5000 })
    expect(await settlePaystackPayment("MW-test")).toMatchObject({ status: "paid" })
    expect([...database.keys()].filter((id) => id.startsWith("private.donation-charge-"))).toHaveLength(1)
  })
  it("does not mark an underpayment or different donor as paid", async () => {
    database.set("private.donation-payment-MW-test", { _id: "private.donation-payment-MW-test", reference: "MW-test", amount: 500000, currency: "NGN", email: "ada@example.com" })
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ status: true, data: { reference: "MW-test", amount: 1, currency: "NGN", status: "success", customer: { email: "other@example.com" } } }) })))
    expect(await settlePaystackPayment("MW-test")).toMatchObject({ status: "unconfirmed" })
    expect([...database.keys()].filter((id) => id.startsWith("private.donation-charge-"))).toHaveLength(0)
  })
  it("associates a later monthly charge through the verified plan_object", async () => {
    database.set("private.donation-payment-MW-original", { _id: "private.donation-payment-MW-original", reference: "MW-original", amount: 500000, currency: "NGN", email: "ada@example.com", frequency: "monthly", planCode: "PLN_monthly" })
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ status: true, data: { reference: "renewal-reference", amount: 500000, currency: "NGN", status: "success", plan_object: { plan_code: "PLN_monthly" }, customer: { email: "ada@example.com" } } }) })))
    expect(await settlePaystackPayment("renewal-reference")).toMatchObject({ status: "paid" })
    const charges = [...database.values()].filter((record) => record.parentReference === "MW-original")
    expect(charges).toHaveLength(1)
  })
})
