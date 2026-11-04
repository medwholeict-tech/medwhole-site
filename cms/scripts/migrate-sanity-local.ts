import { config } from 'dotenv'
import { createClient } from '@sanity/client'
import { getPayload } from 'payload'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import os from 'node:os'
import path from 'node:path'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(scriptDirectory, '../../.env.local'), quiet: true })
config({ path: path.resolve(scriptDirectory, '../.env.local'), override: true, quiet: true })
config({ quiet: true })

type Document = Record<string, unknown> & { _id: string; _type: string }
type Asset = { _id: string; url: string; originalFilename?: string; mimeType?: string }
type Collection = 'programmes' | 'events' | 'news'
type ApprovedPage = {
  path: string
  title: string
  description: string
  breadcrumb: string
  sections: Array<{ number: number; label: string; blocks: unknown[] }>
}

const typeToCollection: Record<string, Collection> = { program: 'programmes', event: 'events', news: 'news' }
const allowedTypes = Object.keys(typeToCollection)
const maxImageBytes = 30 * 1024 * 1024

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null
}
function string(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}
function slugValue(value: unknown): string | undefined {
  const record = object(value)
  return string(record?.current) || string(value)
}
function plainText(value: unknown): string {
  const spanText = (item: unknown): string => {
    if (Array.isArray(item)) return item.map(spanText).join('')
    const record = object(item)
    if (!record) return ''
    if (typeof record.text === 'string') return record.text
    return Array.isArray(record.children) ? spanText(record.children) : ''
  }
  return (Array.isArray(value) ? value : [value]).map(spanText).filter(Boolean).join('\n\n')
    .replace(/[\t\u00a0]+/g, ' ').replace(/ *\n */g, '\n').trim()
}
function readAlt(image: unknown): string | undefined {
  const record = object(image)
  return string(record?.alt) || string(object(record?.asset)?.alt)
}
function pillarFor(category: unknown): 'Health' | 'Literacy' | 'Empowerment' | undefined {
  switch (string(category)?.toLowerCase()) {
    case 'health': case 'nutrition': return 'Health'
    case 'education': return 'Literacy'
    case 'capacity': return 'Empowerment'
    default: return undefined
  }
}
function mediaCategoryFor(document: Document): string {
  if (document._type === 'event') return 'Events'
  if (document._type === 'program') {
    const pillar = pillarFor(document.category)
    if (pillar === 'Health' || pillar === 'Empowerment') return pillar
    if (pillar === 'Literacy') return 'Academy'
  }
  return 'Uncategorized'
}
function sourceImageRefs(value: unknown, onReference: (id: string, alt?: string) => void, inheritedAlt?: string): void {
  if (Array.isArray(value)) { value.forEach((item) => sourceImageRefs(item, onReference, inheritedAlt)); return }
  const record = object(value)
  if (!record) return
  const alt = string(record.alt) || inheritedAlt
  const ref = string(object(record.asset)?._ref)
  if (ref?.startsWith('image-')) onReference(ref, alt)
  for (const [key, child] of Object.entries(record)) if (key !== 'asset') sourceImageRefs(child, onReference, alt)
}
function mapDocument(document: Document, mediaIds: Map<string, string | number>) {
  const common = { _status: 'draft', sourceSanityId: document._id, sourceSnapshot: document }
  const image = object(document.featuredImage) || object(document.photo)
  const imageRef = string(object(image?.asset)?._ref)
  const imageFields = imageRef?.startsWith('image-') && mediaIds.has(imageRef)
    ? { image: mediaIds.get(imageRef), imageAlt: readAlt(image) || '' } : {}
  const slug = slugValue(document.slug)
  if (document._type === 'program') {
    const pillar = pillarFor(document.category)
    if (!pillar) throw new Error('Program has an unmapped category; import stopped to avoid misclassification.')
    const objectives = Array.isArray(document.objectives) ? document.objectives : []
    return { ...common, title: string(document.title), slug, pillar, category: string(document.category), summary: string(document.description), body: plainText(document.content), outcomes: objectives.map((item) => ({ text: String(item) })), featured: document.featured === true, ...imageFields }
  }
  if (document._type === 'event') {
    const startsAt = string(document.date)
    if (!startsAt || Number.isNaN(Date.parse(startsAt))) throw new Error('Event is missing a valid start date; import stopped.')
    return { ...common, title: string(document.title), slug, standfirst: string(document.excerpt), body: [string(document.description), plainText(document.content)].filter(Boolean).join('\n\n'), startsAt, endsAt: string(document.endDate), location: string(document.venue) || string(document.location), category: string(document.category), registrationUrl: string(document.registrationUrl), featured: document.featured === true, ...imageFields }
  }
  const category = string(document.category)
  const publishedAt = string(document.publishedAt)
  if (!['announcement', 'quarterly-report', 'research', 'impact-story', 'partnership', 'program-update', 'Programme reports', 'Quarterly reports', 'Partnerships', 'Announcements'].includes(category || '')) {
    throw new Error('News article has an unmapped category; import stopped to preserve the original taxonomy.')
  }
  return { ...common, title: string(document.title), slug, category, summary: string(document.excerpt), body: plainText(document.content), author: string(document.author), publishedAt, featured: document.featured === true, ...imageFields }
}
function validateMapped(document: Document, collection: Collection, data: Record<string, unknown>) {
  const missing = ['title', 'slug'].filter((key) => !string(data[key]))
  if (collection === 'programmes' && !string(data.pillar)) missing.push('pillar')
  if (collection === 'news' && !string(data.category)) missing.push('category')
  if (collection === 'events' && !string(data.startsAt)) missing.push('startsAt')
  if (missing.length) throw new Error(`${document._type} has missing required values: ${missing.join(', ')}.`)
}
function mapApprovedPage(page: ApprovedPage, digest: string) {
  const allBlocks = page.sections.flatMap((section) => section.blocks)
  const heading = allBlocks.find((block) => object(block)?.kind === 'heading')
  const subheading = allBlocks.find((block) => object(block)?.kind === 'subheading')
  return {
    _status: 'draft', sourceCopyKey: `approved-copy:${page.path}`,
    sourceSnapshot: { source: 'MedWHOLE-Website-Copy.docx', sha256: digest, page },
    title: page.title, path: page.path, metaDescription: page.description,
    ...(page.breadcrumb ? { eyebrow: page.breadcrumb } : {}),
    heading: string(object(heading)?.text) || page.title, subheading: string(object(subheading)?.text) || '',
    sections: page.sections.map((section) => ({ blockType: 'approved-content-section', sectionNumber: section.number, sectionLabel: section.label, sourceBlocks: section.blocks })),
  }
}
function collectMapping(documents: Document[]) {
  const errors: Array<{ type: string; message: string }> = []
  const mapped = documents.flatMap((document) => {
    try {
      const collection = typeToCollection[document._type]
      const data = mapDocument(document, new Map())
      validateMapped(document, collection, data)
      return [{ document, collection }]
    } catch (error) {
      errors.push({ type: document._type, message: error instanceof Error ? error.message : 'Mapping failed.' })
      return []
    }
  })
  return { mapped, errors }
}

async function main() {
  const apply = process.argv.includes('--apply')
  const updateExisting = process.argv.includes('--update-existing')
  if (updateExisting && !apply) throw new Error('--update-existing requires --apply.')
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_API_TOKEN
  if (!projectId || !dataset) throw new Error('Sanity project configuration is missing.')
  if (apply && (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET)) throw new Error('Apply requires CMS DATABASE_URL and PAYLOAD_SECRET; no writes were made.')

  const sanity = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false, ...(token ? { token } : {}) })
  const source = await sanity.fetch<Document[]>('*[_type in $types && !(_id in path("drafts.**")) && isActive != false] | order(_type asc, _id asc)', { types: allowedTypes })
  const selected = source.filter((document) => typeToCollection[document._type])
  const { mapped, errors } = collectMapping(selected)
  const approvedCopy = JSON.parse(await readFile(new URL('../../lib/approved-website-copy.json', import.meta.url), 'utf8')) as { sha256: string; pages: Record<string, ApprovedPage> }
  const approvedPages = Object.values(approvedCopy.pages)
  const altByAsset = new Map<string, string>()
  const categoryByAsset = new Map<string, Set<string>>()
  const referencedAssets = new Set<string>()
  for (const document of selected) sourceImageRefs(document, (id, alt) => {
    referencedAssets.add(id)
    if (alt) altByAsset.set(id, alt)
    const categories = categoryByAsset.get(id) || new Set<string>()
    categories.add(mediaCategoryFor(document)); categoryByAsset.set(id, categories)
  })
  const assets = await sanity.fetch<Asset[]>('*[_type == "sanity.imageAsset"]{_id,url,originalFilename,mimeType} | order(_id asc)')
  const assetIds = new Set(assets.map((asset) => asset._id))
  const missingAssets = [...referencedAssets].filter((id) => !assetIds.has(id))
  const counts = mapped.reduce<Record<string, number>>((result, item) => { result[item.collection] = (result[item.collection] || 0) + 1; return result }, {})
  const summary = {
    mode: apply ? 'apply' : 'dry-run',
    documents: { selected: selected.length, mapped: mapped.length, byCollection: counts },
    approvedCopy: { pages: approvedPages.length, sourceDigest: approvedCopy.sha256, allWillBeDrafts: true },
    media: { referenced: referencedAssets.size, libraryAssets: assets.length, unreferenced: assets.filter((asset) => !referencedAssets.has(asset._id)).length, missingReferencedAssets: missingAssets.length, altReviewRequired: assets.filter((asset) => !altByAsset.has(asset._id)).length, consentReviewRequired: assets.length },
    mappingErrors: errors.length, allRecordsWillBeDrafts: true, sourceSanityRecordsWillBeDeleted: false,
  }
  console.log(JSON.stringify(summary, null, 2))
  if (errors.length) { for (const error of errors) console.error(`${error.type}: ${error.message}`); throw new Error('Resolve mapping errors before applying.') }
  if (missingAssets.length) throw new Error('Some referenced image assets are missing; resolve them before applying.')
  if (!apply) return

  const { default: configPayload } = await import('../payload.config')
  const payload = await getPayload({ config: configPayload })
  const mediaIds = new Map<string, string | number>()
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'medwhole-sanity-'))
  const results: Record<string, { created: number; updated: number; skippedExisting: number }> = {}
  const pageResults = { created: 0, updated: 0, skippedExisting: 0 }
  try {
    let assetSequence = 0
    for (const asset of assets) {
      const existing = await payload.find({ collection: 'media', where: { sourceSanityId: { equals: asset._id } }, limit: 1, depth: 0, draft: true, overrideAccess: true })
      if (existing.docs[0]) { mediaIds.set(asset._id, existing.docs[0].id); continue }
      const sourceUrl = new URL(asset.url)
      if (sourceUrl.protocol !== 'https:' || sourceUrl.hostname !== 'cdn.sanity.io') throw new Error('Sanity returned an unexpected media host; refusing to fetch it.')
      const response = await fetch(sourceUrl)
      if (!response.ok) throw new Error(`Sanity media download returned HTTP ${response.status}.`)
      const declaredLength = Number(response.headers.get('content-length') || 0)
      if (declaredLength > maxImageBytes) throw new Error('Media asset exceeds the 30 MB migration limit.')
      const bytes = Buffer.from(await response.arrayBuffer())
      if (bytes.byteLength > maxImageBytes) throw new Error('Media asset exceeds the 30 MB migration limit.')
      const mimeType = asset.mimeType || response.headers.get('content-type') || 'application/octet-stream'
      if (!mimeType.startsWith('image/')) throw new Error('Sanity library contains a non-image asset; refusing to import it as media.')
      const extension = path.extname(new URL(asset.url).pathname) || (mimeType.split('/')[1] ? `.${mimeType.split('/')[1].replace('jpeg', 'jpg')}` : '.img')
      const filename = (asset.originalFilename || `${asset._id}${extension}`).replace(/[\\/:*?"<>|]/g, '_')
      const filePath = path.join(tempDir, `${assetSequence++}-${filename}`)
      await writeFile(filePath, bytes, { flag: 'wx' })
      const categories = [...(categoryByAsset.get(asset._id) || new Set<string>())].filter((category) => category !== 'Uncategorized')
      const category = categories.length === 1 ? categories[0] : 'Uncategorized'
      const created = await payload.create({
        collection: 'media', overrideAccess: true, draft: true, filePath,
        data: { alt: altByAsset.get(asset._id) || 'Alternative text required—review before publishing.', category, consentConfirmed: false, altReviewRequired: !altByAsset.has(asset._id), consentReviewRequired: true, source: asset.url, sourceSanityId: asset._id, _status: 'draft' },
      })
      mediaIds.set(asset._id, created.id)
    }

    for (const { document, collection } of mapped) {
      const data = mapDocument(document, mediaIds)
      validateMapped(document, collection, data)
      const existing = await payload.find({ collection, where: { sourceSanityId: { equals: document._id } }, limit: 1, depth: 0, draft: true, overrideAccess: true })
      let action: 'created' | 'updated' | 'skippedExisting'
      if (existing.docs[0] && !updateExisting) action = 'skippedExisting'
      else if (existing.docs[0]) {
        await payload.update({ collection, id: existing.docs[0].id, data, draft: true, overrideAccess: true })
        action = 'updated'
      } else {
        await payload.create({ collection, data, draft: true, overrideAccess: true })
        action = 'created'
      }
      const current = results[collection] || { created: 0, updated: 0, skippedExisting: 0 }
      current[action] += 1; results[collection] = current
    }

    for (const page of approvedPages) {
      const data = mapApprovedPage(page, approvedCopy.sha256)
      const existing = await payload.find({ collection: 'pages', where: { sourceCopyKey: { equals: data.sourceCopyKey } }, limit: 1, depth: 0, draft: true, overrideAccess: true })
      if (existing.docs[0] && !updateExisting) { pageResults.skippedExisting += 1; continue }
      if (!existing.docs[0]) {
        const conflict = await payload.find({ collection: 'pages', where: { path: { equals: page.path } }, limit: 1, depth: 0, draft: true, overrideAccess: true })
        if (conflict.docs[0]) throw new Error(`Payload already has a Page at ${page.path} not managed by this importer; refusing to overwrite it.`)
      }
      if (existing.docs[0]) {
        await payload.update({ collection: 'pages', id: existing.docs[0].id, data, draft: true, overrideAccess: true }); pageResults.updated += 1
      } else {
        await payload.create({ collection: 'pages', data, draft: true, overrideAccess: true }); pageResults.created += 1
      }
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true })
    await payload.destroy()
  }
  console.log(JSON.stringify({ completed: true, mediaMigrated: mediaIds.size, documents: results, approvedCopyPages: pageResults }, null, 2))
}

main().catch((error: unknown) => {
  console.error(`Sanity → Payload local migration stopped: ${error instanceof Error ? error.message : 'unknown error'}`)
  process.exitCode = 1
})
