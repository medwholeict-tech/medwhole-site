import type { CollectionConfig, Field } from 'payload'
import { canCreateContent, canEditDraftContent, canEditContent, keepContributorContentDraft, publishedOrAuthenticated } from '../access/roles'

const contentAccess = {
  read: publishedOrAuthenticated,
  create: canCreateContent,
  update: canEditDraftContent,
  delete: canEditContent,
}

function editorialCollection(
  slug: string,
  titleField: string,
  fields: Field[],
): CollectionConfig {
  return {
    slug,
    admin: { useAsTitle: titleField, defaultColumns: [titleField, 'updatedAt', '_status'] },
    access: contentAccess,
    versions: { drafts: { autosave: { interval: 1500 } }, maxPerDoc: 30 },
    hooks: { beforeChange: [({ data, req }) => keepContributorContentDraft(data, req.user)] },
    fields: [
      ...fields,
      { name: 'sourceSanityId', type: 'text', unique: true, index: true, admin: { description: 'Stable source ID used for safe, repeatable Sanity imports.' } },
      { name: 'sourceSnapshot', type: 'json', admin: { description: 'Read-only migration record of the original source document.' } },
    ],
  }
}

const slugField: Field = { name: 'slug', type: 'text', required: true, unique: true, index: true }
const summaryField: Field = { name: 'summary', type: 'textarea', maxLength: 320 }
const imageField: Field = { name: 'image', type: 'upload', relationTo: 'media' }
const bodyField: Field = { name: 'body', type: 'textarea' }

export const Programmes = editorialCollection('programmes', 'title', [
  { name: 'title', type: 'text', required: true }, slugField,
  { name: 'pillar', type: 'select', required: true, options: ['Health', 'Literacy', 'Empowerment'] },
  { name: 'category', type: 'text' }, summaryField, bodyField,
  { name: 'outcomes', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
  imageField, { name: 'imageAlt', type: 'text' }, { name: 'featured', type: 'checkbox', defaultValue: false },
  { name: 'order', type: 'number', defaultValue: 0 },
])

export const Events = editorialCollection('events', 'title', [
  { name: 'title', type: 'text', required: true }, slugField,
  { name: 'standfirst', type: 'textarea' }, bodyField,
  { name: 'startsAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
  { name: 'endsAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
  { name: 'location', type: 'text' }, { name: 'category', type: 'text' },
  imageField, { name: 'imageAlt', type: 'text' }, { name: 'registrationUrl', type: 'text' },
  { name: 'featured', type: 'checkbox', defaultValue: false },
  { name: 'gallery', type: 'relationship', relationTo: 'media', hasMany: true },
])

export const News = editorialCollection('news', 'title', [
  { name: 'title', type: 'text', required: true }, slugField,
  { name: 'category', type: 'select', required: true, options: [
    { label: 'Programme reports', value: 'Programme reports' },
    { label: 'Quarterly reports', value: 'Quarterly reports' },
    { label: 'Partnerships', value: 'Partnerships' },
    { label: 'Announcements', value: 'Announcements' },
    { label: 'Announcement (Sanity)', value: 'announcement' },
    { label: 'Quarterly report (Sanity)', value: 'quarterly-report' },
    { label: 'Research (Sanity)', value: 'research' },
    { label: 'Impact story (Sanity)', value: 'impact-story' },
    { label: 'Partnership (Sanity)', value: 'partnership' },
    { label: 'Program update (Sanity)', value: 'program-update' },
  ] },
  summaryField, bodyField, imageField, { name: 'imageAlt', type: 'text' },
  { name: 'author', type: 'text' }, { name: 'publishedAt', type: 'date' },
  { name: 'featured', type: 'checkbox', defaultValue: false },
])

export const Communities = editorialCollection('communities', 'name', [
  { name: 'name', type: 'text', required: true }, slugField,
  { name: 'location', type: 'text', required: true },
  { name: 'establishedAt', type: 'date' }, summaryField, bodyField,
  imageField, { name: 'imageAlt', type: 'text' },
  { name: 'sections', type: 'array', fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
  ] },
])

export const ImpactStories = editorialCollection('impact-stories', 'title', [
  { name: 'title', type: 'text', required: true }, { name: 'location', type: 'text' },
  { name: 'date', type: 'date' }, summaryField, bodyField, imageField,
  { name: 'imageAlt', type: 'text' },
])

export const TeamMembers = editorialCollection('team-members', 'name', [
  { name: 'name', type: 'text', required: true }, { name: 'role', type: 'text', required: true },
  { name: 'biography', type: 'textarea' }, imageField, { name: 'imageAlt', type: 'text' },
  { name: 'email', type: 'email', access: { read: ({ req }) => Boolean(req.user) } },
  { name: 'linkedinUrl', type: 'text' }, { name: 'order', type: 'number', defaultValue: 0 },
])

export const Partners = editorialCollection('partners', 'name', [
  { name: 'name', type: 'text', required: true }, summaryField,
  { name: 'logo', type: 'upload', relationTo: 'media' }, { name: 'websiteUrl', type: 'text' },
  { name: 'order', type: 'number', defaultValue: 0 },
])

export const Resources = editorialCollection('resources', 'title', [
  { name: 'title', type: 'text', required: true }, summaryField,
  { name: 'category', type: 'text', required: true },
  { name: 'document', type: 'upload', relationTo: 'media', required: true },
  { name: 'author', type: 'text' }, { name: 'publishedAt', type: 'date' },
])

export const Jobs = editorialCollection('jobs', 'title', [
  { name: 'title', type: 'text', required: true }, slugField,
  { name: 'department', type: 'text', required: true }, { name: 'location', type: 'text', required: true },
  { name: 'type', type: 'text', required: true }, { name: 'level', type: 'text' },
  bodyField, { name: 'deadline', type: 'date' },
])

