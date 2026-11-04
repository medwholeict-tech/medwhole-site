import { describe, expect, it } from "vitest"
import { contactFormSchema } from "../lib/contact"
import { newsletterFormSchema } from "../lib/newsletter"

describe("engagement form validation", () => {
  it("accepts a complete contact enquiry", () => {
    const result = contactFormSchema.safeParse({
      name: "Ada Okafor",
      email: "ada@example.com",
      subject: "Partnerships",
      message: "I would like to discuss a community partnership.",
    })

    expect(result.success).toBe(true)
  })

  it("rejects an invalid contact email", () => {
    const result = contactFormSchema.safeParse({
      name: "Ada Okafor",
      email: "not-an-email",
      subject: "Partnerships",
      message: "I would like to discuss a community partnership.",
    })

    expect(result.success).toBe(false)
  })

  it("normalises a newsletter signup", () => {
    const result = newsletterFormSchema.parse({
      name: "  Ada Okafor  ",
      email: "ada@example.com",
      source: "news-page",
    })

    expect(result).toMatchObject({
      name: "Ada Okafor",
      email: "ada@example.com",
      source: "news-page",
      interests: [],
    })
  })

  it("rejects bot-filled honeypots", () => {
    const result = newsletterFormSchema.safeParse({
      email: "bot@example.com",
      website: "https://spam.example.com",
    })

    expect(result.success).toBe(false)
  })
})
