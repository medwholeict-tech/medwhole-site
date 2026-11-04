import { describe, expect, it } from "vitest"
import {
  donationIntentSchema,
  getTransferNarration,
  transferRoutes,
} from "../lib/donation-intent"

const validIntent = {
  currency: "NGN" as const,
  frequency: "one-time" as const,
  amount: "10000",
  programme: "where-needed" as const,
  fullName: "Ada Okafor",
  country: "Nigeria",
  email: "ada@example.com",
  phone: "",
  expectedTransferDate: "",
  consent: true,
  website: "",
}

describe("donation intent", () => {
  it("accepts a valid intent with email contact", () => {
    expect(donationIntentSchema.safeParse(validIntent).success).toBe(true)
  })

  it("accepts phone contact when email is omitted", () => {
    const result = donationIntentSchema.safeParse({
      ...validIntent,
      email: "",
      phone: "+234 800 000 0000",
    })
    expect(result.success).toBe(true)
  })

  it("accepts a specific event or story designation", () => {
    const result = donationIntentSchema.safeParse({
      ...validIntent,
      designation: "Weekly Good News Club - Kunyami",
      sourcePath: "/events/weekly-good-news-club-kunyami",
    })
    expect(result.success).toBe(true)
  })

  it("requires at least one contact method", () => {
    const result = donationIntentSchema.safeParse({
      ...validIntent,
      email: "",
      phone: "",
    })
    expect(result.success).toBe(false)
  })

  it("contains the supplied local and offshore beneficiary accounts", () => {
    const ngnValues = transferRoutes.NGN.groups.flatMap((group) => group.details.map((detail) => detail.value))
    const usdValues = transferRoutes.USD.groups.flatMap((group) => group.details.map((detail) => detail.value))
    const gbpValues = transferRoutes.GBP.groups.flatMap((group) => group.details.map((detail) => detail.value))

    expect(ngnValues).toContain("4011482641")
    expect(usdValues).toContain("5250381250")
    expect(gbpValues).toContain("5250381346")
    expect(usdValues).toContain("GB71CITI18500810407909")
  })

  it("creates a clear transfer narration", () => {
    expect(getTransferNarration("MW-20260808-ABC123")).toBe("Donation MW-20260808-ABC123")
  })
})
