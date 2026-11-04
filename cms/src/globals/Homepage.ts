import type { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { canEditContent } from '../access/roles'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: { read: () => true, update: canEditContent },
  versions: { drafts: { autosave: true }, max: 30 },
  fields: [
    { name: 'hero', type: 'group', fields: [
      { name: 'heading', type: 'text', required: true },
      { name: 'description', type: 'textarea', required: true },
      { name: 'video', type: 'upload', relationTo: 'media' },
      { name: 'videoUrl', type: 'text', admin: { description: 'Optional hosted video URL; use an approved MedWHOLE video asset.' } },
      { name: 'poster', type: 'upload', relationTo: 'media' },
      { name: 'primaryCtaLabel', type: 'text' },
      { name: 'primaryCtaHref', type: 'text' },
      { name: 'secondaryCtaLabel', type: 'text' },
      { name: 'secondaryCtaHref', type: 'text' },
    ] },
    { name: 'impactFigures', type: 'array', fields: [
      { name: 'value', type: 'text', required: true },
      { name: 'label', type: 'text', required: true },
      { name: 'sourceNote', type: 'text', admin: { description: 'Internal evidence/source note for this figure.' } },
    ] },
    { name: 'featuredStory', type: 'relationship', relationTo: 'impact-stories' },
    { name: 'featuredProgrammes', type: 'relationship', relationTo: 'programmes', hasMany: true },
    { name: 'communityFeature', type: 'relationship', relationTo: 'communities' },
    { name: 'flowingGallery', type: 'relationship', relationTo: 'media', hasMany: true },
    { name: 'manifesto', type: 'richText', editor: lexicalEditor() },
    { name: 'content', type: 'json', admin: { description: 'Structured homepage copy for the bespoke layout. Keys map to the existing homepage sections.' } },
  ],
}
