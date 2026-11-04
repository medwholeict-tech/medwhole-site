import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
if (!dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')
if (!token) throw new Error('Missing SANITY_API_TOKEN')

const client = createClient({ projectId, dataset, token, apiVersion, useCdn: false })

function slugify(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')
}

function toPortableText(paragraphs: string[]) {
  return paragraphs
    .map((p) => p.trim())
    .filter(Boolean)
    .map((text) => ({
      _type: 'block' as const,
      style: 'normal' as const,
      markDefs: [],
      children: [{ _type: 'span' as const, text, marks: [] as string[] }],
    }))
}

const programs = [
  {
    title: 'Medical Outreaches',
    category: 'health',
    description: 'Direct community medical outreaches that bring essential health services to people at their point of need.',
    objectives: ['Community consultations', 'Basic treatments and screenings', 'Health education', 'Referral pathways'],
  },
  {
    title: 'Specialist Referral Support',
    category: 'health',
    description: 'Connecting community members who need further care with appropriate specialist services and follow-through.',
    objectives: ['Needs identification', 'Referral coordination', 'Follow-up support', 'Care navigation'],
  },
  {
    title: 'Behaviour Change Communication',
    category: 'health',
    description: 'Practical health communication that helps families and communities adopt behaviours that protect and improve health.',
    objectives: ['Health education sessions', 'Community dialogues', 'Caregiver education', 'Preventive health messaging'],
  },
  {
    title: 'Preventive Chemotherapy',
    category: 'health',
    description: 'Preventive chemotherapy interventions that protect vulnerable communities from preventable disease.',
    objectives: ['Community distribution campaigns', 'Disease prevention', 'Health worker coordination', 'Follow-up monitoring'],
  },
  {
    title: 'Community Patient Care (CPC) Programme',
    category: 'health',
    description: 'Structured community-based patient care that extends support beyond facilities into homes and neighbourhoods.',
    objectives: ['Patient follow-up', 'Home-based care support', 'Caregiver guidance', 'Community health linkages'],
  },
  {
    title: 'Health Systems Strengthening',
    category: 'health',
    description: 'Supporting the structured improvement of health systems and institutions, including facility revitalisation and optimisation.',
    objectives: ['Systems assessment', 'Institutional support', 'Service delivery improvement', 'Community engagement'],
  },
  {
    title: 'Back-to-School Scholarship Programme',
    category: 'education',
    description: 'Scholarship support that has helped over 50 school dropouts return to formal education.',
    objectives: ['Student identification', 'Tuition and exam fee support', 'Uniforms and learning materials', 'Mentorship and follow-up'],
  },
  {
    title: 'Summer Holiday Lessons',
    category: 'education',
    description: 'Holiday lessons that have impacted hundreds of children since 2021, bridging learning gaps between academic sessions.',
    objectives: ['Subject-focused classes', 'Remedial tutoring', 'Learning assessments', 'Confidence building'],
  },
  {
    title: 'Exam Coaching (WAEC & JAMB)',
    category: 'education',
    description: 'Students with particular needs are identified and supported through one-on-one tutoring for WAEC and JAMB. Success stories have been recorded.',
    objectives: ['Needs identification', 'One-on-one tutoring', 'Past-question practice', 'Study guidance'],
  },
  {
    title: 'Good News Club',
    category: 'education',
    description: 'An avenue for character-building and mentorship, forming the discipleship heart of MedWHOLE\'s education work.',
    objectives: ['Character-building lessons', 'Mentorship', 'Values formation', 'Group activities'],
  },
  {
    title: 'Targeted Nutrition Support',
    category: 'nutrition',
    description: 'Supporting vulnerable families with raw food packs to protect children and households at risk of malnutrition.',
    objectives: ['Household identification', 'Raw food pack distribution', 'Nutrition guidance', 'Follow-up'],
  },
  {
    title: 'Life-Saving Nutrition Interventions',
    category: 'nutrition',
    description: 'Provision of specialized meals and supplements for severely malnourished children to restore health and vitality.',
    objectives: ['Nutrition assessment', 'Specialized meals', 'Therapeutic supplements', 'Recovery monitoring'],
  },
  {
    title: 'Community Feeding Initiative',
    category: 'nutrition',
    description: 'Distribution of raw food packs and nutritional supplies during outreach and holiday events.',
    objectives: ['Event-based distribution', 'Nutritional supplies', 'Volunteer mobilisation', 'Community engagement'],
  },
  {
    title: 'ComPart Programme',
    category: 'capacity',
    description: 'MedWHOLE\'s branded human capacity development programme, growing local human capital and building the skills base communities need for sustainability.',
    objectives: ['Skills development', 'Community actor development', 'Sustainability planning', 'Local leadership growth'],
  },
  {
    title: 'Income-Generating Crafts Workshops',
    category: 'capacity',
    description: 'Practical crafts training that gives participants income-generating skills for household stability.',
    objectives: ['Crafts production training', 'Starter guidance', 'Basic entrepreneurship', 'Product development'],
  },
  {
    title: 'BLS & CPR Training',
    category: 'capacity',
    description: 'Basic Life Support (BLS) and cardiopulmonary resuscitation (CPR) training that builds community first responders.',
    objectives: ['CPR technique', 'Basic Life Support', 'Emergency response', 'Practical drills'],
  },
  {
    title: 'Digital Literacy',
    category: 'capacity',
    description: 'Digital literacy training that prepares children and community members to participate confidently in a digital world.',
    objectives: ['Basic computer skills', 'Safe internet use', 'Hands-on practice', 'Everyday digital tasks'],
  },
  {
    title: 'Mentorship & Volunteer Capacity Building',
    category: 'capacity',
    description: 'Professional mentorship and volunteer capacity building that grow the people who carry the mission forward.',
    objectives: ['Professional mentorship', 'Volunteer training', 'Leadership development', 'Ongoing support'],
  },
]

async function seedPrograms() {
  console.log('🌱 Clearing all existing Sanity content...')

  const types = ['news', 'event', 'program', 'team', 'gallery', 'partnershipApplication', 'volunteerApplication', 'donation', 'newsletter']
  for (const type of types) {
    console.log(`  🧹 Deleting ${type}...`)
    await client.delete({ query: `*[_type == "${type}"]` })
  }

  console.log('\n🌱 Seeding programmes from organizational profile...')

  for (const program of programs) {
    const slug = slugify(program.title)
    const doc = {
      _id: `program.${slug}`,
      _type: 'program',
      title: program.title,
      slug: { _type: 'slug', current: slug },
      description: program.description,
      content: toPortableText([program.description]),
      category: program.category,
      objectives: program.objectives,
      isActive: true,
      featured: false,
    }

    await client.createOrReplace(doc)
    console.log(`  ✅ ${program.title} (${program.category})`)
  }

  console.log(`\n🎉 Seeded ${programs.length} programmes.`)
}

seedPrograms().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
