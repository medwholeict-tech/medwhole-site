import 'dotenv/config'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function testData() {
  console.log('\n🔍 Testing Sanity Data...\n')
  
  try {
    // Test news
    const news = await client.fetch('*[_type == "news"]')
    console.log(`📰 News articles found: ${news.length}`)
    if (news.length > 0) {
      console.log('   Sample:', news[0].title)
      console.log('   Has isActive?', 'isActive' in news[0], news[0].isActive)
    }
    
    // Test events
    const events = await client.fetch('*[_type == "event"]')
    console.log(`📅 Events found: ${events.length}`)
    if (events.length > 0) {
      console.log('   Sample:', events[0].title)
      console.log('   Has isActive?', 'isActive' in events[0], events[0].isActive)
    }
    
    // Test programs
    const programs = await client.fetch('*[_type == "program"]')
    console.log(`🎓 Programs found: ${programs.length}`)
    if (programs.length > 0) {
      console.log('   Sample:', programs[0].title)
      console.log('   Has isActive?', 'isActive' in programs[0], programs[0].isActive)
    }
    
    // Test team
    const team = await client.fetch('*[_type == "team"]')
    console.log(`👥 Team members found: ${team.length}`)
    if (team.length > 0) {
      console.log('   Sample:', team[0].name)
      console.log('   Has isActive?', 'isActive' in team[0], team[0].isActive)
    }
    
    // Test gallery
    const gallery = await client.fetch('*[_type == "gallery"]')
    console.log(`🖼️  Gallery items found: ${gallery.length}`)
    if (gallery.length > 0) {
      console.log('   Sample:', gallery[0].title)
      console.log('   Has isActive?', 'isActive' in gallery[0], gallery[0].isActive)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testData()
