import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

const teamMembers = [
  {
    _type: 'team',
    name: 'Prof. Chima Onoka',
    role: 'Founder & CEO',
    bio: 'Leading MedWHOLE Alliance\'s vision of transforming communities through whole health, whole persons, and whole communities. With extensive experience in public health and community development, Prof. Onoka brings strategic leadership and a passion for sustainable impact.',
    category: 'leadership',
    order: 1,
    isActive: true,
  },
  {
    _type: 'team',
    name: 'Dr. Ferdinand Ogbaji',
    role: 'Director of Programmes',
    bio: 'Overseeing program implementation and ensuring measurable impact across all MedWHOLE initiatives. Dr. Ogbaji brings expertise in program management, monitoring and evaluation, and strategic planning to drive organizational excellence.',
    category: 'leadership',
    order: 2,
    isActive: true,
  },
]

async function addTeamMembers() {
  console.log('🔍 Checking existing team members...\n')

  try {
    // Check if team members already exist
    const existingTeam = await client.fetch('*[_type == "team"]')
    
    if (existingTeam.length > 0) {
      console.log(`✅ Found ${existingTeam.length} existing team member(s):`)
      existingTeam.forEach((member: any) => {
        console.log(`   - ${member.name} (${member.role})`)
      })
      console.log('\n💡 Team members already exist. No need to add more.\n')
      return
    }

    console.log('📝 No team members found. Adding leadership team...\n')

    // Add team members
    for (const member of teamMembers) {
      const result = await client.create(member)
      console.log(`✅ Added: ${member.name} - ${member.role}`)
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Successfully added team members!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('💡 You can now:')
    console.log('   1. View them at /studio')
    console.log('   2. Add photos to team members')
    console.log('   3. See them on the About page\n')
  } catch (error) {
    console.error('❌ Error adding team members:', error)
    process.exit(1)
  }
}

addTeamMembers()
