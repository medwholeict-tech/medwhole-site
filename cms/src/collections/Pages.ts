import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { canCreateContent, canEditDraftContent, canEditContent, keepContributorContentDraft, publishedOrAuthenticated } from '../access/roles'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'path', '_status', 'updatedAt'] },
  versions: { drafts: { autosave: { interval: 1500 } }, maxPerDoc: 30 },
  access: {
    read: publishedOrAuthenticated,
    create: canCreateContent,
    update: canEditDraftContent,
    delete: canEditContent,
  },
  hooks: { beforeChange: [({ data, req }) => keepContributorContentDraft(data, req.user)] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'path', type: 'text', required: true, unique: true, index: true },
    { name: 'sourceCopyKey', type: 'text', unique: true, index: true, admin: { description: 'Stable source path used to safely import approved website copy.' } },
    { name: 'sourceSnapshot', type: 'json', admin: { description: 'Exact approved-copy source section data retained for review and traceability.' } },
    { name: 'metaDescription', type: 'textarea', maxLength: 180 },
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'textarea' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'heroImageAlt', type: 'text' },
    { name: 'pageContent', type: 'json', admin: { description: 'Structured content for this page layout. Keys map directly to the existing page sections.' } },
    { name: 'sections', type: 'blocks', blocks: [
      { slug: 'manuscript', labels: { singular: 'Text section', plural: 'Text sections' }, fields: [
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'text' },
        { name: 'body', type: 'richText', editor: lexicalEditor() },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'imageAlt', type: 'text' },
      ] },
      { slug: 'figures', labels: { singular: 'Impact figures', plural: 'Impact figures' }, fields: [
        { name: 'heading', type: 'text' },
        { name: 'items', type: 'array', minRows: 1, fields: [
          { name: 'value', type: 'text', required: true },
          { name: 'label', type: 'text', required: true },
        ] },
      ] },
      { slug: 'gallery', fields: [
        { name: 'heading', type: 'text' },
        { name: 'images', type: 'array', fields: [
          { name: 'asset', type: 'upload', relationTo: 'media', required: true },
          { name: 'alt', type: 'text', required: true },
        ] },
      ] },
      { slug: 'approved-content-section', labels: { singular: 'Approved copy section', plural: 'Approved copy sections' }, fields: [
        { name: 'sectionNumber', type: 'number', required: true },
        { name: 'sectionLabel', type: 'text', required: true },
        { name: 'sourceBlocks', type: 'json', required: true, admin: { description: 'Unmodified blocks from the approved website-copy document.' } },
      ] },
    ] },
  ],
}
