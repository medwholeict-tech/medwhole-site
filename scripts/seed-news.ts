import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'node:path'
import fs from 'node:fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const newsImagesDir = path.resolve(process.cwd(), 'tmp/pdfs/newsletter/images')

function portableText(text: string) {
  return text.split('\n\n').filter(Boolean).map(p => ({
    _type: 'block',
    _key: p.slice(0, 20).replace(/\s/g, '-'),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `span-${p.slice(0, 10)}`, text: p.trim(), marks: [] }],
  }))
}

async function uploadImage(filename: string) {
  const filePath = path.join(newsImagesDir, filename)
  if (!fs.existsSync(filePath)) {
    console.log(`Image not found: ${filePath}`)
    return undefined
  }
  const stream = fs.createReadStream(filePath)
  const asset = await client.assets.upload('image', stream, { filename })
  console.log(`Uploaded: ${filename} -> ${asset._id}`)
  return { _type: 'reference', _ref: asset._id }
}

async function createNews(doc: any) {
  const existing = await client.fetch('*[_type == "news" && slug.current == $slug][0]._id', { slug: doc.slug.current })
  if (existing) {
    console.log(`Already exists: ${doc.title} (${existing})`)
    return existing
  }
  const result = await client.create(doc)
  console.log(`Created: ${result.title} (${result._id})`)
  return result._id
}

async function main() {
  // Upload images
  const healthImage = await uploadImage('page-07.jpg')
  const educationImage = await uploadImage('page-05.jpg')
  const empowermentImage = await uploadImage('page-09.jpg')

  // 1. Health Outreach Report
  await createNews({
    _type: 'news',
    title: 'Kunyami Health Outreach: 506 Lives Reached in One Day',
    slug: { _type: 'slug', current: 'kunyami-health-outreach-february-2026' },
    excerpt: 'On February 14, 2026, MedWHOLE Alliance conducted a free medical outreach in Kunyami Community, providing preventive, curative, diagnostic, counselling, and referral services to 506 beneficiaries.',
    content: portableText(
`Kunyami Community sits in Kyami District, AMAC, FCT Abuja. It has no health facility. For the residents there — children, adults, the elderly — access to basic healthcare has meant a journey elsewhere, or no care at all.

On February 14, 2026, MedWHOLE Alliance conducted a free medical outreach in the community. What followed was a full, coordinated delivery of preventive, curative, diagnostic, counselling, and referral services, structured across multiple service units working together.

The numbers tell part of the story: 506 total beneficiaries reached, including 274 children and 232 adults. 450 persons received deworming treatment. 136 laboratory investigations were conducted. 39 ECGs were performed. 47 eye patients were attended to, with 25 medicated glasses issued. 7 surgical cases were identified and linked for further care.

All beneficiaries passed through registration and triage. The programme also provided individualised counselling and referrals for cases requiring higher-level management.

These are not statistics. They are people who had no access to care, and then they did.`
    ),
    featuredImage: healthImage ? { ...healthImage, alt: 'MedWHOLE health outreach in Kunyami Community' } : undefined,
    category: 'impact-story',
    author: 'MedWHOLE Alliance',
    publishedAt: '2026-02-20T10:00:00Z',
    featured: true,
    isActive: true,
  })

  // 2. Summer School 2026
  await createNews({
    _type: 'news',
    title: 'Summer School 2026: Building Foundations in Kunyami and Gosa',
    slug: { _type: 'slug', current: 'summer-school-2026-kunyami-gosa' },
    excerpt: 'MedWHOLE Academy Summer School is currently running in Kunyami (250+ pupils) and Gosa (450+ pupils), offering academic support, creative arts, reading programmes, and foundational skills development.',
    content: portableText(
`MedWHOLE Academy Summer School 2026 is currently running across both community locations, bringing structured learning and creative activities to children during the break.

In Kunyami, over 250 pupils are participating in the programme. In Gosa, the number has reached 450+. Both locations run concurrently throughout August 2026.

The summer school goes beyond traditional academics. Activities include academic reinforcement, creative arts, reading programmes, and foundational skills development — all designed to help children continue growing during the holiday period.

This is part of MedWHOLE Academy's year-round commitment to nurturing children who grow in learning, character, and purpose. From weekly club meetings during the school term to intensive summer programming, the Academy creates consistent spaces for children to develop their potential.

The programme reflects MedWHOLE's belief that whole people create lasting impact. When children receive sustained support across academic, creative, and personal development, the effects reach into their families and communities.`
    ),
    featuredImage: educationImage ? { ...educationImage, alt: 'MedWHOLE Academy Summer School activities' } : undefined,
    category: 'program-update',
    author: 'MedWHOLE Alliance',
    publishedAt: '2026-08-01T10:00:00Z',
    featured: true,
    isActive: true,
  })

  // 3. comPART Launch
  await createNews({
    _type: 'news',
    title: 'comPART: From One-Day Outreach to Long-Term Community Empowerment',
    slug: { _type: 'slug', current: 'compart-community-participation-programme' },
    excerpt: 'The Community Participation Programme (comPART) was launched in Kunyami as a direct follow-up to the February 14 health outreach, extending MedWHOLE impact into long-term community empowerment.',
    content: portableText(
`The Valentine's Day health outreach in Kunyami was designed to address immediate need. But MedWHOLE has always understood that wholeness is not built in a single day. So the outreach was not the end of the work in Kunyami — it was the beginning of a longer investment.

The first edition of the Community Participation Programme (comPART) was launched in Kunyami as a direct follow-up to the outreach. It was conceived to extend MedWHOLE's impact beyond one-day service delivery into the longer-term work of community empowerment and sustainable development.

The programme was created specifically for the young volunteers who served across the various units on February 14. Rather than simply thanking them and moving on, MedWHOLE invited them into something deeper: a platform to build practical capacity in areas connected to their interests and passions.

The goal is not only to expose them to practical knowledge but to equip them with scalable, marketable skills that can shape their future and position them as active contributors to the development of their own community.

They came as helpers on February 14. They are now being equipped as leaders. That is the MedWHOLE journey in motion: Engaged, Discipled, Deployed.`
    ),
    featuredImage: empowermentImage ? { ...empowermentImage, alt: 'comPART community participation programme in Kunyami' } : undefined,
    category: 'program-update',
    author: 'MedWHOLE Alliance',
    publishedAt: '2026-03-01T10:00:00Z',
    featured: false,
    isActive: true,
  })

  // Verify
  const all = await client.fetch('*[_type == "news"] | order(publishedAt desc) {_id, title, slug, category, featured}')
  console.log('\nAll news articles:', JSON.stringify(all, null, 2))
}

main().catch(console.error)
