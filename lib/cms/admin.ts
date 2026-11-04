import "server-only"

import { payloadBaseUrl } from "./payload"

/**
 * Absolute URL for a page inside the Payload admin.
 *
 * Returns `null` when the CMS service is not configured so callers can show an
 * honest setup state instead of linking to a dead or relative path.
 */
export function cmsAdminUrl(path = ""): string | null {
  if (!payloadBaseUrl) return null
  if (!path) return `${payloadBaseUrl}/admin`
  const suffix = path.startsWith("/") ? path : `/${path}`
  return `${payloadBaseUrl}/admin${suffix}`
}

export function cmsCollectionUrl(collection: string): string | null {
  return cmsAdminUrl(`/collections/${collection}`)
}

export function cmsCreateUrl(collection: string): string | null {
  return cmsAdminUrl(`/collections/${collection}/create`)
}

export function cmsDocumentUrl(collection: string, id: string): string | null {
  return cmsAdminUrl(`/collections/${collection}/${encodeURIComponent(id)}`)
}

export function cmsGlobalUrl(slug: string): string | null {
  return cmsAdminUrl(`/globals/${slug}`)
}
