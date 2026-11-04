import { describe, expect, it } from "vitest"
import { serializeJsonLd } from "../lib/json-ld"

describe("JSON-LD through Hostinger preview rewriting", () => {
  it("preserves URLs, emails and Flight byte lengths through domain replacement", () => {
    const schema = {
      "@context": "https://schema.org",
      url: "https://www.medwhole.org/",
      email: "info@medwhole.org",
      description: "Community development. ".repeat(100),
    }
    const original = JSON.stringify(schema)
    const rewrite = (value: string) => value.replaceAll("medwhole.org", "aqua-jellyfish-909555.hostingersite.com")
    expect(Buffer.byteLength(rewrite(original))).not.toBe(Buffer.byteLength(original))

    const serialized = serializeJsonLd(schema)
    expect(Buffer.byteLength(rewrite(serialized))).toBe(Buffer.byteLength(serialized))
    expect(JSON.parse(rewrite(serialized))).toEqual(schema)
  })

  it("keeps decimal numbers, Unicode, escaped quotes and script boundaries safe", () => {
    const schema = {
      rating: 4.5,
      text: 'A "quoted.domain" and \\path. ₦ </script><script>alert(1)</script>',
      nested: [{ url: "https://medwhole.org/events/example.json", enabled: true }],
    }
    const serialized = serializeJsonLd(schema)
    expect(serialized).not.toContain("<")
    expect(JSON.parse(serialized)).toEqual(schema)
  })
})
