import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import { randomUUID } from 'crypto'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

// Generate a unique key for array items
function generateKey(): string {
  return randomUUID().replace(/-/g, '').substring(0, 12)
}

// Add _key to array items recursively
function addKeysToArrays(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === 'object' && item !== null) {
        // Add _key if it doesn't exist
        if (!item._key) {
          item._key = generateKey()
        }
        // Recursively process nested objects
        return addKeysToArrays(item)
      }
      return item
    })
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {}
    for (const key in obj) {
      newObj[key] = addKeysToArrays(obj[key])
    }
    return newObj
  }
  return obj
}

async function fixMissingKeys() {
  console.log('🔍 Scanning for documents with missing _key properties...\n')

  try {
    // Get all document types
    const documentTypes = [
      'event',
      'eventRegistration',
      'news',
      'program',
      'impactStory',
      'gallery',
      'resource',
      'team',
      'partner',
      'testimonial',
      'faq',
      'job',
      'donation',
      'newsletter',
      'siteSettings',
    ]

    let totalFixed = 0

    for (const docType of documentTypes) {
      console.log(`📄 Processing ${docType} documents...`)

      // Fetch all documents of this type
      const documents = await client.fetch(`*[_type == "${docType}"]`)

      if (documents.length === 0) {
        console.log(`   ℹ️  No ${docType} documents found\n`)
        continue
      }

      let fixedCount = 0

      for (const doc of documents) {
        let needsUpdate = false
        const updatedDoc = { ...doc }

        // Process all fields in the document
        for (const key in updatedDoc) {
          if (Array.isArray(updatedDoc[key])) {
            const originalArray = JSON.stringify(updatedDoc[key])
            updatedDoc[key] = addKeysToArrays(updatedDoc[key])
            const updatedArray = JSON.stringify(updatedDoc[key])

            if (originalArray !== updatedArray) {
              needsUpdate = true
            }
          } else if (typeof updatedDoc[key] === 'object' && updatedDoc[key] !== null) {
            const originalObj = JSON.stringify(updatedDoc[key])
            updatedDoc[key] = addKeysToArrays(updatedDoc[key])
            const updatedObj = JSON.stringify(updatedDoc[key])

            if (originalObj !== updatedObj) {
              needsUpdate = true
            }
          }
        }

        if (needsUpdate) {
          try {
            // Remove system fields before updating
            const { _id, _type, _createdAt, _updatedAt, _rev, ...updateData } = updatedDoc

            await client
              .patch(_id)
              .set(updateData)
              .commit()

            fixedCount++
            console.log(`   ✅ Fixed: ${doc.title || doc.name || _id}`)
          } catch (error) {
            console.error(`   ❌ Error updating ${doc._id}:`, error)
          }
        }
      }

      if (fixedCount > 0) {
        console.log(`   ✨ Fixed ${fixedCount} ${docType} document(s)\n`)
        totalFixed += fixedCount
      } else {
        console.log(`   ✓ All ${docType} documents are OK\n`)
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    if (totalFixed > 0) {
      console.log(`✅ Successfully fixed ${totalFixed} document(s)!`)
      console.log('\n💡 You can now edit these documents in Sanity Studio without errors.')
    } else {
      console.log('✅ All documents already have proper _key properties!')
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  } catch (error) {
    console.error('❌ Error fixing keys:', error)
    process.exit(1)
  }
}

// Run the fix
fixMissingKeys()
