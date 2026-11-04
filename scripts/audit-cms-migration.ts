import { config } from 'dotenv'
import { createClient } from '@sanity/client'

config({ path: '.env.local', quiet: true })
config({ quiet: true })

const contentTypes = [
  'siteSettings', 'program', 'event', 'news', 'gallery', 'team', 'partner',
  'resource', 'faq', 'job', 'impactStory', 'donation', 'community',
] as const

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_API_TOKEN
  const payloadUrl = process.env.PAYLOAD_CMS_URL
  const payloadKey = process.env.PAYLOAD_CMS_ADMIN_API_KEY

  if (!projectId || !dataset) {
    throw new Error('Sanity project configuration is missing; no content was read.')
  }

  const sanity = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false, ...(token ? { token } : {}) })
  const counts = await Promise.all(contentTypes.map(async (type) => ({
    type,
    count: await sanity.fetch<number>('count(*[_type == $type])', { type }),
  })))
  const assets = await Promise.all([
    sanity.fetch<number>('count(*[_type == "sanity.imageAsset"])'),
    sanity.fetch<number>('count(*[_type == "sanity.fileAsset"])'),
  ])

  console.log(JSON.stringify({
    source: { connected: true, authenticated: Boolean(token), datasetConfigured: true },
    target: { configured: Boolean(payloadUrl && payloadKey) },
    editorialDocumentCounts: counts,
    assetCounts: { images: assets[0], files: assets[1] },
    writesPerformed: false,
    privateSubmissionRecordsRead: false,
  }, null, 2))
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown migration audit error'
  console.error(`CMS migration audit failed: ${message}`)
  process.exitCode = 1
})
