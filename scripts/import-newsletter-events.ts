import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
if (!dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')
if (!token) throw new Error('Missing SANITY_API_TOKEN')

const client = createClient({ projectId, dataset, token, apiVersion, useCdn: false })
const imageDirectory = path.resolve(process.cwd(), 'tmp/pdfs/newsletter/images')

function portableText(paragraphs: string[]) {
  return paragraphs.map((text, index) => ({
    _key: `paragraph-${index + 1}`,
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _key: `span-${index + 1}`,
        _type: 'span',
        text,
        marks: [],
      },
    ],
  }))
}

async function ensureImage(filename: string) {
  const existingId = await client.fetch<string | null>(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
    { filename },
  )

  if (existingId) return existingId

  const imagePath = path.join(imageDirectory, filename)
  if (!fs.existsSync(imagePath)) throw new Error(`Newsletter image not found: ${imagePath}`)

  const asset = await client.assets.upload('image', fs.createReadStream(imagePath), { filename })
  return asset._id
}

function featuredImage(assetId: string, alt: string) {
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
    alt,
  }
}

function storyMoment(key: string, assetId: string, alt: string, title: string, caption: string) {
  return {
    _key: key,
    _type: 'object',
    title,
    caption,
    image: featuredImage(assetId, alt),
  }
}

function impactFigure(key: string, value: string, label: string) {
  return { _key: key, _type: 'object', value, label }
}

const contact = {
  organizer: 'MedWHOLE Alliance for Health and Development',
  contactEmail: 'Info@medwhole.org',
  contactPhone: '+234 818 980 0001',
}

async function main() {
  const imageIds = {
    summerSchoolKunyami: await ensureImage('page-05-image-02.jpg'),
    summerSchoolGosa: await ensureImage('page-05-image-01.jpg'),
    healthOutreach: await ensureImage('page-07-image-01.jpg'),
    healthConsultation: await ensureImage('page-07-image-02.jpg'),
    healthDiagnostics: await ensureImage('page-07-image-03.jpg'),
    healthCareTeam: await ensureImage('page-07-image-04.jpg'),
    compartTraining: await ensureImage('page-09-image-01.jpg'),
    compartCapacity: await ensureImage('page-09-image-02.jpg'),
    compartSkills: await ensureImage('page-09-image-03.jpg'),
    compartCommunity: await ensureImage('page-09-image-04.jpg'),
  }

  const events = [
    {
      _id: 'newsletter-2026-summer-school-kunyami',
      _type: 'event',
      title: 'Summer School - Kunyami',
      slug: { _type: 'slug', current: 'summer-school-kunyami-2026' },
      excerpt: 'A free summer school providing engaging academic, arts, reading, and foundational skills programmes for over 250 pupils in Kunyami Village.',
      description: 'The MedWHOLE Academy Summer School in Kunyami is currently running with over 250 pupils participating in concurrent learning activities across academics, arts, reading, and foundational skills.',
      content: portableText([
        'The summer school programme provides children in Kunyami with structured learning opportunities during the school break. Activities cover academics, creative arts, reading development, and foundational skills.',
        'MedWHOLE Academy designed the programme to ensure children continue growing intellectually and socially during the holiday period, in a safe and supportive community environment.',
      ]),
      storyMoments: [
        storyMoment(
          'kunyami-summer-learning',
          imageIds.summerSchoolKunyami,
          'Children participating in learning activities during the Kunyami Summer School',
          'Learning continues through the break',
          'Over 250 pupils are engaged in academics, arts, reading, and foundational skills during the summer programme.',
        ),
      ],
      impactFigures: [
        impactFigure('kunyami-summer-pupils', '250+', 'pupils enrolled in the summer school'),
        impactFigure('kunyami-summer-areas', '4', 'learning areas: academics, arts, reading, foundational skills'),
        impactFigure('kunyami-summer-status', 'Ongoing', 'currently running in August 2026'),
      ],
      communityContext: 'Kunyami Village is part of Kyami District in AMAC, FCT Abuja. The summer school brings structured educational programming directly into the community during the school break.',
      whyItMatters: 'Access to continued learning during school breaks helps children retain knowledge, build confidence, and stay engaged. The summer school extends MedWHOLE Academy\'s commitment to holistic child development beyond the regular school year.',
      participation: {
        description: 'Pupils in Kunyami and surrounding communities can participate in the summer school. Parents, guardians, volunteers, and partners can contact MedWHOLE for current participation or support information.',
        steps: [
          'Academic learning and foundational skills',
          'Creative arts and reading development',
          'Structured activities in a safe community environment',
        ],
      },
      closingReflection: 'The summer school is more than a holiday programme. It is an investment in children who deserve every opportunity to learn, grow, and discover their potential regardless of the season.',
      featuredImage: featuredImage(imageIds.summerSchoolKunyami, 'Children at the MedWHOLE Academy Summer School in Kunyami Village'),
      category: 'Academy',
      date: '2026-08-01T12:00:00.000Z',
      status: 'ongoing',
      schedule: 'Running throughout August 2026',
      showTime: false,
      location: 'Kunyami Village, Kyami District, AMAC, FCT Abuja',
      isFree: true,
      requiresRegistration: false,
      featured: true,
      isActive: true,
      ...contact,
    },
    {
      _id: 'newsletter-2026-summer-school-gosa',
      _type: 'event',
      title: 'Summer School - Gosa',
      slug: { _type: 'slug', current: 'summer-school-gosa-2026' },
      excerpt: 'A free summer school providing engaging academic, arts, reading, and foundational skills programmes for over 450 pupils in Gosa.',
      description: 'The MedWHOLE Academy Summer School in Gosa is running concurrently with the Kunyami programme, with over 450 pupils participating in learning activities across academics, arts, reading, and foundational skills.',
      content: portableText([
        'The Gosa summer school provides children with structured learning opportunities during the school break. Activities cover academics, creative arts, reading development, and foundational skills.',
        'With over 450 pupils, the Gosa programme is the larger of the two concurrent summer schools, reflecting the strong community engagement in the area.',
      ]),
      storyMoments: [
        storyMoment(
          'gosa-summer-learning',
          imageIds.summerSchoolGosa,
          'Children participating in learning activities during the Gosa Summer School',
          'A community invested in its children',
          'Over 450 pupils are engaged in academics, arts, reading, and foundational skills during the summer programme at Gosa.',
        ),
      ],
      impactFigures: [
        impactFigure('gosa-summer-pupils', '450+', 'pupils enrolled in the summer school'),
        impactFigure('gosa-summer-areas', '4', 'learning areas: academics, arts, reading, foundational skills'),
        impactFigure('gosa-summer-status', 'Ongoing', 'currently running in August 2026'),
      ],
      communityContext: 'Gosa is one of the key communities served by MedWHOLE Academy. The summer school reflects the deep trust and partnership between the organisation and local families.',
      whyItMatters: 'The scale of the Gosa programme — over 450 children — demonstrates the demand for quality educational support during school breaks. It positions MedWHOLE as a consistent, reliable presence in the community.',
      participation: {
        description: 'Pupils in Gosa and surrounding areas can participate in the summer school. Families, volunteers, and partners can contact MedWHOLE for current participation or support information.',
        steps: [
          'Academic learning and foundational skills',
          'Creative arts and reading development',
          'Structured activities in a supportive environment',
        ],
      },
      closingReflection: 'When 450 children show up for learning during a school break, it tells you something about the community\'s hunger for education and the trust they place in MedWHOLE Academy.',
      featuredImage: featuredImage(imageIds.summerSchoolGosa, 'Children at the MedWHOLE Academy Summer School in Gosa'),
      category: 'Academy',
      date: '2026-08-01T12:00:00.000Z',
      status: 'ongoing',
      schedule: 'Running throughout August 2026',
      showTime: false,
      location: 'Gosa, FCT Abuja',
      isFree: true,
      requiresRegistration: false,
      featured: true,
      isActive: true,
      ...contact,
    },
    {
      _id: 'newsletter-2026-kunyami-health-outreach',
      _type: 'event',
      title: 'Kunyami Health Outreach',
      slug: { _type: 'slug', current: 'kunyami-health-outreach-2026' },
      excerpt: 'A coordinated free medical outreach that brought preventive, curative, diagnostic, counselling, and referral services to Kunyami Community.',
      description: 'On 14 February 2026, MedWHOLE conducted a free medical outreach for a community without a local health facility, reaching 506 children and adults.',
      content: portableText([
        'All participants passed through registration and triage before receiving care through coordinated service units.',
        'The outreach served 274 children and 232 adults. It provided 450 deworming treatments, 136 laboratory investigations, 39 ECGs, care for 47 eye patients, and 25 medicated glasses.',
        'Seven surgical cases were identified and linked for further care. Individual counselling and referrals were also provided for cases requiring higher-level management.',
      ]),
      storyMoments: [
        storyMoment(
          'health-consultation',
          imageIds.healthConsultation,
          'A clinician attending to a child during the Kunyami Health Outreach',
          'Care that begins with listening',
          'Children and adults moved through registration and triage before receiving individual attention from the clinical teams.',
        ),
        storyMoment(
          'health-diagnostics',
          imageIds.healthDiagnostics,
          'Health workers conducting assessments during the Kunyami outreach',
          'Coordinated diagnostic support',
          'Laboratory investigations, ECGs, eye care, counselling, and referrals worked together as one coordinated service pathway.',
        ),
        storyMoment(
          'health-teamwork',
          imageIds.healthCareTeam,
          'MedWHOLE health workers serving community members in Kunyami',
          'Many disciplines, one purpose',
          'Medical professionals and volunteers combined their skills to make practical care accessible within the community.',
        ),
      ],
      impactFigures: [
        impactFigure('health-total-reached', '506', 'children and adults reached'),
        impactFigure('health-children', '274', 'children attended to'),
        impactFigure('health-adults', '232', 'adults attended to'),
        impactFigure('health-deworming', '450', 'people received deworming treatment'),
      ],
      communityContext: 'Kunyami Community is located in Kyami District, AMAC, FCT Abuja, and has no health facility. Residents ordinarily need to travel elsewhere for basic care.',
      whyItMatters: 'The outreach brought preventive, curative, diagnostic, counselling, and referral services together in one coordinated response. It also created a pathway for cases that required further treatment rather than ending care at the outreach venue.',
      closingReflection: 'The outreach met immediate health needs while opening the door to longer-term community participation and support. Accessible care becomes more meaningful when it is connected to follow-up, local capacity, and dignity.',
      featuredImage: featuredImage(imageIds.healthOutreach, 'Community members gathered for the MedWHOLE Kunyami Health Outreach'),
      category: 'Health',
      date: '2026-02-14T12:00:00.000Z',
      status: 'completed',
      showTime: false,
      location: 'Kunyami Community, Kyami District, AMAC, FCT Abuja',
      isFree: true,
      requiresRegistration: false,
      featured: true,
      isActive: true,
      ...contact,
    },
    {
      _id: 'newsletter-2026-kunyami-compart',
      _type: 'event',
      title: 'Community Participation Programme (COMPART)',
      slug: { _type: 'slug', current: 'community-participation-programme-compart-2026' },
      excerpt: 'A capacity building programme equipping young volunteers from the Kunyami Health Outreach with practical, marketable skills for community development.',
      description: 'The first edition of the Community Participation Programme (COMPART) was launched in Kunyami as a direct follow-up to the Valentine\'s Day health outreach, equipping young volunteers with practical capacity.',
      content: portableText([
        'The Valentine\'s Day health outreach in Kunyami was designed to address immediate need. But MedWHOLE has always understood that wholeness is not built in a single day. So the outreach was not the end of the work in Kunyami, it was the beginning of a longer investment.',
        'The programme was created specifically for the young volunteers who served across the various units on February 14th. Rather than simply thanking them and moving on, MedWHOLE invited them into something deeper: a platform to build practical capacity in areas connected to their interests and passions.',
        'The goal is not only to expose them to practical knowledge but to equip them with scalable, marketable skills that can shape their future and position them as active contributors to the development of their own community.',
        'They came as helpers on February 14th. They are now being equipped as leaders. That is the MedWHOLE journey in motion: Engaged, Discipled, Deployed.',
      ]),
      storyMoments: [
        storyMoment(
          'compart-capacity-building',
          imageIds.compartTraining,
          'Young volunteers participating in COMPART training sessions in Kunyami',
          'From helpers to leaders',
          'Volunteers who served at the health outreach are now building practical skills through the Community Participation Programme.',
        ),
        storyMoment(
          'compart-skills-development',
          imageIds.compartCapacity,
          'COMPART participants learning marketable skills in Kunyami',
          'Equipped for the future',
          'The programme builds scalable, marketable skills connected to each volunteer\'s interests and passions.',
        ),
      ],
      impactFigures: [
        impactFigure('compart-origin', 'Feb 14', 'health outreach volunteers enrolled'),
        impactFigure('compart-focus', 'Capacity', 'building practical, marketable skills'),
        impactFigure('compart-journey', '3 stages', 'Engaged, Discipled, Deployed'),
      ],
      communityContext: 'COMPART was launched in Kunyami as a direct follow-up to the health outreach. It extends MedWHOLE\'s impact beyond one-day service delivery into the longer-term work of community empowerment and sustainable development.',
      whyItMatters: 'The programme transforms one-day volunteers into long-term community leaders. By investing in their capacity, MedWHOLE ensures that the health outreach creates lasting impact through the people who served.',
      participation: {
        description: 'Young volunteers who participated in the Kunyami Health Outreach are invited to join COMPART. Partners and supporters can contact MedWHOLE for information on how to support the programme.',
        steps: [
          'Practical capacity building in areas of interest',
          'Scalable and marketable skills development',
          'Leadership formation through the Engaged-Discipled-Deployed journey',
        ],
      },
      closingReflection: 'COMPART represents the MedWHOLE model at its best: engaging people where they are, building their capacity with intention, and deploying them as agents of change in their own communities.',
      featuredImage: featuredImage(imageIds.compartTraining, 'Young volunteers at the COMPART training programme in Kunyami'),
      category: 'Empowerment',
      date: '2026-03-01T12:00:00.000Z',
      status: 'ongoing',
      schedule: 'Ongoing capacity building programme',
      showTime: false,
      location: 'Kunyami Community, Kyami District, AMAC, FCT Abuja',
      isFree: true,
      requiresRegistration: true,
      featured: true,
      isActive: true,
      ...contact,
    },
  ]

  const transaction = client.transaction()
  for (const event of events) transaction.createOrReplace(event)
  const result = await transaction.commit({ returnDocuments: false })

  console.log(JSON.stringify({ transactionId: result.transactionId, imported: events.map(({ _id, title, status }) => ({ _id, title, status })) }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
