/** Preserve JSON-LD strings through hosting preview-domain substitutions. */
export function serializeJsonLd(data: Record<string, unknown>) {
  // React Flight prefixes long strings with their UTF-8 byte length. A hosting
  // proxy replacing domains after rendering changes that length and breaks
  // hydration. JSON Unicode escapes keep domains out of the proxy's search
  // while preserving the original URLs and email addresses for JSON readers.
  // Only escape string tokens so decimal numbers remain valid JSON numbers.
  return JSON.stringify(data).replace(/"(?:[^"\\]|\\.)*"/g, (token) =>
    token.replace(/\./g, "\\u002e").replace(/</g, "\\u003c"),
  )
}
