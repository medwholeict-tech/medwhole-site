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

async function main() {
  const programs = await client.fetch('*[_type == "program"] {_id, title, category, slug}')
  console.log('Existing programmes:', JSON.stringify(programs, null, 2))
}

main().catch(console.error)
