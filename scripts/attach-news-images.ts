import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const assets = [
  { id: 'Jrx3KFx2wJzZJzb3ynRzZP', ref: 'image-347375b57e42bc3e9a3cbada82e34f1de054ab53-1575x887-jpg', alt: 'MedWHOLE health outreach in Kunyami Community' },
  { id: 'xjR5zftVrA5hqTz2RaFenC', ref: 'image-c437c09bca38f82a2902c7fe6b365915d57eb2a8-1200x800-jpg', alt: 'MedWHOLE Academy Summer School activities' },
  { id: 'x8rfU4nU2WrN5Gmrbqk1lM', ref: 'image-4823129973624a02063dc1462df49f209430fa90-1800x1200-jpg', alt: 'comPART community participation programme' },
]

async function main() {
  for (const a of assets) {
    await client.patch(a.id).set({
      featuredImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: a.ref },
        alt: a.alt,
      },
    }).commit()
    console.log(`Attached image to ${a.id}`)
  }

  const all = await client.fetch('*[_type == "news"] {_id, title, featuredImage}')
  console.log('\nArticles:', JSON.stringify(all, null, 2))
}

main().catch(console.error)
