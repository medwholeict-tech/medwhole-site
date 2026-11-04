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

type PortableTextBlock = {
  _type: 'block'
  style: 'normal'
  markDefs: any[]
  children: Array<{ _type: 'span'; text: string; marks: string[] }>
}

function boolFromEnv(value?: string) {
  if (!value) return false
  return ['1', 'true', 'yes', 'y', 'on'].includes(value.toLowerCase())
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function truncate(input: string, max: number) {
  const s = input.trim()
  if (s.length <= max) return s
  return s.slice(0, max - 1).trimEnd() + '…'
}

function stripBullet(line: string) {
  return line.replace(/^[\uFFFD�•\-*]+\s*/g, '').trim()
}

function toPortableText(paragraphs: string[]): PortableTextBlock[] {
  return paragraphs
    .map((p) => p.trim())
    .filter(Boolean)
    .map((text) => ({
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', text, marks: [] }],
    }))
}

function monthIndex(month: string) {
  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ]
  return months.indexOf(month.toLowerCase())
}

function parseDateToISO(input: string): string | null {
  const text = input.trim()

  // e.g. "March 15, 2024"
  const m1 = text.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/)
  if (m1) {
    const mi = monthIndex(m1[1])
    if (mi >= 0) return new Date(Date.UTC(Number(m1[3]), mi, Number(m1[2]), 0, 0, 0)).toISOString()
  }

  // e.g. "October 15-17, 2025" (take first day)
  const m2 = text.match(/^([A-Za-z]+)\s+(\d{1,2})-\d{1,2},\s*(\d{4})$/)
  if (m2) {
    const mi = monthIndex(m2[1])
    if (mi >= 0) return new Date(Date.UTC(Number(m2[3]), mi, Number(m2[2]), 0, 0, 0)).toISOString()
  }

  // e.g. "September 2025" (first day)
  const m3 = text.match(/^([A-Za-z]+)\s+(\d{4})$/)
  if (m3) {
    const mi = monthIndex(m3[1])
    if (mi >= 0) return new Date(Date.UTC(Number(m3[2]), mi, 1, 0, 0, 0)).toISOString()
  }

  // e.g. "2025-10-15"
  const m4 = text.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (m4) {
    return new Date(Date.UTC(Number(m4[1]), Number(m4[2]) - 1, Number(m4[3]), 0, 0, 0)).toISOString()
  }

  return null
}

function getSection(lines: string[], startMarker: string, endMarkers: string[]) {
  const startIndex = lines.findIndex((l) => l.includes(startMarker))
  if (startIndex < 0) return []

  const afterStart = lines.slice(startIndex + 1)
  const endIndexRel = afterStart.findIndex((l) => endMarkers.some((m) => l.includes(m)))
  return endIndexRel < 0 ? afterStart : afterStart.slice(0, endIndexRel)
}

function mapNewsCategory(raw?: string) {
  const v = (raw || '').toLowerCase()
  if (v.includes('announcement')) return 'announcement'
  if (v.includes('research')) return 'research'
  if (v.includes('impact')) return 'impact-story'
  if (v.includes('partner') || v.includes('who') || v.includes('collab')) return 'partnership'
  if (v.includes('program') || v.includes('update')) return 'program-update'
  return 'announcement'
}

function parseNewsFromContent(lines: string[]) {
  const section = getSection(lines, 'News Articles (/news/[slug])', ['Academy Events (/academy/events/[slug])'])

  const items: Array<{
    title: string
    category: string
    publishedAt: string
    excerpt: string
    paragraphs: string[]
  }> = []

  let current: (typeof items)[number] | null = null

  const pushCurrent = () => {
    if (!current) return
    if (!current.title) return
    if (!current.excerpt && current.paragraphs.length) current.excerpt = truncate(current.paragraphs[0], 200)
    if (!current.excerpt) current.excerpt = truncate(current.title, 200)
    if (!current.publishedAt) current.publishedAt = new Date().toISOString()
    items.push(current)
    current = null
  }

  for (const rawLine of section) {
    const line = rawLine.trim()
    if (!line) continue

    const titleMatch = line.match(/^Title:\s*(.+)$/i)
    if (titleMatch) {
      pushCurrent()
      current = {
        title: titleMatch[1].trim(),
        category: 'announcement',
        publishedAt: '',
        excerpt: '',
        paragraphs: [],
      }
      continue
    }

    if (!current) continue

    const catMatch = line.match(/^Category:\s*(.+)$/i)
    if (catMatch) {
      current.category = mapNewsCategory(catMatch[1])
      continue
    }

    const dateMatch = line.match(/^Date:\s*(.+)$/i)
    if (dateMatch) {
      const iso = parseDateToISO(dateMatch[1])
      current.publishedAt = iso || current.publishedAt
      continue
    }

    const excerptMatch = line.match(/^Excerpt:\s*(.+)$/i)
    if (excerptMatch) {
      current.excerpt = truncate(excerptMatch[1], 200)
      continue
    }

    if (/^Full Content:?$/i.test(line)) continue
    if (/^Image:?$/i.test(line)) continue

    if (line.startsWith('?') || line.startsWith('-') || line.startsWith('�') || line.startsWith('•')) {
      const cleaned = stripBullet(line.replace(/^\?\s*/i, ''))
      if (cleaned) current.paragraphs.push(cleaned)
      continue
    }

    current.paragraphs.push(line)
  }

  pushCurrent()
  return items
}

function parseEventsFromContent(lines: string[]) {
  const academy = getSection(lines, 'Academy Events (/academy/events/[slug])', ['Consulting Events (/consulting/events/[slug])'])
  const consulting = getSection(lines, 'Consulting Events (/consulting/events/[slug])', ['Health Service Events (/health-services/events/[slug])'])
  const health = getSection(lines, 'Health Service Events (/health-services/events/[slug])', ['Gallery Images'])

  const parseEventBlock = (section: string[], category: string) => {
    const items: Array<{ title: string; date: string; location: string; excerpt: string; paragraphs: string[]; category: string }> = []
    let current: any = null

    const pushCurrent = () => {
      if (!current) return
      if (!current.title || !current.date) return
      if (!current.excerpt) current.excerpt = truncate(current.paragraphs?.[0] || current.title, 200)
      items.push(current)
      current = null
    }

    for (const rawLine of section) {
      const line = rawLine.trim()
      if (!line) continue

      const titleMatch = line.match(/^Title:\s*(.+)$/i)
      if (titleMatch) {
        pushCurrent()
        current = { title: titleMatch[1].trim(), date: '', location: '', excerpt: '', paragraphs: [], category }
        continue
      }

      if (!current) continue

      const dateMatch = line.match(/^Date:\s*(.+)$/i)
      if (dateMatch) {
        current.date = parseDateToISO(dateMatch[1]) || ''
        continue
      }

      const locMatch = line.match(/^Location:\s*(.+)$/i)
      if (locMatch) {
        current.location = locMatch[1].trim()
        continue
      }

      const excerptMatch = line.match(/^Excerpt:\s*(.+)$/i)
      if (excerptMatch) {
        current.excerpt = truncate(excerptMatch[1], 200)
        continue
      }

      if (/^Full Content:?$/i.test(line)) continue
      if (/^Agenda:?$/i.test(line)) continue
      if (/^Image:?$/i.test(line)) continue

      if (line.startsWith('?') || line.startsWith('-') || line.startsWith('�') || line.startsWith('•')) {
        const cleaned = stripBullet(line.replace(/^\?\s*/i, ''))
        if (cleaned) current.paragraphs.push(cleaned)
        continue
      }

      current.paragraphs.push(line)
    }

    pushCurrent()
    return items
  }

  return [
    ...parseEventBlock(academy, 'Academy'),
    ...parseEventBlock(consulting, 'Consulting'),
    ...parseEventBlock(health, 'Health Services'),
  ]
}

function parseTeamFromContent(lines: string[]) {
  const section = getSection(lines, 'Team Members (/team)', ['Gallery Images'])
  const items: Array<{ name: string; role: string; bio: string; email?: string; linkedin?: string }> = []

  let currentName = ''
  let role = ''
  let bio = ''
  let email = ''
  let linkedin = ''

  const flush = () => {
    if (!currentName || !role) return
    items.push({ name: currentName, role, bio: bio.trim(), email: email || undefined, linkedin: linkedin || undefined })
    currentName = ''
    role = ''
    bio = ''
    email = ''
    linkedin = ''
  }

  for (const rawLine of section) {
    const line = rawLine.trim()
    if (!line) continue

    if (/^Name:\s*/i.test(line)) {
      flush()
      currentName = line.replace(/^Name:\s*/i, '').trim()
      continue
    }
    if (/^Role:\s*/i.test(line)) {
      role = line.replace(/^Role:\s*/i, '').trim()
      continue
    }
    if (/^Bio:\s*/i.test(line)) {
      bio = line.replace(/^Bio:\s*/i, '').trim()
      continue
    }
    if (/^Email:\s*/i.test(line)) {
      email = line.replace(/^Email:\s*/i, '').trim()
      continue
    }
    if (/^LinkedIn:\s*/i.test(line)) {
      linkedin = line.replace(/^LinkedIn:\s*/i, '').trim()
      continue
    }

    if (currentName && !/^Image:/i.test(line)) {
      bio += (bio ? '\n' : '') + line
    }
  }

  flush()
  return items
}

function parseGalleryFromContent(lines: string[]) {
  const section = getSection(lines, 'Gallery Images', [''])
  const items: Array<{ title: string; description: string; category: string }> = []

  let currentCategory = 'Events'

  for (const rawLine of section) {
    const line = rawLine.trim()
    if (!line) continue

    if (!line.startsWith('?') && !line.startsWith('-') && line.toLowerCase().includes('gallery images')) continue

    const heading = line.replace(/:$/, '')
    if (!line.startsWith('?') && !line.startsWith('-') && !line.startsWith('�') && heading.length < 40) {
      const lower = heading.toLowerCase()
      if (lower.includes('events')) currentCategory = 'Events'
      else if (lower.includes('academy')) currentCategory = 'Academy'
      else if (lower.includes('consult')) currentCategory = 'Consulting'
      else if (lower.includes('health')) currentCategory = 'Health'
      else if (lower.includes('community')) currentCategory = 'Community'
      else currentCategory = 'Events'
      continue
    }

    const title = stripBullet(line.replace(/^\?\s*/i, ''))
    if (!title) continue

    items.push({
      title,
      description: title,
      category: currentCategory,
    })
  }

  return items
}

function parseProgramsFromContent(lines: string[]) {
  const section = getSection(lines, 'Program Listings', ['Resources & Publications (/resources)'])
  const programs: Array<{
    title: string
    category: 'education' | 'health' | 'consulting'
    description: string
    paragraphs: string[]
    objectives: string[]
  }> = []

  type Mode = 'none' | 'academy' | 'health' | 'consult'
  let mode: Mode = 'none'
  let current: (typeof programs)[number] | null = null

  const pushCurrent = () => {
    if (!current) return
    programs.push(current)
    current = null
  }

  for (const rawLine of section) {
    const raw = rawLine.trim()
    if (!raw) continue

    if (raw.toLowerCase() === 'medwhole academy programs') {
      pushCurrent()
      mode = 'academy'
      continue
    }
    if (raw.toLowerCase() === 'health programs') {
      pushCurrent()
      mode = 'health'
      continue
    }
    if (raw.toLowerCase().startsWith('consult programs')) {
      pushCurrent()
      mode = 'consult'
      continue
    }

    if (mode === 'academy' || mode === 'health') {
      const nameMatch = raw.match(/^\?\s*(.+)$/)
      if (nameMatch) {
        pushCurrent()
        const title = nameMatch[1].trim()
        current = {
          title,
          category: mode === 'academy' ? 'education' : 'health',
          description: '',
          paragraphs: [],
          objectives: [],
        }
        continue
      }

      if (!current) continue

      const descMatch = raw.match(/^(?:o)?Description:\s*(.+)$/i)
      if (descMatch) {
        current.description = descMatch[1].trim()
        continue
      }
      const detailsMatch = raw.match(/^(?:o)?Details:\s*(.+)$/i)
      if (detailsMatch) {
        current.paragraphs.push(detailsMatch[1].trim())
        continue
      }
      const componentsMatch = raw.match(/^(?:o)?Components?:\s*(.+)$/i)
      if (componentsMatch) {
        current.paragraphs.push(`Components: ${componentsMatch[1].trim()}`)
        continue
      }
      const outcomeMatch = raw.match(/^(?:o)?Outcome:?\s*(.+)$/i)
      if (outcomeMatch) {
        current.objectives.push(outcomeMatch[1].trim())
        continue
      }
      const outcomesMatch = raw.match(/^Outcomes?:\s*(.+)$/i)
      if (outcomesMatch) {
        current.objectives.push(outcomesMatch[1].trim())
        continue
      }

      if (raw.startsWith('-') || raw.startsWith('�') || raw.startsWith('•')) {
        const cleaned = stripBullet(raw)
        if (cleaned) current.paragraphs.push(cleaned)
      }

      continue
    }

    if (mode === 'consult') {
      const nameMatch = raw.match(/^\d+\.\s*([^:]+):?$/)
      if (nameMatch) {
        pushCurrent()
        const title = nameMatch[1].trim()
        current = { title, category: 'consulting', description: '', paragraphs: [], objectives: [] }
        continue
      }

      if (!current) continue

      const descMatch = raw.match(/^Description:\s*(.+)$/i)
      if (descMatch) {
        current.description = descMatch[1].trim()
        continue
      }
      const detailsMatch = raw.match(/^Details:\s*(.+)$/i)
      if (detailsMatch) {
        current.paragraphs.push(detailsMatch[1].trim())
        continue
      }
      const outcomesMatch = raw.match(/^Outcomes?:\s*(.+)$/i)
      if (outcomesMatch) {
        current.objectives.push(outcomesMatch[1].trim())
        continue
      }
    }
  }

  pushCurrent()
  return programs.filter((p) => p.title && p.description)
}

function parseProgramDetailsFromContent(lines: string[]) {
  const section = getSection(lines, 'Program Details (/programs/[slug])', ['Academy Events (/academy/events/[slug])'])
  const detailsByTitle = new Map<string, { paragraphs: string[]; objectives: string[] }>()

  let currentTitle: string | null = null
  let paragraphs: string[] = []
  let objectives: string[] = []
  let inOutcomes = false

  const flush = () => {
    if (!currentTitle) return
    detailsByTitle.set(currentTitle, { paragraphs: [...paragraphs], objectives: [...objectives] })
    currentTitle = null
    paragraphs = []
    objectives = []
    inOutcomes = false
  }

  for (const rawLine of section) {
    const line = rawLine.trim()
    if (!line) continue

    if (/^Full Description:/i.test(line)) {
      const t = line.replace(/^Full Description:\s*/i, '').trim()
      if (t) paragraphs.push(t)
      continue
    }
    if (/^Modules:/i.test(line)) {
      inOutcomes = false
      continue
    }
    if (/^Outcomes:/i.test(line)) {
      inOutcomes = true
      continue
    }
    if (/^Instructors:/i.test(line) || /^Testimonials:/i.test(line)) {
      inOutcomes = false
      continue
    }

    // likely a title line
    if (!line.startsWith('?') && !line.startsWith('-') && !line.startsWith('�') && line.length > 3 && !line.endsWith(':')) {
      const ignore = ['Full Description', 'Modules', 'Outcomes', 'Instructors', 'Testimonials']
      if (!ignore.some((h) => h.toLowerCase() === line.toLowerCase())) {
        flush()
        currentTitle = line
      }
      continue
    }

    if (!currentTitle) continue

    if (line.startsWith('?') || line.startsWith('-') || line.startsWith('�') || line.startsWith('•')) {
      const cleaned = stripBullet(line.replace(/^\?\s*/i, ''))
      if (!cleaned) continue
      if (inOutcomes) objectives.push(cleaned)
      else paragraphs.push(cleaned)
    }
  }

  flush()
  return detailsByTitle
}

const uploadedAssetRefByPath = new Map<string, string>()

function ensureExistingImagePath(preferredAbsPath: string) {
  if (fs.existsSync(preferredAbsPath)) return preferredAbsPath
  const fallback = path.resolve(__dirname, '../public/placeholder-team-collaboration.jpg')
  if (fs.existsSync(fallback)) return fallback
  throw new Error(`No image found at ${preferredAbsPath} and fallback placeholder missing`) 
}

async function uploadImageFromPublic(absPath: string) {
  const fullPath = ensureExistingImagePath(absPath)
  if (uploadedAssetRefByPath.has(fullPath)) return uploadedAssetRefByPath.get(fullPath) as string

  const stream = fs.createReadStream(fullPath)
  const filename = path.basename(fullPath)
  const asset = await client.assets.upload('image', stream as any, { filename })
  uploadedAssetRefByPath.set(fullPath, asset._id)
  return asset._id
}

function pickLocalImagePath(kind: 'news' | 'events' | 'team' | 'gallery', hint?: string) {
  const root = path.resolve(__dirname, '../public')
  const lower = (hint || '').toLowerCase()

  if (kind === 'team') return path.join(root, 'placeholder-user.jpg')

  if (kind === 'news') {
    if (lower.includes('research')) return path.join(root, 'placeholder-field-research.jpg')
    if (lower.includes('data')) return path.join(root, 'placeholder-data-analysis.jpg')
    if (lower.includes('train') || lower.includes('academy')) return path.join(root, 'placeholder-training-classroom.jpg')
    return path.join(root, 'placeholder-graduation.jpg')
  }

  if (kind === 'events') {
    if (lower.includes('consult')) return path.join(root, 'placeholder-consulting-meeting.jpg')
    if (lower.includes('health')) return path.join(root, 'african-healthcare-workers-providing-medical-care-.jpg')
    return path.join(root, 'placeholder-training-classroom.jpg')
  }

  // gallery
  if (lower.includes('community')) return path.join(root, 'african-community-health-education-session.jpg')
  return path.join(root, 'placeholder-team-collaboration.jpg')
}

function pickProgramImagePath(category: 'education' | 'health' | 'consulting', hint?: string) {
  const root = path.resolve(__dirname, '../public')
  const lower = (hint || '').toLowerCase()
  if (category === 'health') {
    if (lower.includes('mobile') || lower.includes('outreach')) return path.join(root, 'mobile-health-clinic-africa-rural-community.jpg')
    return path.join(root, 'african-healthcare-workers-providing-medical-care-.jpg')
  }
  if (category === 'consulting') {
    return path.join(root, 'african-health-professionals-in-strategic-meeting-.jpg')
  }
  return path.join(root, 'african-children-learning-education-classroom.jpg')
}

async function createOrReplaceDocument(doc: any) {
  const result = await client.createOrReplace(doc)
  return result
}

async function deleteAllByTypes(types: string[]) {
  for (const type of types) {
    const query = `*[_type == "${type}"]` 
    await client.delete({ query })
  }
}

async function seedSanity() {
  const args = process.argv.slice(2)
  const reset = args.includes('--reset') || boolFromEnv(process.env.SANITY_SEED_RESET)
  const yes = args.includes('--yes') || boolFromEnv(process.env.SANITY_SEED_YES)

  const contentPath = path.resolve(__dirname, '../1-MedWHOLE Alliance Website Content.txt')
  if (!fs.existsSync(contentPath)) throw new Error(`Content file not found: ${contentPath}`)

  if (reset && !yes) {
    throw new Error('Refusing to reset without explicit confirmation. Re-run with --reset --yes (or SANITY_SEED_RESET=1 and SANITY_SEED_YES=1).')
  }

  if (reset) {
    console.log('⚠️  Reset enabled: deleting existing docs (news, event, program, team, gallery)...')
    await deleteAllByTypes(['news', 'event', 'program', 'team', 'gallery'])
  }

  const text = fs.readFileSync(contentPath, 'utf8')
  const lines = text.split(/\r?\n/)

  const newsItems = parseNewsFromContent(lines)
  const eventItems = parseEventsFromContent(lines)
  const teamItems = parseTeamFromContent(lines)
  const galleryItems = parseGalleryFromContent(lines)
  const programItems = parseProgramsFromContent(lines)
  const programDetails = parseProgramDetailsFromContent(lines)

  console.log(`\n📰 Parsed news: ${newsItems.length}`)
  console.log(`📅 Parsed events: ${eventItems.length}`)
  console.log(`👥 Parsed team: ${teamItems.length}`)
  console.log(`🖼️  Parsed gallery: ${galleryItems.length}`)
  console.log(`🎓 Parsed programs: ${programItems.length}`)

  console.log('\n📰 Seeding News...')
  for (let i = 0; i < newsItems.length; i++) {
    const item = newsItems[i]
    const slug = slugify(item.title)
    const assetId = await uploadImageFromPublic(pickLocalImagePath('news', `${item.category} ${item.title}`))

    await createOrReplaceDocument({
      _id: `news.${slug}`,
      _type: 'news',
      title: item.title,
      slug: { _type: 'slug', current: slug },
      excerpt: truncate(item.excerpt || item.paragraphs[0] || item.title, 200),
      publishedAt: item.publishedAt || new Date().toISOString(),
      category: item.category,
      featuredImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
        alt: item.title,
      },
      content: toPortableText(item.paragraphs),
      featured: i < 3,
      isActive: true,
    })
  }

  console.log('\n📅 Seeding Events...')
  for (let i = 0; i < eventItems.length; i++) {
    const item = eventItems[i]
    const slug = slugify(item.title)
    const assetId = await uploadImageFromPublic(pickLocalImagePath('events', `${item.category} ${item.title}`))

    await createOrReplaceDocument({
      _id: `event.${slug}`,
      _type: 'event',
      title: item.title,
      slug: { _type: 'slug', current: slug },
      date: item.date,
      location: item.location,
      excerpt: truncate(item.excerpt || item.paragraphs[0] || item.title, 200),
      category: item.category,
      content: [
        ...toPortableText(item.paragraphs),
        {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
          alt: item.title,
        },
      ],
      featured: i < 3,
      isActive: true,
    })
  }

  console.log('\n👥 Seeding Team...')
  for (let i = 0; i < teamItems.length; i++) {
    const item = teamItems[i]
    const slug = slugify(item.name)
    const assetId = await uploadImageFromPublic(pickLocalImagePath('team', item.name))

    await createOrReplaceDocument({
      _id: `team.${slug}`,
      _type: 'team',
      name: item.name,
      role: item.role,
      category: 'leadership',
      bio: item.bio,
      email: item.email,
      linkedin: item.linkedin,
      photo: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
        alt: item.name,
      },
      order: i + 1,
      isActive: true,
    })
  }

  console.log('\n🎓 Seeding Programs...')
  for (let i = 0; i < programItems.length; i++) {
    const item = programItems[i]
    const slug = slugify(item.title)
    const extra = programDetails.get(item.title)
    const mergedParagraphs = [...item.paragraphs]
    const mergedObjectives = [...item.objectives]
    if (extra) {
      mergedParagraphs.push(...extra.paragraphs)
      mergedObjectives.push(...extra.objectives)
    }

    const assetId = await uploadImageFromPublic(pickProgramImagePath(item.category, item.title))

    await createOrReplaceDocument({
      _id: `program.${slug}`,
      _type: 'program',
      title: item.title,
      slug: { _type: 'slug', current: slug },
      description: item.description,
      content: toPortableText(mergedParagraphs),
      featuredImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
        alt: item.title,
      },
      category: item.category,
      objectives: mergedObjectives.slice(0, 10),
      featured: i < 6,
      isActive: true,
    })
  }

  console.log('\n🖼️  Seeding Gallery...')
  for (let i = 0; i < galleryItems.length; i++) {
    const item = galleryItems[i]
    const slug = slugify(item.title)
    const assetId = await uploadImageFromPublic(pickLocalImagePath('gallery', `${item.category} ${item.title}`))

    await createOrReplaceDocument({
      _id: `gallery.${slug}`,
      _type: 'gallery',
      title: item.title,
      description: item.description,
      category: item.category,
      order: i + 1,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
        alt: item.title,
      },
      isActive: true,
    })
  }

  console.log('\n✅ Seeding completed successfully!')
  console.log('   Studio: /studio')
}

seedSanity().catch((error) => {
  console.error('\n❌ Seeding failed:', error)
  process.exit(1)
})
