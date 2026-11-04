import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
if (!dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')
if (!token) throw new Error('Missing SANITY_API_TOKEN')

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
})

async function cleanSanity() {
  const types = ['news', 'event', 'program', 'team', 'gallery']
  
  console.log('🧹 Starting Sanity cleanup...')
  console.log(`   Dataset: ${dataset}`)
  console.log(`   Project: ${projectId}`)
  console.log('')

  for (const type of types) {
    try {
      console.log(`🗑️  Deleting all documents of type: ${type}`)
      const result = await client.delete({ query: `*[_type == "${type}"]` })
      console.log(`   ✅ Deleted documents`)
    } catch (error) {
      console.error(`   ❌ Error deleting ${type}:`, error)
    }
  }

  console.log('')
  console.log('✅ Sanity cleanup completed!')
  console.log('   You can now run: pnpm sanity:seed')
}

cleanSanity().catch((error) => {
  console.error('\n❌ Cleanup failed:', error)
  process.exit(1)
})
