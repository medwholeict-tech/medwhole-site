import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import fs from 'node:fs'
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

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function toPortableText(paragraphs: string[]) {
  return paragraphs
    .filter(p => p.trim())
    .map((text) => ({
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', text, marks: [] }],
    }))
}

async function uploadImageFromPublic(relativePath: string) {
  const fullPath = path.resolve(__dirname, '../public', relativePath)
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Image not found: ${relativePath}, using placeholder`)
    return await uploadImageFromPublic('placeholder-team-collaboration.jpg')
  }
  
  const stream = fs.createReadStream(fullPath)
  const filename = path.basename(fullPath)
  const asset = await client.assets.upload('image', stream as any, { filename })
  return asset._id
}

async function seedSanity() {
  console.log('\n🌱 Starting Complete Sanity Seeding...\n')

  // ========== NEWS ARTICLES ==========
  console.log('📰 Seeding News Articles...')
  
  const newsArticles = [
    {
      id: 'mobile-health-clinics-reach-50000-patients-milestone',
      title: 'Mobile Health Clinics Reach 50,000 Patients Milestone',
      excerpt: 'Our mobile health care has now provided care to over 50,000 patients in remote and underserved communities.',
      category: 'health',
      publishedAt: '2024-02-20T00:00:00Z',
      content: [
        'MedWHOLE Health is proud to announce that our mobile health clinic program has reached a significant milestone: providing care to over 50,000 patients in remote and underserved communities across Nigeria. This achievement represents three years of dedicated service delivery and continuous program improvement.',
        'Program Overview: Our mobile clinic program operates 15 fully-equipped vehicles across six countries, bringing essential health care directly to communities that lack access to health facilities. Each clinic is staffed by qualified healthcare professionals and equipped to provide primary care, maternal and child health care, chronic disease management, and health education.',
        'Services Provided: Over the past three years, we\'ve provided comprehensive primary care consultations, prenatal and postnatal care for over 8,000 mothers, childhood vaccinations for 12,000 children, chronic disease management for 5,000 patients, and health education reaching 30,000 community members.',
        'Patient Impact Stories: Mama Grace, a 65-year-old grandmother from rural Kenya, shares: "Before the mobile clinic started coming to our village, I had to travel 50 kilometers to get my blood pressure medication. Now, the clinic comes every month, and I can manage my condition properly. They\'ve saved my life."',
        'Expansion Plans: Building on this success, we\'re planning to expand the program to reach an additional 30,000 patients annually. We\'re adding five new mobile clinics in 2024 and introducing specialized services including dental care and mental health support.'
      ],
      image: 'mobile-health-clinic-africa-rural-community.jpg'
    },
    {
      id: 'partnership-announcement-collaboration-with-who-nigeria',
      title: 'Partnership Announcement: Collaboration with WHO Nigeria',
      excerpt: 'MedWHOLE Alliance signs MoU with WHO Nigeria Regional Office to strengthen health systems across the continent.',
      category: 'partnership',
      publishedAt: '2024-02-28T00:00:00Z',
      content: [
        'MedWHOLE Alliance is honored to announce a strategic partnership with the World Health Organization Regional Office for Nigeria (WHO AFRO). This collaboration will leverage our combined expertise and resources to strengthen health systems across the Nigerian continent.',
        'Partnership Scope: The Memorandum of Understanding (MoU) establishes a framework for collaboration in several key areas: health workforce development and training, health systems strengthening initiatives, disease surveillance and outbreak response, and research and knowledge sharing.',
        'Joint Initiatives: Under this partnership, we\'ll be launching several joint initiatives including a pan-Nigerian health leadership program, technical assistance for health system strengthening in 15 countries, collaborative research on effective health interventions, and knowledge exchange platforms for health professionals.',
        'Expected Impact: Through this partnership, we aim to train 10,000 health professionals over the next five years, support health system strengthening in 15 countries, contribute to regional disease surveillance capacity, and generate evidence to inform health policy across Nigeria.'
      ],
      image: 'african-health-professionals-in-strategic-meeting-.jpg'
    },
    {
      id: 'new-research-published-on-community-health-worker-impact',
      title: 'New Research Published on Community Health Worker Impact',
      excerpt: 'MedWHOLE research team publishes groundbreaking study showing 35% improvement in health outcomes through community health worker programs.',
      category: 'research',
      publishedAt: '2024-03-05T00:00:00Z',
      content: [
        'MedWHOLE\'s research team has published a comprehensive study in the Journal of Global Health demonstrating the significant impact of well-trained and supported community health workers (CHWs) on health outcomes in rural Nigerian communities. The three-year study, conducted across 150 communities in five countries, provides robust evidence for scaling CHW programs.',
        'Key Findings: Communities with CHW programs showed a 35% improvement in overall health outcomes, 45% increase in prenatal care attendance, 40% reduction in childhood malnutrition, 30% improvement in chronic disease management, and 50% increase in health-seeking behavior for acute illnesses.',
        'Success Factors: Our analysis identified several critical factors for CHW program success: comprehensive initial training (minimum 6 weeks), ongoing supervision and mentorship, integration with formal health system, community selection and support of CHWs, and adequate compensation and recognition.',
        'Policy Implications: These findings have significant implications for health policy across Nigeria. We\'re working with governments to use this evidence to strengthen and expand CHW programs. The study demonstrates that investing in community health workers is not just effective, but cost-effective, with an estimated return of $4 for every $1 invested.'
      ],
      image: 'placeholder-field-research.jpg'
    },
    {
      id: '500-health-workers-complete-leadership-training',
      title: '500+ Health Workers Complete Leadership Training',
      excerpt: 'Our flagship leadership program graduates its largest cohort, with participants from 12 Nigerian nations ready to lead health initiatives in their communities.',
      category: 'academy',
      publishedAt: '2024-03-10T00:00:00Z',
      content: [
        'In a momentous celebration of achievement and potential, MedWHOLE Academy graduated over 500 health professionals from our flagship Public Health Leadership Certificate program. This represents our largest cohort to date, with participants from 12 Nigerian countries bringing diverse perspectives and experiences to the program.',
        'Program Highlights: The six-month intensive program combined online learning with in-person workshops, covering strategic leadership, health systems management, policy development, and team building. Participants engaged in real-world case studies, developed strategic plans for their organizations, and built lasting professional networks across the continent.',
        'Graduate Success Stories: Among this year\'s graduates is Dr. Amina Hassan from Tanzania, who used her capstone project to redesign her district\'s health service delivery model, resulting in a 30% increase in service utilization. Another graduate, John Kamau from Kenya, secured funding to implement a community health worker program based on his leadership training experience.',
        'Impact on Health Systems: Our research shows that 85% of program graduates report implementing significant changes in their organizations within six months of completion. These leaders are now managing larger teams, influencing policy decisions, and driving innovation in their health systems.'
      ],
      image: 'placeholder-training-classroom.jpg'
    },
    {
      id: 'medwhole-launches-new-maternal-health-initiative',
      title: 'MedWHOLE Launches New Maternal Health Initiative',
      excerpt: 'In partnership with regional health ministries, we\'re implementing comprehensive maternal health programs aimed at reducing maternal mortality by 40% over the next three years.',
      category: 'health',
      publishedAt: '2024-03-15T00:00:00Z',
      content: [
        'MedWHOLE Alliance is proud to announce the launch of our most ambitious maternal health initiative to date, spanning five Nigerian countries: Kenya, Ghana, Nigeria, Tanzania, and Senegal. This comprehensive program represents a $15 million investment in maternal health infrastructure, training, and service delivery over the next three years.',
        'Program Overview: The initiative focuses on three key pillars: strengthening health facility capacity, training healthcare workers in emergency obstetric care, and establishing community-based maternal health support systems. Our goal is to reduce maternal mortality by 40% in target regions through evidence-based interventions and sustainable health system improvements.',
        'Key Components: The program includes upgrading 50 health facilities with essential maternal health equipment, training 2,000 healthcare workers in safe delivery practices and emergency obstetric care, establishing 100 community health worker networks for prenatal and postnatal care, and implementing mobile health technology for remote monitoring and consultation.',
        'Expected Impact: Over the three-year period, we expect to directly serve 500,000 pregnant women, reduce maternal mortality by 40% in target areas, train 2,000 healthcare workers in advanced maternal care, and establish sustainable maternal health systems that will continue to benefit communities long after the program concludes.'
      ],
      image: 'african-healthcare-workers-providing-medical-care-.jpg'
    }
  ]

  for (const news of newsArticles) {
    const assetId = await uploadImageFromPublic(news.image)
    await client.createOrReplace({
      _id: `news.${news.id}`,
      _type: 'news',
      title: news.title,
      slug: { _type: 'slug', current: news.id },
      excerpt: news.excerpt,
      publishedAt: news.publishedAt,
      category: news.category,
      featuredImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
        alt: news.title,
      },
      content: toPortableText(news.content),
      featured: newsArticles.indexOf(news) < 3,
      isActive: true,
    })
    console.log(`   ✅ ${news.title}`)
  }

  // ========== PROGRAMS ==========
  console.log('\n🎓 Seeding Programs...')
  
  const programs = [
    // ACADEMY PROGRAMS
    {
      id: 'back-to-school-scholarship-program',
      title: 'Back-to-School Scholarship Program',
      category: 'education',
      description: 'Providing financial support to indigent but deserving students, covering school fees, uniforms, textbooks, and learning materials.',
      content: ['Scholarships and Educational Support for indigent but deserving students.'],
      objectives: ['Reduce financial barriers to education', 'Support deserving students', 'Improve school retention rates'],
      image: 'african-children-learning-education-classroom.jpg'
    },
    {
      id: 'discipleship-character-development',
      title: 'Discipleship & Character Development',
      category: 'education',
      description: 'Weekly Good News Clubs offering value-based and moral instruction every Saturday, shaping godly, purpose-driven children.',
      content: ['Good News Clubs offering value-based and moral instruction every Saturday.'],
      objectives: ['Build strong moral foundation', 'Teach biblical values', 'Develop godly character'],
      image: 'african-children-learning-education-classroom.jpg'
    },
    {
      id: 'skills-acquisition-vocational-training',
      title: 'Skills Acquisition & Vocational Training',
      category: 'education',
      description: 'Curriculum enrichment integrating academics, arts, sports, and entrepreneurship to develop practical life skills.',
      content: ['Curriculum Enrichment integrating academics, arts, sports, and entrepreneurship.', 'Students participating in hands-on projects in arts, sports, creativity, and entrepreneurship.'],
      objectives: ['Develop practical skills', 'Enhance creativity', 'Prepare for entrepreneurship'],
      image: 'african-children-learning-education-classroom.jpg'
    },
    {
      id: 'summer-lessons-program',
      title: 'Summer Lessons Program',
      category: 'education',
      description: 'Free summer schools for over 290 children aged 2-18, providing engaging educational activities during school breaks.',
      content: ['Free Summer and Term-Time Schools for over 290 children aged 2-18.', 'Over 290 children engaged in free summer classes across academics, arts, and foundational skills.'],
      objectives: ['Prevent learning loss during breaks', 'Provide engaging educational activities', 'Support working parents'],
      image: 'african-children-learning-education-classroom.jpg'
    },
    {
      id: 'health-hygiene-nutrition-education',
      title: 'Health, Hygiene & Nutrition Education',
      category: 'education',
      description: 'Access to basic healthcare and nutrition interventions enhancing child development and learning capacity.',
      content: ['Access to basic healthcare and nutrition', 'Enhancing child development and learning capacity through nutrition interventions.'],
      objectives: ['Improve child health', 'Enhance learning capacity', 'Promote hygiene practices'],
      image: 'african-children-learning-education-classroom.jpg'
    },
    {
      id: 'community-outreach-service-learning',
      title: 'Community Outreach & Service Learning',
      category: 'education',
      description: 'Engaging students in community service projects to develop empathy, leadership, and social responsibility.',
      content: ['Community Health Outreach', 'Students engage in service projects that benefit their communities.'],
      objectives: ['Develop social responsibility', 'Build leadership skills', 'Foster community engagement'],
      image: 'african-community-health-education-session.jpg'
    },
    {
      id: 'computer-literacy-technology-training',
      title: 'Computer Literacy & Technology Training',
      category: 'education',
      description: 'Providing technology education and computer skills training to prepare students for the digital age.',
      content: ['Computer Literacy Training', 'Equipping students with essential computer and technology skills for the modern world.'],
      objectives: ['Teach basic computer skills', 'Enhance digital literacy', 'Prepare for technology careers'],
      image: 'african-children-learning-education-classroom.jpg'
    },
    {
      id: 'exam-coaching-waec-jamb',
      title: 'Exam Coaching (WAEC & JAMB)',
      category: 'education',
      description: 'Specialized tutorial program preparing students for WAEC and JAMB examinations to achieve academic excellence.',
      content: ['Exam coaching (WAEC and JAMB)', 'Before joining our WAEC/JAMB tutorial, one student scored 298 in JAMB and is currently pursuing a career in medicine.'],
      objectives: ['Improve exam performance', 'Increase university admission rates', 'Build exam confidence'],
      image: 'african-children-learning-education-classroom.jpg'
    },
    {
      id: 'community-feeding-initiative',
      title: 'Community Feeding Initiative',
      category: 'education',
      description: 'Providing nutritious meals to students, addressing hunger and improving concentration and learning outcomes.',
      content: ['Community Feeding Initiative', 'Health & Nutrition Support', 'Providing nutritious meals to support child development and enhance learning capacity.'],
      objectives: ['Address childhood hunger', 'Improve nutrition', 'Enhance learning outcomes'],
      image: 'african-children-learning-education-classroom.jpg'
    },
    // HEALTH PROGRAMS
    {
      id: 'gosa-primary-health-centre-operations',
      title: 'Gosa Primary Health Centre Operations',
      category: 'health',
      description: 'Improving governance, infrastructure, and community engagement at GOSA PHC to deliver quality primary healthcare.',
      content: ['Gosa PHC Optimization Project', 'Improving governance, infrastructure, and community engagement at GOSA PHC.'],
      objectives: ['Strengthen governance', 'Upgrade infrastructure', 'Increase service utilization', 'Improve community engagement'],
      image: 'african-healthcare-workers-providing-medical-care-.jpg'
    },
    {
      id: 'rhema-memorial-hospital-partnership',
      title: 'Rhema Memorial Hospital Partnership',
      category: 'health',
      description: 'Developing a structured handover and revitalization model to improve operations and service delivery in rural hospital settings.',
      content: ['Rhema Hospital Transition (Kwali)', 'Developing a structured handover and revitalization model to improve operations and service delivery in rural hospital settings.'],
      objectives: ['Improve hospital operations', 'Strengthen service delivery', 'Support rural healthcare'],
      image: 'african-healthcare-workers-providing-medical-care-.jpg'
    },
    {
      id: 'community-health-hub-initiative',
      title: 'Community Health Hub Initiative',
      category: 'health',
      description: 'An integrated hub offering digital health, clinical services, and community outreach to provide comprehensive care.',
      content: ['Royal Estate Health Hub', 'An integrated hub offering digital health, clinical services, and community outreach.'],
      objectives: ['Provide integrated care', 'Leverage digital health', 'Expand community outreach'],
      image: 'african-healthcare-workers-providing-medical-care-.jpg'
    },
    {
      id: 'emergency-preparedness-response-training',
      title: 'Emergency Preparedness & Response Training',
      category: 'health',
      description: 'CPR and BLS training for public servants, health workers, and NYSC members to build emergency response capacity.',
      content: ['Emergency Preparedness Training', 'CPR and BLS training for public servants, health workers, and NYSC members.'],
      objectives: ['Build emergency response capacity', 'Train in life-saving skills', 'Improve preparedness'],
      image: 'african-healthcare-workers-providing-medical-care-.jpg'
    },
    // CONSULTING PROGRAMS
    {
      id: 'health-facility-assessment-accreditation',
      title: 'Health Facility Assessment & Accreditation',
      category: 'consulting',
      description: 'Comprehensive audits of hospitals and health facilities to improve quality, efficiency, and compliance standards.',
      content: ['Facility and Systems Assessment', 'Comprehensive audits of hospitals and health facilities to improve quality and efficiency.', 'This program equips public health professionals and hospital managers with the skills to conduct comprehensive audits of hospitals and health facilities. Participants will learn to assess infrastructure, staffing, service delivery, and operational systems, and develop actionable recommendations to improve healthcare quality and efficiency.'],
      objectives: ['Conduct comprehensive facility audits', 'Identify gaps in service delivery', 'Strengthen quality of care', 'Develop actionable improvement plans'],
      image: 'african-health-professionals-in-strategic-meeting-.jpg'
    },
    {
      id: 'research-evidence-generation',
      title: 'Research & Evidence Generation',
      category: 'consulting',
      description: 'Systematic reviews, impact evaluations, and operational studies that generate evidence to inform health decisions and policy.',
      content: ['Public Health Research', 'Systematic reviews, impact evaluations, and operational studies that inform health decisions.', 'For public health professionals seeking advanced research skills, this program focuses on systematic reviews, operational studies, and health impact evaluations. Participants will learn research design, data collection, and analysis methods to generate evidence that informs policy and program decisions.'],
      objectives: ['Conduct rigorous public health research', 'Analyze data to inform health programs', 'Generate evidence for policy advocacy', 'Publish findings to contribute to public health knowledge'],
      image: 'placeholder-field-research.jpg'
    },
    {
      id: 'policy-development-advocacy',
      title: 'Policy Development & Advocacy',
      category: 'consulting',
      description: 'Developing practical frameworks for hospital transitions, partnerships, and PHC reforms with stakeholder engagement.',
      content: ['Policy Design and Technical Support', 'Developing practical frameworks for hospital transitions, partnerships, and PHC reforms.', 'This program provides professionals with the skills to design frameworks for hospital transitions, NGO partnerships, and primary healthcare reforms. Participants will learn stakeholder engagement, policy drafting, and operational guidance for effective health system strengthening.'],
      objectives: ['Design practical health policies and frameworks', 'Strengthen NGO and government partnerships', 'Improve operational efficiency in health systems', 'Support sustainable health reforms'],
      image: 'african-health-professionals-in-strategic-meeting-.jpg'
    },
    {
      id: 'monitoring-evaluation-learning-mel',
      title: 'Monitoring, Evaluation & Learning (MEL)',
      category: 'consulting',
      description: 'Building data systems for performance tracking, establishing indicators, and creating dashboards for evidence-based improvement.',
      content: ['Monitoring, Evaluation, and Learning (MEL)', 'Building data systems for performance tracking and evidence-based improvement.', 'Participants learn to establish robust data systems for performance tracking and evidence generation. The program focuses on developing MEL frameworks, designing indicators, and creating dashboards to measure program impact and inform decision-making.'],
      objectives: ['Develop and implement MEL frameworks', 'Establish data collection systems and dashboards', 'Track program performance effectively', 'Use evidence to improve health interventions'],
      image: 'placeholder-data-analysis.jpg'
    },
    {
      id: 'capacity-building-technical-training',
      title: 'Capacity Building & Technical Training',
      category: 'consulting',
      description: 'Technical support for governments, NGOs, and private organizations on health systems strengthening and workforce planning.',
      content: ['Training and Advisory', 'Technical support for governments, NGOs, and private organizations on health systems strengthening and workforce planning.', 'This program provides technical assistance skills to government agencies, NGOs, and private organizations. Participants learn health system strengthening, workforce planning, and advisory techniques to improve service delivery and organizational performance.'],
      objectives: ['Provide expert advisory support', 'Strengthen health systems and workforce capacity', 'Design and implement effective health programs', 'Enhance organizational performance'],
      image: 'african-health-professionals-in-strategic-meeting-.jpg'
    }
  ]

  for (const program of programs) {
    const assetId = await uploadImageFromPublic(program.image)
    await client.createOrReplace({
      _id: `program.${program.id}`,
      _type: 'program',
      title: program.title,
      slug: { _type: 'slug', current: program.id },
      description: program.description,
      content: toPortableText(program.content),
      featuredImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
        alt: program.title,
      },
      category: program.category,
      objectives: program.objectives,
      featured: programs.indexOf(program) < 6,
      isActive: true,
    })
    console.log(`   ✅ ${program.title}`)
  }

  // ========== EVENTS ==========
  console.log('\n📅 Seeding Events...')
  
  const events = [
    {
      id: 'public-health-leadership-summit-2025',
      title: 'Public Health Leadership Summit 2025',
      category: 'Academy',
      date: '2025-10-15T00:00:00Z',
      location: 'Abuja, Nigeria',
      excerpt: 'A premier gathering of public health leaders, policymakers, and practitioners from across Nigeria to discuss the future of public health leadership and innovation.',
      content: [
        'A premier gathering of public health leaders, policymakers, and practitioners from across Nigeria to discuss the future of public health leadership and innovation. The summit will feature keynote speakers, panel discussions, and networking opportunities.',
        'Objectives: Foster collaboration and knowledge sharing among public health leaders, showcase innovative approaches to public health challenges, develop actionable strategies for strengthening health systems, and inspire the next generation of public health leaders.'
      ],
      image: 'placeholder-training-classroom.jpg'
    },
    {
      id: 'epidemiology-masterclass-series',
      title: 'Epidemiology Masterclass Series',
      category: 'Academy',
      date: '2025-09-22T00:00:00Z',
      location: 'Kampala, Uganda',
      excerpt: 'An advanced masterclass for epidemiologists and public health researchers looking to deepen their skills in study design, data analysis, and outbreak investigation.',
      content: [
        'An advanced masterclass for epidemiologists and public health researchers looking to deepen their skills in study design, data analysis, and outbreak investigation. This intensive program will cover advanced topics in epidemiological methods.',
        'Objectives: Master advanced epidemiological study designs, enhance skills in biostatistics and data analysis, improve capacity for outbreak investigation and response, and network with leading epidemiologists in the field.'
      ],
      image: 'placeholder-training-classroom.jpg'
    },
    {
      id: 'research-methods-grant-writing-workshop',
      title: 'Research Methods & Grant Writing Workshop',
      category: 'Academy',
      date: '2025-08-10T00:00:00Z',
      location: 'Accra, Ghana',
      excerpt: 'A practical, hands-on workshop designed to equip researchers and public health professionals with the skills to design robust research studies and write successful grant proposals.',
      content: [
        'A practical, hands-on workshop designed to equip researchers and public health professionals with the skills to design robust research studies and write successful grant proposals. This workshop is ideal for early-career researchers.',
        'Objectives: Understand the principles of research design and methodology, develop a research protocol from concept to completion, master the art of writing compelling grant proposals, and learn to create and manage research budgets.'
      ],
      image: 'placeholder-training-classroom.jpg'
    },
    {
      id: 'health-ministry-strategic-planning',
      title: 'Health Ministry Strategic Planning',
      category: 'Consulting',
      date: '2025-09-01T00:00:00Z',
      location: 'Ministry of Health, Rwanda',
      excerpt: 'Comprehensive strategic planning engagement with the Rwanda Ministry of Health to develop a robust 2025-2030 health sector strategic plan.',
      content: [
        'Comprehensive strategic planning engagement with the Rwanda Ministry of Health to develop a robust 2025-2030 health sector strategic plan, focusing on universal health coverage and health system strengthening.',
        'Objectives: Develop comprehensive 2025-2030 health sector strategic plan, align health priorities with national development goals, strengthen health system governance structures, and establish monitoring and evaluation frameworks.'
      ],
      image: 'african-health-professionals-in-strategic-meeting-.jpg'
    },
    {
      id: 'ngo-capacity-building-program',
      title: 'NGO Capacity Building Program',
      category: 'Consulting',
      date: '2025-08-01T00:00:00Z',
      location: 'East Nigeria Region',
      excerpt: 'Comprehensive organizational strengthening program targeting 15 health-focused NGOs across East Nigeria, focusing on governance, financial management, program design, and sustainability.',
      content: [
        'Comprehensive organizational strengthening program targeting 15 health-focused NGOs across East Nigeria, focusing on governance, financial management, program design, and sustainability.',
        'Objectives: Strengthen organizational governance and leadership, improve financial management and sustainability, enhance program design and implementation capacity, and build monitoring, evaluation, and learning systems.'
      ],
      image: 'african-health-professionals-in-strategic-meeting-.jpg'
    },
    {
      id: 'regional-me-system-development',
      title: 'Regional M&E System Development',
      category: 'Consulting',
      date: '2025-07-01T00:00:00Z',
      location: 'West Nigeria Region',
      excerpt: 'Design and implementation of a unified monitoring and evaluation system for regional health programs across West Nigeria.',
      content: [
        'Design and implementation of a unified monitoring and evaluation system for regional health programs across West Nigeria, enabling data-driven decision making and improved program effectiveness.',
        'Objectives: Design comprehensive M&E framework for regional programs, establish data collection and management systems, build M&E capacity among implementing partners, and create performance dashboards and reporting systems.'
      ],
      image: 'placeholder-data-analysis.jpg'
    },
    {
      id: 'world-heart-day-campaign',
      title: 'World Heart Day Campaign',
      category: 'Health Services',
      date: '2025-09-29T00:00:00Z',
      location: 'Community Centers, Lagos',
      excerpt: 'A city-wide campaign to raise awareness about cardiovascular diseases, offering free heart health screenings, educational workshops, and promoting healthy lifestyles.',
      content: [
        'A city-wide campaign to raise awareness about cardiovascular diseases, offering free heart health screenings, educational workshops, and promoting healthy lifestyles in observance of World Heart Day.',
        'Objectives: Raise awareness about cardiovascular disease prevention, provide free heart health screenings to 5,000 people, educate communities on healthy lifestyle choices, and promote early detection and management of heart conditions.'
      ],
      image: 'african-healthcare-workers-providing-medical-care-.jpg'
    },
    {
      id: 'maternal-health-outreach-program',
      title: 'Maternal Health Outreach Program',
      category: 'Health Services',
      date: '2025-10-01T00:00:00Z',
      location: 'Rural Communities, Gulu District',
      excerpt: 'A month-long mobile health outreach program providing essential maternal and child health services to underserved rural communities.',
      content: [
        'A month-long mobile health outreach program providing essential maternal and child health services to underserved rural communities in Gulu District, including prenatal care, vaccinations, and health education.',
        'Objectives: Provide prenatal care to 1,000 pregnant women, administer essential vaccinations to 2,000 children, deliver health education on safe motherhood and nutrition, and identify and refer high-risk pregnancies to health facilities.'
      ],
      image: 'mobile-health-clinic-africa-rural-community.jpg'
    },
    {
      id: 'diabetes-awareness-screening-week',
      title: 'Diabetes Awareness and Screening Week',
      category: 'Health Services',
      date: '2025-11-14T00:00:00Z',
      location: 'Various Locations, Accra',
      excerpt: 'A week-long initiative for World Diabetes Day, offering free diabetes screenings, educational seminars, and personalized counseling.',
      content: [
        'A week-long initiative for World Diabetes Day, offering free diabetes screenings, educational seminars, and personalized counseling to promote early detection and effective management of diabetes.',
        'Objectives: Screen 10,000 individuals for diabetes and pre-diabetes, raise public awareness about diabetes risk factors and symptoms, provide education on diabetes prevention and management, and connect individuals with follow-up care and support services.'
      ],
      image: 'african-healthcare-workers-providing-medical-care-.jpg'
    }
  ]

  for (const event of events) {
    const assetId = await uploadImageFromPublic(event.image)
    await client.createOrReplace({
      _id: `event.${event.id}`,
      _type: 'event',
      title: event.title,
      slug: { _type: 'slug', current: event.id },
      date: event.date,
      location: event.location,
      excerpt: event.excerpt,
      category: event.category,
      content: [
        ...toPortableText(event.content),
        {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
          alt: event.title,
        },
      ],
      featured: events.indexOf(event) < 3,
      isActive: true,
    })
    console.log(`   ✅ ${event.title}`)
  }

  // ========== TEAM MEMBERS ==========
  console.log('\n👥 Seeding Team Members...')
  
  const team = [
    {
      id: 'prof-chima-onoka',
      name: 'Prof. Chima Onoka',
      role: 'Trustee',
      bio: 'Professor Chima Onoka is the Founder and President of MedWHOLE Alliance, bringing decades of experience in public health and health systems strengthening across Nigeria.',
      image: 'placeholder-user.jpg'
    },
    {
      id: 'dr-ferdinand-ogbaji',
      name: 'Dr. Ferdinand Ogbaji',
      role: 'Director of Programmes',
      bio: 'Dr. Ferdinand Ogbaji serves as the Director of Programmes at MedWHOLE Alliance, overseeing program design, implementation, and monitoring across all three arms of the organization.',
      image: 'placeholder-user.jpg'
    }
  ]

  for (const member of team) {
    const assetId = await uploadImageFromPublic(member.image)
    await client.createOrReplace({
      _id: `team.${member.id}`,
      _type: 'team',
      name: member.name,
      role: member.role,
      category: 'leadership',
      bio: member.bio,
      photo: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
        alt: member.name,
      },
      order: team.indexOf(member) + 1,
      isActive: true,
    })
    console.log(`   ✅ ${member.name} - ${member.role}`)
  }

  // ========== GALLERY ==========
  console.log('\n🖼️  Seeding Gallery...')
  
  const gallery = [
    // Academy
    { title: 'Summer School Program', description: 'Over 290 children engaged in free summer classes across academics, arts, and foundational skills.', category: 'academy', image: 'african-children-learning-education-classroom.jpg' },
    { title: 'Term-Time Learning Sessions', description: 'Providing consistent, tuition-free education for children aged 2-18 throughout the school year.', category: 'academy', image: 'african-children-learning-education-classroom.jpg' },
    { title: 'Scholarship Awards Ceremony', description: 'Celebrating indigent but deserving students receiving academic scholarships and educational support.', category: 'academy', image: 'placeholder-graduation.jpg' },
    { title: 'Curriculum Enrichment Activities', description: 'Students participating in hands-on projects in arts, sports, creativity, and entrepreneurship.', category: 'academy', image: 'african-children-learning-education-classroom.jpg' },
    // Health
    { title: 'Gosa PHC Optimization Project', description: 'Improving governance, infrastructure, and community engagement at GOSA PHC.', category: 'health', image: 'african-healthcare-workers-providing-medical-care-.jpg' },
    { title: 'Rhema Hospital Transition', description: 'Developing a structured handover and revitalization model to improve operations in rural hospital settings.', category: 'health', image: 'african-healthcare-workers-providing-medical-care-.jpg' },
    { title: 'Royal Estate Health Hub', description: 'An integrated hub offering digital health, clinical services, and community outreach.', category: 'health', image: 'african-healthcare-workers-providing-medical-care-.jpg' },
    { title: 'Emergency Preparedness Training', description: 'CPR and BLS training for public servants, health workers, and NYSC members.', category: 'health', image: 'african-healthcare-workers-providing-medical-care-.jpg' },
    // Events
    { title: 'WHO Partnership Signing', description: 'Signing ceremony for our partnership with WHO Nigeria', category: 'events', image: 'african-health-professionals-in-strategic-meeting-.jpg' },
    { title: 'Team Collaboration', description: 'Our diverse team working together on community health initiatives', category: 'events', image: 'placeholder-team-collaboration.jpg' }
  ]

  for (const item of gallery) {
    const slug = slugify(item.title)
    const assetId = await uploadImageFromPublic(item.image)
    await client.createOrReplace({
      _id: `gallery.${slug}`,
      _type: 'gallery',
      title: item.title,
      description: item.description,
      category: item.category,
      order: gallery.indexOf(item) + 1,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
        alt: item.title,
      },
      isActive: true,
    })
    console.log(`   ✅ ${item.title}`)
  }

  console.log('\n✅ Complete seeding finished successfully!')
  console.log('   Studio: /studio')
}

seedSanity().catch((error) => {
  console.error('\n❌ Seeding failed:', error)
  process.exit(1)
})
