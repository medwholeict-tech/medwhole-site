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
  await client
    .patch('newsletter-2026-kunyami-compart')
    .set({ status: 'completed', title: 'Community Participation Programme (comPART)' })
    .commit()
  console.log('Updated comPART to completed')

  const events = await client.fetch('*[_type == "event"] | order(date desc) {_id, title, status}')
  console.log('Current events:', JSON.stringify(events, null, 2))
}

main().catch(console.error)
