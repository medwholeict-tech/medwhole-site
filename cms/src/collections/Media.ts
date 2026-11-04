import type { CollectionConfig, Where } from 'payload'
import { canCreateContent, canEditDraftContent, canEditContent, hasRole, keepContributorContentDraft } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'application/pdf'],
  },
  versions: { drafts: true },
  access: {
    read: ({ req }) => {
      if (hasRole(req.user, ['administrator', 'editor', 'contributor'])) return true
      const publicMedia: Where = {
        and: [
          { _status: { equals: 'published' } },
          { or: [
            { consentConfirmed: { equals: true } },
            { category: { in: ['Partner', 'Documents'] } },
          ] },
        ],
      }
      return publicMedia
    },
    create: canCreateContent,
    update: canEditDraftContent,
    delete: canEditContent,
  },
  hooks: { beforeChange: [({ data, originalDoc, req }) => {
    const nextData = keepContributorContentDraft(data, req.user)
    const altReviewRequired = nextData.altReviewRequired ?? originalDoc?.altReviewRequired
    const consentReviewRequired = nextData.consentReviewRequired ?? originalDoc?.consentReviewRequired
    if (nextData._status === 'published' && (altReviewRequired || consentReviewRequired)) {
      throw new Error('Complete the alternative-text and consent review before publishing this media asset.')
    }
    return nextData
  }] },
  admin: { useAsTitle: 'alt', defaultColumns: ['alt', 'category', '_status', 'updatedAt'] },
  fields: [
    { name: 'alt', type: 'text', required: true, admin: { description: 'Describe the visible content and purpose of this asset.' } },
    { name: 'caption', type: 'text' },
    { name: 'credit', type: 'text' },
    { name: 'category', type: 'select', required: true, options: ['Homepage', 'Academy', 'Health', 'Empowerment', 'Community', 'Events', 'Team', 'Partner', 'Documents', 'Uncategorized'] },
    { name: 'consentConfirmed', type: 'checkbox', defaultValue: false, admin: { description: 'Required before publishing an identifiable person-focused image.' } },
    { name: 'source', type: 'text', admin: { description: 'Original source URL or library reference.' } },
    { name: 'sourceId', type: 'text', unique: true, index: true, admin: { readOnly: true, description: 'Original asset identifier retained for reconciliation.' } },
    { name: 'altReviewRequired', type: 'checkbox', defaultValue: false, admin: { description: 'This migrated asset needs meaningful alternative text before publication.' } },
    { name: 'consentReviewRequired', type: 'checkbox', defaultValue: false, admin: { description: 'Review source consent records and confirm consent or non-identifiability before publication.' } },
    { name: 'usageNotes', type: 'textarea', access: { read: ({ req }) => Boolean(req.user) } },
  ],
}
