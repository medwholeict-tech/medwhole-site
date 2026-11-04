import "server-only"

type DeliveryStatus = "sent" | "failed"

/** Record email metadata only; never send message bodies or secrets to the CMS. */
export async function recordPayloadEmailDelivery(input: {
  template: string
  recordId: string
  recipient: string
  providerId?: string
  status: DeliveryStatus
  error?: unknown
}) {
  const baseUrl = process.env.PAYLOAD_CMS_URL?.replace(/\/$/, "")
  const apiKey = process.env.PAYLOAD_CMS_WEBSITE_API_KEY
  if (!baseUrl || !apiKey) return

  const errorMessage = input.error instanceof Error ? input.error.message : typeof input.error === "string" ? input.error : undefined
  try {
    const response = await fetch(`${baseUrl}/api/email-deliveries`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `administrators API-Key ${apiKey}`,
      },
      body: JSON.stringify({
        template: input.template,
        recordId: input.recordId,
        recipient: input.recipient,
        providerId: input.providerId,
        status: input.status,
        attempts: 1,
        lastError: errorMessage?.slice(0, 1000),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    })
    if (!response.ok) console.warn("Payload email delivery log was rejected", response.status)
  } catch (error) {
    console.error("Could not record email delivery metadata", error)
  }
}
