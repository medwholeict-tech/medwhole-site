import { config } from 'dotenv'
import { createClient } from '@sanity/client'
import { readFile } from 'node:fs/promises'

config({ path: '.env.local', quiet: true })
config({ quiet: true })

type Document = Record<string, unknown> & { _id: string; _type: string }
type PayloadDocument = { id: string }
type Asset = { _id: string; url: string; originalFilename?: string; mimeType?: string }
type Collection = 'programmes' | 'events' | 'news'
type ApprovedPage = {
  path: string
  title: string
  description: string
  breadcrumb: string
  sections: Array<{ number: number; label: string; blocks: unknown[] }>
}

const typeToCollection: Record<string, Collection> = {
  program: 'programmes',
  event: 'events',
  news: 'news',
}
const allowedTypes = Object.keys(typeToCollection)
const maxImageBytes = 30 * 1024 * 1024

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
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
  const blocks = Array.isArray(value) ? value : [value]
  return blocks.map(spanText).filter(Boolean).join('\n\n')
    .replace(/[\t\u00a0]+/g, ' ').replace(/ *\n */g, '\n').trim()
}

function readAlt(image: unknown): string | undefined {
  const record = object(image)
  return string(record?.alt) || string(object(record?.asset)?.alt)
}

function pillarFor(category: unknown): 'Health' | 'Literacy' | 'Empowerment' | undefined {
  switch (string(category)?.toLowerCase()) {
    case 'health':
    case 'nutrition': return 'Health'
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
  if (Array.isArray(value)) {
    value.forEach((item) => sourceImageRefs(item, onReference, inheritedAlt))
    return
  }
  const record = object(value)
  if (!record) return
  const alt = string(record.alt) || inheritedAlt
  const asset = object(record.asset)
  const ref = string(asset?._ref)
  if (ref?.startsWith('image-')) onReference(ref, alt)
  for (const [key, child] of Object.entries(record)) {
    if (key !== 'asset') sourceImageRefs(child, onReference, alt)
  }
}

function mapDocument(document: Document, mediaIds: Map<string, string>) {
  const common = {
    _status: 'draft',
    sourceSanityId: document._id,
    sourceSnapshot: document,
  }
  const image = object(document.featuredImage) || object(document.photo)
  const imageRef = string(object(image?.asset)?._ref)
  const imageFields = imageRef?.startsWith('image-') && mediaIds.has(imageRef)
    ? { image: mediaIds.get(imageRef), imageAlt: readAlt(image) || '' }
    : {}
  const slug = slugValue(document.slug)

  if (document._type === 'program') {
    const pillar = pillarFor(document.category)
    if (!pillar) throw new Error('Program has an unmapped category; import stopped to avoid misclassification.')
    const objectives = Array.isArray(document.objectives) ? document.objectives : []
    return {
      ...common,
      title: string(document.title),
      slug,
      pillar,
      category: string(document.category),
      summary: string(document.description),
      body: plainText(document.content),
      outcomes: objectives.map((item) => ({ text: String(item) })),
      featured: document.featured === true,
      ...imageFields,
    }
  }

  if (document._type === 'event') {
    const startsAt = string(document.date)
    if (!startsAt || Number.isNaN(Date.parse(startsAt))) throw new Error('Event is missing a valid start date; import stopped.')
    const contentText = plainText(document.content)
    return {
      ...common,
      title: string(document.title),
      slug,
      standfirst: string(document.excerpt),
      body: [string(document.description), contentText].filter(Boolean).join('\n\n'),
      startsAt,
      endsAt: string(document.endDate),
      location: string(document.venue) || string(document.location),
      category: string(document.category),
      registrationUrl: string(document.registrationUrl),
      featured: document.featured === true,
      ...imageFields,
    }
  }

  const category = string(document.category)
  const publishedAt = string(document.publishedAt)
  if (!['announcement', 'quarterly-report', 'research', 'impact-story', 'partnership', 'program-update', 'Programme reports', 'Quarterly reports', 'Partnerships', 'Announcements'].includes(category || '')) {
    throw new Error('News article has an unmapped category; import stopped to preserve the original taxonomy.')
  }
  return {
    ...common,
    title: string(document.title),
    slug,
    category,
    summary: string(document.excerpt),
    body: plainText(document.content),
    author: string(document.author),
    publishedAt,
    featured: document.featured === true,
    ...imageFields,
  }
}

function validateMapped(document: Document, collection: Collection, data: Record<string, unknown>) {
  const missing = ['title', 'slug'].filter((key) => !string(data[key]))
  if (collection === 'programmes' && !string(data.pillar)) missing.push('pillar')
  if (collection === 'news' && !string(data.category)) missing.push('category')
  if (collection === 'events' && !string(data.startsAt)) missing.push('startsAt')
  if (missing.length) throw new Error(`${document._type} has missing required values: ${missing.join(', ')}.`)
}

async function payloadRequest<T>(url: string, key: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      Authorization: `administrators API-Key ${key}`,
      ...init.headers,
    },
  })
  if (!response.ok) throw new Error(`Payload returned HTTP ${response.status} for ${new URL(url).pathname}.`)
  return response.json() as Promise<T>
}

async function getExistingId(baseUrl: string, key: string, collection: string, sourceId: string): Promise<string | undefined> {
  const query = new URLSearchParams({
    'where[sourceSanityId][equals]': sourceId,
    limit: '1',
    depth: '0',
    draft: 'true',
  })
  const result = await payloadRequest<{ docs?: PayloadDocument[] }>(`${baseUrl}/api/${collection}?${query}`, key)
  return result.docs?.[0]?.id
}

async function getPageId(baseUrl: string, key: string, field: 'sourceCopyKey' | 'path', value: string): Promise<string | undefined> {
  const query = new URLSearchParams({ [`where[${field}][equals]`]: value, limit: '1', depth: '0', draft: 'true' })
  const result = await payloadRequest<{ docs?: PayloadDocument[] }>(`${baseUrl}/api/pages?${query}`, key)
  return result.docs?.[0]?.id
}

function mapApprovedPage(page: ApprovedPage, digest: string) {
  const allBlocks = page.sections.flatMap((section) => section.blocks)
  const heading = allBlocks.find((block) => object(block)?.kind === 'heading')
  const subheading = allBlocks.find((block) => object(block)?.kind === 'subheading')
  return {
    _status: 'draft',
    sourceCopyKey: `approved-copy:${page.path}`,
    sourceSnapshot: { source: 'MedWHOLE-Website-Copy.docx', sha256: digest, page },
    title: page.title,
    path: page.path,
    metaDescription: page.description,
    ...(page.breadcrumb ? { eyebrow: page.breadcrumb } : {}),
    heading: string(object(heading)?.text) || page.title,
    subheading: string(object(subheading)?.text) || '',
    sections: page.sections.map((section) => ({
      blockType: 'approved-content-section',
      sectionNumber: section.number,
      sectionLabel: section.label,
      sourceBlocks: section.blocks,
    })),
  }
}

async function saveApprovedPage(baseUrl: string, key: string, data: Record<string, unknown>, updateExisting: boolean) {
  const sourceKey = String(data.sourceCopyKey)
  const path = String(data.path)
  const existingId = await getPageId(baseUrl, key, 'sourceCopyKey', sourceKey)
  if (existingId && !updateExisting) return 'skipped' as const
  if (!existingId) {
    const conflictingId = await getPageId(baseUrl, key, 'path', path)
    if (conflictingId) throw new Error(`Payload already has a Page at ${path} not managed by this importer; refusing to overwrite it.`)
  }
  const url = `${baseUrl}/api/pages${existingId ? `/${encodeURIComponent(existingId)}` : ''}?draft=true`
  await payloadRequest<PayloadDocument>(url, key, {
    method: existingId ? 'PATCH' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return existingId ? 'updated' as const : 'created' as const
}

async function saveDocument(baseUrl: string, key: string, collection: Collection, data: Record<string, unknown>, updateExisting: boolean) {
  const sourceId = String(data.sourceSanityId)
  const existingId = await getExistingId(baseUrl, key, collection, sourceId)
  if (existingId && !updateExisting) return 'skipped' as const
  const query = '?draft=true'
  const url = `${baseUrl}/api/${collection}${existingId ? `/${encodeURIComponent(existingId)}` : ''}${query}`
  await payloadRequest<PayloadDocument>(url, key, {
    method: existingId ? 'PATCH' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return existingId ? 'updated' as const : 'created' as const
}

async function saveMedia(baseUrl: string, key: string, asset: Asset, alt: string | undefined, category: string) {
  const existingId = await getExistingId(baseUrl, key, 'media', asset._id)
  if (existingId) return existingId

  const sourceUrl = new URL(asset.url)
  if (sourceUrl.protocol !== 'https:' || sourceUrl.hostname !== 'cdn.sanity.io') {
    throw new Error('Sanity returned an unexpected media host; refusing to fetch it.')
  }
  const download = await fetch(sourceUrl)
  if (!download.ok) throw new Error(`Sanity media download returned HTTP ${download.status}.`)
  const declaredLength = Number(download.headers.get('content-length') || 0)
  if (declaredLength > maxImageBytes) throw new Error('Media asset exceeds the 30 MB migration limit.')
  const bytes = await download.arrayBuffer()
  if (bytes.byteLength > maxImageBytes) throw new Error('Media asset exceeds the 30 MB migration limit.')
  const mimeType = asset.mimeType || download.headers.get('content-type') || 'application/octet-stream'
  if (!mimeType.startsWith('image/')) throw new Error('Referenced Sanity asset is not an image.')

  const form = new FormData()
  const filename = (asset.originalFilename || asset._id).replace(/[\\/:*?"<>|]/g, '_')
  form.set('file', new Blob([bytes], { type: mimeType }), filename)
  form.set('_payload', JSON.stringify({
    alt: alt || 'Alternative text required—review before publishing.',
    category,
    consentConfirmed: false,
    altReviewRequired: !alt,
    consentReviewRequired: true,
    source: asset.url,
    sourceSanityId: asset._id,
    _status: 'draft',
  }))
  const created = await payloadRequest<PayloadDocument>(`${baseUrl}/api/media?draft=true`, key, { method: 'POST', body: form })
  return created.id
}

async function main() {
  const apply = process.argv.includes('--apply')
  const updateExisting = process.argv.includes('--update-existing')
  if (updateExisting && !apply) throw new Error('--update-existing requires --apply.')
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_API_TOKEN
  const baseUrl = process.env.PAYLOAD_CMS_URL?.replace(/\/$/, '')
  const payloadKey = process.env.PAYLOAD_CMS_ADMIN_API_KEY
  if (!projectId || !dataset) throw new Error('Sanity project configuration is missing.')
  if (apply && (!token || !baseUrl || !payloadKey)) {
    throw new Error('Apply requires SANITY_API_TOKEN, PAYLOAD_CMS_URL and PAYLOAD_CMS_ADMIN_API_KEY; no writes were made.')
  }

  const sanity = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false, ...(token ? { token } : {}) })
  const documents = await sanity.fetch<Document[]>(
    '*[_type in $types && !(_id in path("drafts.**")) && isActive != false] | order(_type asc, _id asc)',
    { types: allowedTypes },
  )
  const approvedCopy = JSON.parse(await readFile(new URL('../lib/approved-website-copy.json', import.meta.url), 'utf8')) as {
    sha256: string
    pages: Record<string, ApprovedPage>
  }
  const approvedPages = Object.values(approvedCopy.pages)
  const selected = documents.filter((document) => typeToCollection[document._type])
  const errors: Array<{ type: string; message: string }> = []
  const mapped = selected.flatMap((document) => {
    try {
      const collection = typeToCollection[document._type]
      const data = mapDocument(document, new Map())
      validateMapped(document, collection, data)
      return [{ document, collection, data }]
    } catch (error) {
      errors.push({ type: document._type, message: error instanceof Error ? error.message : 'Mapping failed.' })
      return []
    }
  })

  const altByAsset = new Map<string, string>()
  const categoryByAsset = new Map<string, Set<string>>()
  const referencedAssets = new Set<string>()
  for (const document of selected) {
    sourceImageRefs(document, (id, alt) => {
      referencedAssets.add(id)
      if (alt) altByAsset.set(id, alt)
      const categories = categoryByAsset.get(id) || new Set<string>()
      categories.add(mediaCategoryFor(document))
      categoryByAsset.set(id, categories)
    })
  }
  const assets = await sanity.fetch<Asset[]>(
    '*[_type == "sanity.imageAsset"]{_id,url,originalFilename,mimeType} | order(_id asc)',
  )
  const foundAssetIds = new Set(assets.map((asset) => asset._id))
  const missingAssets = [...referencedAssets].filter((id) => !foundAssetIds.has(id))

  const counts = mapped.reduce<Record<string, number>>((result, item) => {
    result[item.collection] = (result[item.collection] || 0) + 1
    return result
  }, {})
  const summary = {
    mode: apply ? 'apply' : 'dry-run',
    documents: { selected: selected.length, mapped: mapped.length, byCollection: counts },
    approvedCopy: { pages: approvedPages.length, sourceDigest: approvedCopy.sha256, allWillBeDrafts: true },
    media: {
      referenced: referencedAssets.size,
      libraryAssets: assets.length,
      unreferenced: assets.filter((asset) => !referencedAssets.has(asset._id)).length,
      missingReferencedAssets: missingAssets.length,
      altReviewRequired: assets.filter((asset) => !altByAsset.has(asset._id)).length,
      consentReviewRequired: assets.length,
    },
    mappingErrors: errors.length,
    allRecordsWillBeDrafts: true,
    sourceSanityRecordsWillBeDeleted: false,
  }
  console.log(JSON.stringify(summary, null, 2))
  if (errors.length) {
    for (const error of errors) console.error(`${error.type}: ${error.message}`)
    throw new Error('Resolve mapping errors before applying the migration.')
  }
  if (missingAssets.length) throw new Error('Some referenced image assets are missing; resolve them before applying.')
  if (!apply) return

  await payloadRequest(`${baseUrl}/api/globals/site-settings?depth=0`, payloadKey!, { method: 'GET' })
  const mediaIds = new Map<string, string>()
  for (const asset of assets) {
    const categories = categoryByAsset.get(asset._id) || new Set<string>()
    const knownCategories = [...categories].filter((category) => category !== 'Uncategorized')
    const category = knownCategories.length === 1 ? knownCategories[0] : 'Uncategorized'
    mediaIds.set(asset._id, await saveMedia(baseUrl!, payloadKey!, asset, altByAsset.get(asset._id), category))
  }

  const results: Record<string, { created: number; updated: number; skippedExisting: number }> = {}
  for (const { document, collection } of mapped) {
    const data = mapDocument(document, mediaIds)
    validateMapped(document, collection, data)
    const action = await saveDocument(baseUrl!, payloadKey!, collection, data, updateExisting)
    const current = results[collection] || { created: 0, updated: 0, skippedExisting: 0 }
    if (action === 'skipped') current.skippedExisting += 1
    else current[action] += 1
    results[collection] = current
  }
  const pageResults = { created: 0, updated: 0, skippedExisting: 0 }
  for (const page of approvedPages) {
    const action = await saveApprovedPage(baseUrl!, payloadKey!, mapApprovedPage(page, approvedCopy.sha256), updateExisting)
    if (action === 'skipped') pageResults.skippedExisting += 1
    else pageResults[action] += 1
  }
  console.log(JSON.stringify({ completed: true, mediaMigrated: mediaIds.size, documents: results, approvedCopyPages: pageResults }, null, 2))
}

main().catch((error: unknown) => {
  console.error(`Sanity → Payload migration stopped: ${error instanceof Error ? error.message : 'unknown error'}`)
  process.exitCode = 1
})
