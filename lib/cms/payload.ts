import "server-only"

import type { CmsCollection, CmsDocument, CmsHealth, CmsListResponse } from "./types"

const baseUrl = process.env.PAYLOAD_CMS_URL?.replace(/\/$/, "") || null
const readApiKey = process.env.PAYLOAD_CMS_READ_API_KEY || null
const adminApiKey = process.env.PAYLOAD_CMS_ADMIN_API_KEY || null
const operationsApiKey = process.env.PAYLOAD_CMS_OPERATIONS_API_KEY || null
const financeApiKey = process.env.PAYLOAD_CMS_FINANCE_API_KEY || null
const websiteApiKey = process.env.PAYLOAD_CMS_WEBSITE_API_KEY || null

export const payloadBaseUrl = baseUrl

function getHeaders(key = adminApiKey) {
  return {
    Accept: "application/json",
    ...(key ? { Authorization: `administrators API-Key ${key}` } : {}),
  }
}

async function payloadFailure(response: Response) {
  try {
    const body = (await response.clone().json()) as {
      errors?: Array<{ message?: unknown }>
      message?: unknown
    }
    const detail = body?.errors?.find((item) => typeof item?.message === "string")?.message
    if (typeof detail === "string" && detail.trim()) return `Payload: ${detail}`
    if (typeof body?.message === "string" && body.message.trim()) return `Payload: ${body.message}`
  } catch {
    // The response was not JSON; fall back to the HTTP status.
  }
  return `Payload request failed with HTTP ${response.status}`
}

export function isPayloadConfigured() {
  return Boolean(baseUrl && readApiKey)
}

export function isPayloadPublicEnabled() {
  return Boolean(baseUrl && readApiKey && process.env.PAYLOAD_CMS_PUBLIC_ENABLED !== "false")
}

export async function listPublicPayloadDocuments<T extends CmsDocument = CmsDocument>(
  collection: CmsCollection,
  query = "",
  revalidate = 60,
): Promise<CmsListResponse<T>> {
  if (!baseUrl || !readApiKey) throw new Error("Payload CMS public read integration is not configured")
  const response = await fetch(`${baseUrl}/api/${collection}${query ? `?${query.replace(/^\?/, "")}` : ""}`, {
    headers: getHeaders(readApiKey),
    next: { revalidate, tags: [`payload:${collection}`] },
  })
  if (!response.ok) throw new Error(`Payload request failed with HTTP ${response.status}`)
  return response.json() as Promise<CmsListResponse<T>>
}

export async function getPublicPayloadDocument<T extends CmsDocument = CmsDocument>(
  collection: CmsCollection,
  id: string,
  revalidate = 60,
): Promise<T> {
  if (!baseUrl || !readApiKey) throw new Error("Payload CMS public read integration is not configured")
  const response = await fetch(`${baseUrl}/api/${collection}/${encodeURIComponent(id)}?depth=1`, {
    headers: getHeaders(readApiKey),
    next: { revalidate, tags: [`payload:${collection}`] },
  })
  if (!response.ok) throw new Error(`Payload request failed with HTTP ${response.status}`)
  return response.json() as Promise<T>
}

export async function getPublicPayloadGlobal<T extends Record<string, unknown> = Record<string, unknown>>(
  slug: "homepage" | "site-settings" | "navigation",
  revalidate = 60,
): Promise<T> {
  if (!baseUrl || !readApiKey) throw new Error("Payload CMS public read integration is not configured")
  const response = await fetch(`${baseUrl}/api/globals/${slug}?depth=1`, {
    headers: getHeaders(readApiKey),
    next: { revalidate, tags: [`payload:global:${slug}`] },
  })
  if (!response.ok) throw new Error(`Payload request failed with HTTP ${response.status}`)
  return response.json() as Promise<T>
}

export async function createWebsiteSubmission(
  collection: "contact-submissions" | "volunteer-applications" | "partnership-applications" | "newsletter-subscribers" | "event-registrations" | "donation-intents",
  data: Record<string, unknown>,
) {
  if (!baseUrl || !websiteApiKey) throw new Error("Payload website submission integration is not configured")
  const response = await fetch(`${baseUrl}/api/${collection}`, {
    method: "POST",
    headers: { ...getHeaders(websiteApiKey), "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
  })
  if (!response.ok) throw new Error(`Payload submission failed with HTTP ${response.status}`)
  return response.json()
}

export async function payloadHealth(): Promise<CmsHealth> {
  const checkedAt = new Date().toISOString()
  if (!baseUrl || !readApiKey) {
    return { configured: false, adminConfigured: Boolean(adminApiKey), reachable: false, baseUrl, checkedAt, error: "Payload CMS read credentials are not configured" }
  }

  try {
    const response = await fetch(`${baseUrl}/api/globals/site-settings?depth=0`, {
      headers: getHeaders(readApiKey),
      cache: "no-store",
    })
    return response.ok
      ? { configured: true, adminConfigured: Boolean(adminApiKey), reachable: true, baseUrl, checkedAt }
      : { configured: true, adminConfigured: Boolean(adminApiKey), reachable: false, baseUrl, checkedAt, error: `Payload returned HTTP ${response.status}` }
  } catch {
    return { configured: true, adminConfigured: Boolean(adminApiKey), reachable: false, baseUrl, checkedAt, error: "Payload could not be reached" }
  }
}

export async function listPayloadDocuments<T extends CmsDocument = CmsDocument>(
  collection: CmsCollection,
  query = "",
): Promise<CmsListResponse<T>> {
  if (!baseUrl || !adminApiKey) throw new Error("Payload CMS admin integration is not configured")
  const separator = query ? (query.startsWith("?") ? "" : "?") : ""
  const response = await fetch(`${baseUrl}/api/${collection}${separator}${query.replace(/^\?/, "")}`, {
    headers: getHeaders(),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Payload request failed with HTTP ${response.status}`)
  return response.json() as Promise<CmsListResponse<T>>
}

export async function createPayloadDocument<T extends CmsDocument = CmsDocument>(collection: CmsCollection, data: Record<string, unknown>) {
  return payloadWrite<T>(collection, undefined, data)
}

export async function updatePayloadDocument<T extends CmsDocument = CmsDocument>(collection: CmsCollection, id: string, data: Record<string, unknown>) {
  return payloadWrite<T>(collection, id, data)
}

const financeCollections = new Set<CmsCollection>(["donation-intents", "donation-payments"])
const operationalCollections = new Set<CmsCollection>([
  "contact-submissions", "volunteer-applications", "partnership-applications",
  "newsletter-subscribers", "event-registrations",
  "email-deliveries",
])

function keyForPrivateCollection(collection: CmsCollection) {
  return financeCollections.has(collection) ? financeApiKey : operationsApiKey
}

export async function listPrivatePayloadDocuments<T extends CmsDocument = CmsDocument>(collection: CmsCollection, query = ""): Promise<CmsListResponse<T>> {
  const key = keyForPrivateCollection(collection)
  if (!baseUrl || !key || (!financeCollections.has(collection) && !operationalCollections.has(collection))) {
    throw new Error("Payload private inbox access is not configured")
  }
  const response = await fetch(`${baseUrl}/api/${collection}${query ? `?${query.replace(/^\?/, "")}` : ""}`, {
    headers: getHeaders(key), cache: "no-store",
  })
  if (!response.ok) throw new Error(`Payload request failed with HTTP ${response.status}`)
  return response.json() as Promise<CmsListResponse<T>>
}

export async function updatePrivatePayloadDocument<T extends CmsDocument = CmsDocument>(collection: CmsCollection, id: string, data: Record<string, unknown>): Promise<T> {
  const key = keyForPrivateCollection(collection)
  if (!baseUrl || !key || (!financeCollections.has(collection) && !operationalCollections.has(collection))) {
    throw new Error("Payload private inbox access is not configured")
  }
  const response = await fetch(`${baseUrl}/api/${collection}/${encodeURIComponent(id)}`, {
    method: "PATCH", headers: { ...getHeaders(key), "Content-Type": "application/json" },
    body: JSON.stringify(data), cache: "no-store",
  })
  if (!response.ok) throw new Error(await payloadFailure(response))
  return response.json() as Promise<T>
}

export async function getPayloadDocument<T extends CmsDocument = CmsDocument>(collection: CmsCollection, id: string): Promise<T> {
  if (!baseUrl || !adminApiKey) throw new Error("Payload CMS admin integration is not configured")
  const response = await fetch(`${baseUrl}/api/${collection}/${encodeURIComponent(id)}?depth=0`, { headers: getHeaders(), cache: "no-store" })
  if (!response.ok) throw new Error(`Payload request failed with HTTP ${response.status}`)
  return response.json() as Promise<T>
}

export async function uploadPayloadMedia(formData: FormData) {
  if (!baseUrl || !adminApiKey) throw new Error("Payload CMS admin integration is not configured")
  const file = formData.get("file")
  if (!(file instanceof Blob)) throw new Error("A media file is required")
  const fields: Record<string, string> = {}
  for (const [name, value] of formData.entries()) {
    if (name !== "file" && typeof value === "string") fields[name] = value
  }
  const payloadFormData = new FormData()
  payloadFormData.set("file", file, file instanceof File ? file.name : "upload")
  payloadFormData.set("_payload", JSON.stringify(fields))
  const response = await fetch(`${baseUrl}/api/media`, { method: "POST", headers: getHeaders(), body: payloadFormData, cache: "no-store" })
  if (!response.ok) throw new Error(await payloadFailure(response))
  return response.json()
}

export async function getPayloadGlobal<T extends Record<string, unknown> = Record<string, unknown>>(slug: "homepage" | "site-settings"): Promise<T> {
  if (!baseUrl || !adminApiKey) throw new Error("Payload CMS admin integration is not configured")
  const response = await fetch(`${baseUrl}/api/globals/${slug}?depth=0`, { headers: getHeaders(), cache: "no-store" })
  if (!response.ok) throw new Error(await payloadFailure(response))
  return response.json() as Promise<T>
}

export async function updatePayloadGlobal(slug: "homepage" | "site-settings", data: Record<string, unknown>) {
  if (!baseUrl || !adminApiKey) throw new Error("Payload CMS admin integration is not configured")
  const response = await fetch(`${baseUrl}/api/globals/${slug}`, {
    method: "POST",
    headers: { ...getHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(await payloadFailure(response))
  return response.json()
}

async function payloadWrite<T extends CmsDocument>(collection: CmsCollection, id: string | undefined, data: Record<string, unknown>): Promise<T> {
  if (!baseUrl || !adminApiKey) throw new Error("Payload CMS admin integration is not configured")
  const response = await fetch(`${baseUrl}/api/${collection}${id ? `/${encodeURIComponent(id)}` : ""}`, {
    method: id ? "PATCH" : "POST",
    headers: { ...getHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(await payloadFailure(response))
  return response.json() as Promise<T>
}
