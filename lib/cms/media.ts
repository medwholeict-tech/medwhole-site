/** Resolve a Payload media relation or a local/public image URL. */
export function mediaUrl(value: unknown): string | undefined {
  if (!value) return undefined
  const url = typeof value === "string" ? value : typeof value === "object" && "url" in value ? (value as { url?: unknown }).url : undefined
  if (typeof url !== "string" || !url) return undefined
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith("/api/media/")) return `${process.env.PAYLOAD_CMS_URL?.replace(/\/$/, "") || ""}${url}`
  if (url.startsWith("/") && !url.startsWith("//")) return url
  return undefined
}
