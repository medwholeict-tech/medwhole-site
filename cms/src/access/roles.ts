import type { Access, FieldAccess, PayloadRequest } from 'payload'

export type CmsRole = 'administrator' | 'editor' | 'contributor' | 'content_read' | 'operations' | 'finance' | 'website_service'

export function hasRole(user: unknown, roles: CmsRole[]) {
  if (!user || typeof user !== 'object' || !('roles' in user)) return false
  const assigned = (user as { roles?: unknown }).roles
  return Array.isArray(assigned) && assigned.some((role) => roles.includes(role as CmsRole))
}

export const authenticated: Access = ({ req }) => Boolean(req.user)
export const isAdmin = ({ req }: { req: PayloadRequest }) => hasRole(req.user, ['administrator'])
export const canReadAdministrator: Access = ({ req }) => {
  if (hasRole(req.user, ['administrator'])) return true
  return req.user ? { id: { equals: req.user.id } } : false
}
export const bootstrapAdministrator = async ({ req }: { req: PayloadRequest }) => {
  if (req.user) return hasRole(req.user, ['administrator'])
  const existing = await req.payload.count({ collection: 'administrators', overrideAccess: true })
  return existing.totalDocs === 0
}
export const canAccessAdmin = ({ req }: { req: PayloadRequest }) => hasRole(req.user, ['administrator', 'editor', 'contributor', 'operations', 'finance'])
export const canEditContent = ({ req }: { req: PayloadRequest }) => hasRole(req.user, ['administrator', 'editor'])
export const canCreateContent: Access = ({ req }) => hasRole(req.user, ['administrator', 'editor', 'contributor'])
export const canEditDraftContent: Access = ({ req }) => {
  if (hasRole(req.user, ['administrator', 'editor'])) return true
  if (hasRole(req.user, ['contributor'])) return { _status: { equals: 'draft' } }
  return false
}
export function keepContributorContentDraft<T extends { _status?: unknown }>(data: T, user: unknown): T {
  return hasRole(user, ['contributor']) ? { ...data, _status: 'draft' } : data
}
export const canCreateSubmissions: Access = ({ req }) => hasRole(req.user, ['administrator', 'operations', 'website_service'])
export const canCreateDonations: Access = ({ req }) => hasRole(req.user, ['administrator', 'finance', 'website_service'])
export const canReadSubmissions = ({ req }: { req: PayloadRequest }) => hasRole(req.user, ['administrator', 'operations'])
export const canReadDonations = ({ req }: { req: PayloadRequest }) => hasRole(req.user, ['administrator', 'finance'])
export const adminOnlyField: FieldAccess = ({ req }) => hasRole(req.user, ['administrator'])

export const publishedOrAuthenticated: Access = ({ req }) => {
  if (hasRole(req.user, ['administrator', 'editor', 'contributor'])) return true
  return { _status: { equals: 'published' } }
}

export const privateRecordAccess = {
  create: canCreateSubmissions,
  read: canReadSubmissions,
  update: canReadSubmissions,
  delete: isAdmin,
}

