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

function portableText(paragraphs: string[]) {
  return paragraphs.map((p, i) => ({
    _type: 'block',
    _key: `block-${i}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `span-${i}`, text: p, marks: [] }],
  }))
}

function h2Block(text: string, key: string) {
  return {
    _type: 'block',
    _key: key,
    style: 'h2',
    markDefs: [],
    children: [{ _type: 'span', _key: `span-${key}`, text, marks: [] }],
  }
}

function listBlock(items: string[], key: string) {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    listItem: 'bullet',
    markDefs: [],
    children: items.map((item, i) => ({
      _type: 'span',
      _key: `${key}-${i}`,
      text: item,
      marks: [],
    })),
  }
}

const programs = [
  // ── HEALTH ──
  {
    slug: 'medical-outreaches',
    description: 'Direct community medical outreaches that bring essential health services to people at their point of need.',
    objectives: [
      'Community consultations',
      'Basic treatments and screenings',
      'Health education',
      'Referral pathways',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'Medical outreaches are the foundation of MedWHOLE\'s health service delivery. They bring essential health services directly to urban slum communities — areas like Gosa and Kunyami in FCT Abuja where access to basic healthcare is limited or absent.',
        'Each outreach is structured across multiple service units working together: registration, triage, consultations, laboratory investigations, pharmacy, counselling, and referral. This coordinated approach ensures that every beneficiary receives comprehensive care in a single visit.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Improved access to essential health services',
        'Earlier identification of health needs',
        'Stronger community trust in health services',
      ], 'outcomes-list'),
    ],
  },
  {
    slug: 'specialist-referral-support',
    description: 'Connecting community members who need further care with appropriate specialist services and follow-through.',
    objectives: [
      'Needs identification',
      'Referral coordination',
      'Follow-up support',
      'Care navigation',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'Not every health need can be addressed in a single outreach visit. MedWHOLE\'s specialist referral support ensures that individuals who require further care are connected with appropriate specialist services and supported through the process.',
        'From identifying the need during outreach to coordinating the referral and providing follow-up support, MedWHOLE walks with each person through their care journey — ensuring no one falls through the gaps.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Patients reach the right level of care',
        'Continuity of care for vulnerable people',
        'Reduced drop-off after referral',
      ], 'outcomes-list'),
    ],
  },
  {
    slug: 'behaviour-change-communication',
    description: 'Practical health communication that helps families and communities adopt behaviours that protect and improve health.',
    objectives: [
      'Health education sessions',
      'Community dialogues',
      'Caregiver education',
      'Preventive health messaging',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'MedWHOLE\'s behaviour change communication programme uses practical, community-based health communication to help families and communities adopt behaviours that protect and improve health.',
        'Through health education sessions, community dialogues, caregiver education, and preventive health messaging, the programme addresses the root causes of preventable illness — not just the symptoms.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Healthier everyday practices',
        'Greater community ownership of health',
        'Prevention of avoidable illness',
      ], 'outcomes-list'),
    ],
  },
  {
    slug: 'preventive-chemotherapy',
    description: 'Preventive chemotherapy interventions that protect vulnerable communities from preventable disease.',
    objectives: [
      'Community distribution campaigns',
      'Disease prevention',
      'Health worker coordination',
      'Follow-up monitoring',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'MedWHOLE\'s preventive chemotherapy programme delivers targeted interventions that protect vulnerable communities from preventable disease. Through community distribution campaigns, the programme reaches at-risk populations with life-saving treatments.',
        'The programme coordinates with local health workers to ensure distribution is effective, monitored, and followed up — building community health resilience in the process.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Reduced burden of preventable disease',
        'Protection for at-risk groups',
        'Stronger community health resilience',
      ], 'outcomes-list'),
    ],
  },
  {
    slug: 'community-patient-care-cpc-programme',
    description: 'Structured community-based patient care that extends support beyond facilities into homes and neighbourhoods.',
    objectives: [
      'Patient follow-up',
      'Home-based care support',
      'Caregiver guidance',
      'Community health linkages',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'The Community Patient Care (CPC) Programme extends MedWHOLE\'s health support beyond clinical settings into homes and neighbourhoods. It provides structured, community-based patient care that ensures continuity and consistency.',
        'Through patient follow-up, home-based care support, caregiver guidance, and community health linkages, the programme bridges the gap between facility-based care and the realities of everyday life in urban slum communities.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Consistent care beyond the clinic',
        'Supported recovery at home',
        'Stronger family participation in care',
      ], 'outcomes-list'),
    ],
  },
  {
    slug: 'health-systems-strengthening',
    description: 'Supporting the structured improvement of health systems and institutions, including facility revitalisation and optimisation.',
    objectives: [
      'Systems assessment',
      'Institutional support',
      'Service delivery improvement',
      'Community engagement',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'MedWHOLE\'s health systems strengthening work supports the structured improvement of health systems and institutions. This includes facility revitalisation, institutional capacity building, and service delivery improvement.',
        'The programme works in partnership with health institutions to assess systems, identify gaps, and implement sustainable improvements — ensuring that the infrastructure for community health is strong and lasting.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Stronger health systems',
        'Better-functioning facilities',
        'Sustainable institutional capacity',
      ], 'outcomes-list'),
    ],
  },

  // ── EDUCATION ──
  {
    slug: 'back-to-school-scholarship-programme',
    description: 'Scholarship support that has helped over 50 school dropouts return to formal education.',
    objectives: [
      'Student identification',
      'Tuition and exam fee support',
      'Uniforms and learning materials',
      'Mentorship and follow-up',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'The Back-to-School Scholarship Programme provides targeted scholarship support that has helped over 50 school dropouts return to formal education. It addresses the financial barriers that prevent vulnerable children from accessing education.',
        'Beyond tuition and exam fees, the programme provides uniforms, learning materials, and ongoing mentorship — ensuring that each child has what they need to stay in school and succeed.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Dropouts return to formal education',
        'Academic stability for vulnerable children',
        'Restored hope and confidence',
      ], 'outcomes-list'),
    ],
  },
  {
    slug: 'summer-holiday-lessons',
    description: 'Holiday lessons that have impacted hundreds of children since 2021, bridging learning gaps between academic sessions.',
    objectives: [
      'Subject-focused classes',
      'Remedial tutoring',
      'Learning assessments',
      'Confidence building',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'MedWHOLE\'s summer holiday lessons have impacted hundreds of children since 2021. The programme bridges learning gaps between academic sessions, ensuring that children in urban slum communities continue to grow academically during the holidays.',
        'Activities include subject-focused classes, remedial tutoring, learning assessments, creative arts, reading programmes, and foundational skills development — all designed to prepare children for the next academic session.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Bridged learning gaps',
        'Academic consistency',
        'Readiness for new sessions',
      ], 'outcomes-list'),
    ],
  },
  {
    slug: 'exam-coaching-waec-jamb',
    description: 'Students with particular needs are identified and supported through one-on-one tutoring for WAEC and JAMB.',
    objectives: [
      'Needs identification',
      'One-on-one tutoring',
      'Past-question practice',
      'Study guidance',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'MedWHOLE\'s exam coaching programme supports senior secondary students preparing for WAEC and JAMB examinations. Students with particular needs are identified and supported through personalised one-on-one tutoring.',
        'The programme includes past-question practice, study guidance, and exam preparation strategies. Success stories have been recorded, with students gaining admission to higher institutions.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Improved exam performance',
        'Pathways to higher education',
        'Recorded student success stories',
      ], 'outcomes-list'),
    ],
  },
  {
    slug: 'good-news-club',
    description: 'An avenue for character-building and mentorship, forming the discipleship heart of MedWHOLE\'s education work.',
    objectives: [
      'Character-building lessons',
      'Mentorship',
      'Values formation',
      'Group activities',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'The Good News Club is MedWHOLE\'s primary avenue for character-building and mentorship. It forms the discipleship heart of the organisation\'s education work — shaping godly character, purpose, and identity in children.',
        'Through weekly sessions that include character-building lessons, mentorship, values formation, and group activities, the club nurtures children who grow in faith, character, and purpose. The club has expanded to multiple communities in FCT Abuja.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Godly character formed',
        'Purpose and identity strengthened',
        'Caring mentor relationships',
      ], 'outcomes-list'),
    ],
  },

  // ── NUTRITION ──
  {
    slug: 'targeted-nutrition-support',
    description: 'Supporting vulnerable families with raw food packs to protect children and households at risk of malnutrition.',
    objectives: [
      'Household identification',
      'Raw food pack distribution',
      'Nutrition guidance',
      'Follow-up',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'MedWHOLE\'s targeted nutrition support programme provides raw food packs to vulnerable families and households at risk of malnutrition in urban slum communities. The programme recognises that child survival, learning, and development are inseparable from nutritional wellbeing.',
        'Through household identification, distribution, nutrition guidance, and follow-up, the programme delivers dignified family support that protects children and strengthens household food security.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Improved household food security',
        'Reduced malnutrition risk',
        'Dignified family support',
      ], 'outcomes-list'),
    ],
  },
  {
    slug: 'life-saving-nutrition-interventions',
    description: 'Provision of specialized meals and supplements for severely malnourished children to restore health and vitality.',
    objectives: [
      'Nutrition assessment',
      'Specialized meals',
      'Therapeutic supplements',
      'Recovery monitoring',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'MedWHOLE\'s life-saving nutrition interventions provide specialised meals and supplements for severely malnourished children. The programme is designed to restore health and vitality to children whose nutritional status threatens their survival and development.',
        'Through nutrition assessment, specialised meals, therapeutic supplements, and recovery monitoring, the programme saves young lives and supports healthy child development.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Restored health and vitality',
        'Saved young lives',
        'Supported child development',
      ], 'outcomes-list'),
    ],
  },
  {
    slug: 'community-feeding-initiative',
    description: 'Distribution of raw food packs and nutritional supplies during outreach and holiday events.',
    objectives: [
      'Event-based distribution',
      'Nutritional supplies',
      'Volunteer mobilisation',
      'Community engagement',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'The Community Feeding Initiative distributes raw food packs and nutritional supplies during outreach events and holiday programmes. It ensures that nutrition needs are met during the moments when communities come together.',
        'Through event-based distribution, volunteer mobilisation, and community engagement, the initiative reaches vulnerable households and strengthens community participation in nutrition support.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Nutrition needs met during outreaches',
        'Wider reach to vulnerable households',
        'Stronger community participation',
      ], 'outcomes-list'),
    ],
  },

  // ── EMPOWERMENT ──
  {
    slug: 'compart-programme',
    description: 'MedWHOLE\'s flagship empowerment programme that grows local human capital and builds the skills base communities need for sustainability.',
    objectives: [
      'Skills development',
      'Community actor development',
      'Sustainability planning',
      'Local leadership growth',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'The Community Participation Programme (ComPart) is MedWHOLE\'s flagship empowerment programme. It grows local human capital and builds the skills base that urban slum communities need for sustainability.',
        'ComPart was launched as a direct follow-up to the February 2026 health outreach in Kunyami. It was created specifically for the young volunteers who served across the various outreach units — inviting them into a platform to build practical capacity in areas connected to their interests and passions.',
        'The goal is not only to expose them to practical knowledge but to equip them with scalable, marketable skills that can shape their future and position them as active contributors to the development of their own community. They came as helpers. They are now being equipped as leaders.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Local capacity for lasting change',
        'People equipped as drivers of change',
        'Sustainable community skills base',
      ], 'outcomes-list'),
    ],
  },
  {
    slug: 'income-generating-crafts-workshops',
    description: 'Practical crafts training that gives participants income-generating skills for household stability.',
    objectives: [
      'Crafts production training',
      'Starter guidance',
      'Basic entrepreneurship',
      'Product development',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'MedWHOLE\'s income-generating crafts workshops provide practical, hands-on training that equips participants with income-generating skills for household stability.',
        'Through crafts production training, starter guidance, basic entrepreneurship, and product development, participants gain the skills and confidence to create new income streams and build household economic resilience.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'New income streams',
        'Practical vocational skills',
        'Household economic resilience',
      ], 'outcomes-list'),
    ],
  },
  {
    slug: 'bls-cpr-training',
    description: 'Basic Life Support (BLS) and cardiopulmonary resuscitation (CPR) training that builds community first responders.',
    objectives: [
      'CPR technique',
      'Basic Life Support',
      'Emergency response',
      'Practical drills',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'MedWHOLE\'s BLS and CPR training programme builds community first responders — equipping everyday people with the skills to save lives in emergency situations.',
        'Through hands-on training in CPR technique, Basic Life Support, emergency response, and practical drills, the programme creates a network of capable first responders within urban slum communities.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Community first responders',
        'Lives saved through quick intervention',
        'Increased emergency readiness',
      ], 'outcomes-list'),
    ],
  },
  {
    slug: 'digital-literacy',
    description: 'Digital literacy training that prepares children and community members to participate confidently in a digital world.',
    objectives: [
      'Basic computer skills',
      'Safe internet use',
      'Hands-on practice',
      'Everyday digital tasks',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'MedWHOLE\'s digital literacy programme prepares children and community members to participate confidently in a digital world. It addresses the digital exclusion that many residents of urban slum communities face.',
        'Through practical classes in basic computer skills, safe internet use, hands-on practice, and everyday digital tasks, participants gain the digital confidence needed for modern learning, work, and participation.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Digital confidence',
        'Participation in modern learning and work',
        'Reduced digital exclusion',
      ], 'outcomes-list'),
    ],
  },
  {
    slug: 'mentorship-volunteer-capacity-building',
    description: 'Professional mentorship and volunteer capacity building that grow the people who carry the mission forward.',
    objectives: [
      'Professional mentorship',
      'Volunteer training',
      'Leadership development',
      'Ongoing support',
    ],
    content: [
      h2Block('About This Programme', 'about'),
      ...portableText([
        'MedWHOLE\'s mentorship and volunteer capacity building programme invests in the people who carry the mission forward. It provides professional mentorship and structured volunteer development that grows the organisation\'s most important asset: its people.',
        'Through professional mentorship, volunteer training, leadership development, and ongoing support, the programme equips volunteers and builds a sustainable mission workforce.',
      ]),
      h2Block('Outcomes', 'outcomes'),
      listBlock([
        'Equipped volunteers',
        'Guided professional growth',
        'A sustainable mission workforce',
      ], 'outcomes-list'),
    ],
  },
]

async function main() {
  let updated = 0
  for (const prog of programs) {
    try {
      const doc = await client.fetch('*[_type == "program" && slug.current == $slug][0]._id', { slug: prog.slug })
      if (!doc) {
        console.log(`Not found: ${prog.slug}`)
        continue
      }
      await client.patch(doc).set({
        description: prog.description,
        objectives: prog.objectives,
        content: prog.content,
      }).commit()
      console.log(`Updated: ${prog.slug}`)
      updated++
    } catch (err) {
      console.error(`Error updating ${prog.slug}:`, err)
    }
  }
  console.log(`\nDone. Updated ${updated}/${programs.length} programmes.`)
}

main().catch(console.error)
