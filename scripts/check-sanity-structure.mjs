import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zouo3v31'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('❌ SANITY_API_TOKEN is required')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
})

async function checkSanityStructure() {
  console.log('🔍 Analyzing Sanity Database Structure...\n')
  console.log(`📊 Project: ${projectId}`)
  console.log(`📦 Dataset: ${dataset}\n`)
  console.log('=' .repeat(80))

  try {
    // Get all document types
    const allDocs = await client.fetch(`*[]{_type}`)
    const types = [...new Set(allDocs.map(doc => doc._type))]
    
    console.log(`\n📋 Found ${types.length} document types:\n`)

    for (const type of types.sort()) {
      // Count documents of this type
      const count = await client.fetch(`count(*[_type == $type])`, { type })
      
      // Get sample document to show structure
      const sample = await client.fetch(
        `*[_type == $type][0]{
          ...,
          "fieldCount": count(*)
        }`,
        { type }
      )

      console.log(`\n📄 ${type.toUpperCase()}`)
      console.log(`   Total documents: ${count}`)
      
      if (sample) {
        const fields = Object.keys(sample).filter(key => !key.startsWith('_'))
        console.log(`   Fields (${fields.length}): ${fields.join(', ')}`)
        
        // Show some sample data
        if (sample.title) console.log(`   Sample title: "${sample.title}"`)
        if (sample.name) console.log(`   Sample name: "${sample.name}"`)
        if (sample.email) console.log(`   Sample email: "${sample.email}"`)
        if (sample.question) console.log(`   Sample question: "${sample.question}"`)
        
        // Check for common quality indicators
        const hasSlug = 'slug' in sample
        const hasImage = 'featuredImage' in sample || 'image' in sample || 'photo' in sample || 'logo' in sample
        const hasStatus = 'isActive' in sample || 'status' in sample
        const hasFeatured = 'featured' in sample
        
        console.log(`   Quality indicators:`)
        console.log(`     ✓ Has slug: ${hasSlug ? '✅' : '❌'}`)
        console.log(`     ✓ Has image: ${hasImage ? '✅' : '❌'}`)
        console.log(`     ✓ Has status: ${hasStatus ? '✅' : '❌'}`)
        console.log(`     ✓ Has featured: ${hasFeatured ? '✅' : '❌'}`)
      }
      
      console.log('   ' + '-'.repeat(76))
    }

    // Check for specific content types we expect
    console.log('\n\n🎯 Expected Content Types Check:\n')
    
    const expectedTypes = [
      'event',
      'eventRegistration', 
      'news',
      'program',
      'team',
      'gallery',
      'testimonial',
      'partner',
      'resource',
      'faq',
      'job',
      'impactStory',
      'donation',
      'newsletter',
      'siteSettings'
    ]

    for (const expectedType of expectedTypes) {
      const exists = types.includes(expectedType)
      const count = exists ? await client.fetch(`count(*[_type == "${expectedType}"])`) : 0
      
      if (exists) {
        console.log(`   ✅ ${expectedType.padEnd(20)} - ${count} documents`)
      } else {
        console.log(`   ⚠️  ${expectedType.padEnd(20)} - Not found (0 documents)`)
      }
    }

    // Check for orphaned or unexpected types
    const unexpectedTypes = types.filter(t => !expectedTypes.includes(t) && !t.startsWith('sanity.'))
    if (unexpectedTypes.length > 0) {
      console.log('\n\n⚠️  Unexpected/Custom Document Types Found:\n')
      unexpectedTypes.forEach(type => {
        console.log(`   - ${type}`)
      })
    }

    // Data quality checks
    console.log('\n\n🔍 Data Quality Analysis:\n')

    // Check for documents without slugs (where applicable)
    const typesNeedingSlugs = ['event', 'news', 'program', 'partner', 'resource', 'job', 'impactStory', 'donation']
    for (const type of typesNeedingSlugs) {
      if (types.includes(type)) {
        const withoutSlug = await client.fetch(
          `count(*[_type == $type && !defined(slug.current)])`,
          { type }
        )
        if (withoutSlug > 0) {
          console.log(`   ⚠️  ${type}: ${withoutSlug} documents missing slugs`)
        }
      }
    }

    // Check for documents without images (where applicable)
    const typesNeedingImages = ['event', 'news', 'program', 'gallery', 'partner']
    for (const type of typesNeedingImages) {
      if (types.includes(type)) {
        const imageField = type === 'partner' ? 'logo' : type === 'gallery' ? 'image' : 'featuredImage'
        const withoutImage = await client.fetch(
          `count(*[_type == $type && !defined(${imageField})])`,
          { type }
        )
        if (withoutImage > 0) {
          console.log(`   ⚠️  ${type}: ${withoutImage} documents missing ${imageField}`)
        }
      }
    }

    // Check for inactive content
    console.log('\n\n📊 Content Status:\n')
    for (const type of types) {
      if (types.includes(type)) {
        const total = await client.fetch(`count(*[_type == $type])`, { type })
        const active = await client.fetch(
          `count(*[_type == $type && (isActive == true || status == "active" || status == "open")])`,
          { type }
        )
        const inactive = total - active
        
        if (total > 0) {
          console.log(`   ${type.padEnd(20)} - Active: ${active}, Inactive: ${inactive}`)
        }
      }
    }

    // Recent activity
    console.log('\n\n📅 Recent Activity (Last 10 documents):\n')
    const recentDocs = await client.fetch(
      `*[!(_type match "sanity.*")] | order(_createdAt desc) [0...10] {
        _type,
        _createdAt,
        title,
        name,
        question
      }`
    )

    recentDocs.forEach(doc => {
      const date = new Date(doc._createdAt).toLocaleDateString()
      const title = doc.title || doc.name || doc.question || 'Untitled'
      console.log(`   ${date} - ${doc._type}: ${title}`)
    })

    console.log('\n' + '='.repeat(80))
    console.log('\n✅ Analysis complete!\n')

  } catch (error) {
    console.error('\n❌ Error analyzing Sanity database:', error.message)
    process.exit(1)
  }
}

checkSanityStructure()
