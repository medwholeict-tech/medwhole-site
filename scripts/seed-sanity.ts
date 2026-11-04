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
            return line
              .replace(/^[\uFFFD�•\-*]+\s*/g, '')
              .replace(/^(?:D|S|Further|Example|Two|No)\s*-\s*/i, '')
              .trim()
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
            const m2 = text.match(/^([A-Za-z]+)\s+(\d{1,2})\s*-\s*\d{1,2},\s*(\d{4})$/)
            if (m2) {
              const mi = monthIndex(m2[1])
              if (mi >= 0) return new Date(Date.UTC(Number(m2[3]), mi, Number(m2[2]), 0, 0, 0)).toISOString()
            }

            // e.g. "September 2025" (use first day)
            const m3 = text.match(/^([A-Za-z]+)\s+(\d{4})$/)
            if (m3) {
              const mi = monthIndex(m3[1])
              if (mi >= 0) return new Date(Date.UTC(Number(m3[2]), mi, 1, 0, 0, 0)).toISOString()
            }

            const parsed = new Date(text)
            if (!Number.isNaN(parsed.getTime())) return parsed.toISOString()

            return null
          }

          function getSection(lines: string[], startMarker: string, endMarkers: string[]) {
            const startIdx = lines.findIndex((l) => l.includes(startMarker))
            if (startIdx === -1) return []
            const afterStart = lines.slice(startIdx + 1)
            const endIdx = afterStart.findIndex((l) => endMarkers.some((m) => l.includes(m)))
            return endIdx === -1 ? afterStart : afterStart.slice(0, endIdx)
          }

          function parseNewsFromContent(lines: string[]) {
            const section = getSection(lines, 'News Articles (/news/[slug])', ['Program Details (/programs/[slug])'])
            const articles: Array<{
              title: string
              excerpt: string
              publishedAt: string
              categoryRaw?: string
              author?: string
              paragraphs: string[]
            }> = []

            const peekNextNonEmpty = (idx: number) => {
              for (let i = idx; i < section.length; i++) {
                const t = section[i].trim()
                if (t) return t
              }
              return ''
            }

            let current: (typeof articles)[number] | null = null
            let inContent = false

            for (let i = 0; i < section.length; i++) {
              const raw = section[i]
              const line = raw.trim()
              if (!line) continue

              if (!line.startsWith('?') && !line.startsWith('�') && !line.startsWith('-')) {
                const next = peekNextNonEmpty(i + 1)
                if (next.startsWith('?Excerpt:')) {
                  if (current) articles.push(current)
                  current = {
                    title: line,
                    excerpt: '',
                    publishedAt: new Date().toISOString(),
                    paragraphs: [],
                  }
                  inContent = false
                  continue
                }
              }

              if (!current) continue

              if (line.startsWith('?Excerpt:')) {
                current.excerpt = line.replace(/^\?Excerpt:\s*/i, '').trim()
                continue
              }
              if (line.startsWith('?Date:')) {
                const dateText = line.replace(/^\?Date:\s*/i, '').trim()
                const iso = parseDateToISO(dateText)
                if (iso) current.publishedAt = iso
                continue
              }
              if (line.startsWith('?Category:')) {
                current.categoryRaw = line.replace(/^\?Category:\s*/i, '').trim()
                continue
              }
              if (line.startsWith('?Author:')) {
                current.author = line.replace(/^\?Author:\s*/i, '').trim()
                continue
              }
              if (line.startsWith('?Content:')) {
                inContent = true
                continue
              }
              if (line.startsWith('?Tags:')) {
                inContent = false
                continue
              }

              if (inContent) {
                const cleaned = stripBullet(line)
                if (cleaned) current.paragraphs.push(cleaned)
              }
            }

            if (current) articles.push(current)
            return articles
          }

          function parseEventsFromContent(lines: string[]) {
            const sections = [
              { start: 'Academy Events (/academy/events/[slug])', end: ['Consulting Events (/consulting/events/[slug])'], arm: 'Academy' },
              { start: 'Consulting Events (/consulting/events/[slug])', end: ['Health Services Events (/health-services/events/[slug])'], arm: 'Consulting' },
              { start: 'Health Services Events (/health-services/events/[slug])', end: ['News Articles (/news/[slug])'], arm: 'Health' },
            ] as const

            const events: Array<{
              title: string
              armCategory: string
              dateISO: string
              location?: string
              description?: string
              paragraphs: string[]
            }> = []

            for (const sec of sections) {
              const section = getSection(lines, sec.start, sec.end)
              const peekNextNonEmpty = (idx: number) => {
                for (let i = idx; i < section.length; i++) {
                  const t = section[i].trim()
                  if (t) return t
                }
                return ''
              }

              let current: (typeof events)[number] | null = null
              let inRich = false

              for (let i = 0; i < section.length; i++) {
                const line = section[i].trim()
                if (!line) continue

                if (!line.startsWith('?') && !line.startsWith('�') && !line.startsWith('-')) {
                  const next = peekNextNonEmpty(i + 1)
                  if (next.startsWith('?Category:') || next.startsWith('?Date:')) {
                    if (current) events.push(current)
                    current = {
                      title: line,
                      armCategory: sec.arm,
                      dateISO: new Date().toISOString(),
                      paragraphs: [],
                    }
                    inRich = false
                    continue
                  }
                }

                if (!current) continue

                if (line.startsWith('?Date:')) {
                  const dateText = line.replace(/^\?Date:\s*/i, '').trim()
                  const iso = parseDateToISO(dateText)
                  if (iso) current.dateISO = iso
                  continue
                }
                if (line.startsWith('?Location:')) {
                  current.location = line.replace(/^\?Location:\s*/i, '').trim()
                  continue
                }
                if (line.startsWith('?Description:')) {
                  current.description = line.replace(/^\?Description:\s*/i, '').trim()
                  continue
                }

                // Treat Objectives/Agenda/Speakers etc as content paragraphs
                if (/^(Objectives:|Agenda:|Speakers:|Partners:|Phases:|Deliverables:|Team:)/i.test(line)) {
                  current.paragraphs.push(line.replace(/:$/, '').trim())
                  inRich = true
                  continue
                }

                if (inRich && (line.startsWith('�') || line.startsWith('-'))) {
                  const cleaned = stripBullet(line)
                  if (cleaned) current.paragraphs.push(cleaned)
                }
              }

              if (current) events.push(current)
            }

            return events
          }

          function parseTeamFromContent(lines: string[]) {
            const section = getSection(lines, 'Our Team Section', ['Our Partners Section'])
            const members: Array<{ name: string; role: string }> = []
            for (const raw of section) {
              const line = raw.trim()
              const m = line.match(/^�\s*-\s*(.+?)\s*-\s*(.+)$/)
              if (m) {
                members.push({ name: m[1].trim(), role: m[2].trim() })
              }
            }
            return members
          }

          function parseGalleryFromContent(lines: string[]) {
            const section = getSection(lines, 'Gallery Images', ['Privacy Policy (/privacy)'])
            const items: Array<{ title: string; description: string; category: string }> = []
            let currentCategory: string | null = null

            for (let i = 0; i < section.length; i++) {
              const line = section[i].trim()
              if (!line) continue

              if (/^(Academy|Health|Consult|Events & Team|Consulting)$/i.test(line)) {
                const normalized = line.toLowerCase()
                if (normalized.startsWith('consult')) currentCategory = 'Consulting'
                else if (normalized.startsWith('events')) currentCategory = 'Events'
                else currentCategory = line[0].toUpperCase() + line.slice(1).toLowerCase()
                continue
              }

              const titleMatch = line.match(/^Title:\s*(.+)$/i)
              if (titleMatch) {
                const title = titleMatch[1].trim()
                let description = ''
                const next = (section[i + 1] || '').trim()
                const descMatch = next.match(/^\?Description:\s*(.+)$/i)
                if (descMatch) {
                  description = descMatch[1].trim()
                  i += 1
                }

                const category = currentCategory || 'Community'
                items.push({ title, description, category })
              }
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

            for (let i = 0; i < section.length; i++) {
              const raw = section[i].trim()
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

              if (mode === 'academy') {
                const nameMatch = raw.match(/^\?\s+(.+)$/)
                if (nameMatch) {
                  pushCurrent()
                  const title = nameMatch[1].trim()
                  current = {
                    title,
                    category: 'education',
                    description: '',
                    paragraphs: [],
                    objectives: [],
                  }
                  continue
                }

                if (!current) continue

                const descMatch = raw.match(/^o?Description:\s*(.+)$/i)
                if (descMatch) {
                  current.description = descMatch[1].trim()
                  continue
                }
                const detailsMatch = raw.match(/^o?Details:\s*(.+)$/i)
                if (detailsMatch) {
                  current.paragraphs.push(detailsMatch[1].trim())
                  continue
                }
                const componentsMatch = raw.match(/^o?Components:\s*(.+)$/i)
                if (componentsMatch) {
                  current.paragraphs.push(`Components: ${componentsMatch[1].trim()}`)
                  continue
                }
                const outcomeMatch = raw.match(/^o?Outcome:?\s*(.+)$/i)
                if (outcomeMatch) {
                  current.objectives.push(outcomeMatch[1].trim())
                  continue
                }

                if (raw.startsWith('-') || raw.startsWith('�')) {
                  const cleaned = stripBullet(raw)
                  if (cleaned) current.paragraphs.push(cleaned)
                }
              }

              if (mode === 'health') {
                const nameMatch = raw.match(/^\?\s*(.+)$/)
                if (nameMatch) {
                  pushCurrent()
                  const title = nameMatch[1].trim()
                  current = {
                    title,
                    category: 'health',
                    description: '',
                    paragraphs: [],
                    objectives: [],
                  }
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
                const componentsMatch = raw.match(/^Components?:\s*(.+)$/i)
                if (componentsMatch) {
                  current.paragraphs.push(`Components: ${componentsMatch[1].trim()}`)
                  continue
                }
                const outcomeMatch = raw.match(/^Outcomes?:\s*(.+)$/i)
                if (outcomeMatch) {
                  current.objectives.push(outcomeMatch[1].trim())
                  continue
                }
              }

              if (mode === 'consult') {
                const nameMatch = raw.match(/^\d+\.\s*([^:]+):?$/)
                if (nameMatch) {
                  pushCurrent()
                  const title = nameMatch[1].trim()
                  current = {
                    title,
                    category: 'consulting',
                    description: '',
                    paragraphs: [],
                    objectives: [],
                  }
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
                const componentsMatch = raw.match(/^Components?:\s*(.+)$/i)
                if (componentsMatch) {
                  current.paragraphs.push(`Components: ${componentsMatch[1].trim()}`)
                  continue
                }
                const outcomeMatch = raw.match(/^Outcomes?:\s*(.+)$/i)
                if (outcomeMatch) {
                  current.objectives.push(outcomeMatch[1].trim())
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

              if (!line.startsWith('?') && !line.startsWith('�') && !line.startsWith('-') && !line.endsWith(':')) {
                // Likely a program title line
                if (line === 'Full Description') continue
                if (line === 'Modules' || line === 'Outcomes' || line === 'Instructors' || line === 'Testimonials') continue
                if (line.toLowerCase().includes('program details')) continue
                if (line.toLowerCase().includes('full description')) continue
                if (line.toLowerCase().includes('modules')) continue
                if (line.toLowerCase().includes('outcomes')) continue

                // If it looks like a standalone title, start a new block
                if (line.length > 3 && !line.includes('http')) {
                  flush()
                  currentTitle = line
                  continue
                }
              }

              if (!currentTitle) continue

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

              if (line.startsWith('?')) {
                const cleaned = line.replace(/^\?\s*/i, '').trim()
                if (cleaned) {
                  if (inOutcomes) objectives.push(cleaned)
                  else paragraphs.push(cleaned)
                }
                continue
              }
            }

            flush()
            return detailsByTitle
          }

          function mapNewsCategory(raw?: string) {
            const value = (raw || '').toLowerCase().trim()
            if (value.includes('research')) return 'research'
            if (value.includes('partnership') || value.includes('who')) return 'partnership'
            if (value.includes('impact')) return 'impact-story'
            if (value.includes('program') || value.includes('academy') || value.includes('events') || value.includes('launch')) return 'program-update'
            if (value.includes('health')) return 'impact-story'
            return 'announcement'
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

          function pickLocalImagePath(kind: 'news' | 'event' | 'team' | 'gallery', hint?: string) {
            const root = path.resolve(__dirname, '../public')
            const lower = (hint || '').toLowerCase()

            if (kind === 'team') return path.join(root, 'placeholder-user.jpg')
            if (kind === 'gallery') {
              if (lower.includes('scholar') || lower.includes('school') || lower.includes('class')) return path.join(root, 'placeholder-training-classroom.jpg')
              if (lower.includes('team') || lower.includes('collaboration')) return path.join(root, 'placeholder-team-collaboration.jpg')
              if (lower.includes('consult') || lower.includes('meeting')) return path.join(root, 'placeholder-consulting-meeting.jpg')
              if (lower.includes('who') || lower.includes('partnership')) return path.join(root, 'partnership-signing-ceremony-african-health-offici.jpg')
              if (lower.includes('mobile') || lower.includes('clinic')) return path.join(root, 'mobile-health-clinic-africa-rural-community.jpg')
              return path.join(root, 'placeholder.jpg')
            }
            if (kind === 'news') {
              if (lower.includes('research')) return path.join(root, 'placeholder-data-analysis.jpg')
              if (lower.includes('leadership') || lower.includes('training') || lower.includes('workshop')) return path.join(root, 'workshop-training-session-african-professionals.jpg')
              if (lower.includes('partnership') || lower.includes('who')) return path.join(root, 'partnership-signing-ceremony-african-health-offici.jpg')
              if (lower.includes('mobile') || lower.includes('clinic')) return path.join(root, 'mobile-health-clinic-africa-rural-community.jpg')
              return path.join(root, 'placeholder.jpg')
            }
            if (kind === 'event') {
              if (lower.includes('summit') || lower.includes('conference')) return path.join(root, 'african-health-conference-presentation.jpg')
              if (lower.includes('masterclass') || lower.includes('training')) return path.join(root, 'african-students-in-epidemiology-training-classroo.jpg')
              if (lower.includes('campaign') || lower.includes('outreach')) return path.join(root, 'african-health-workers-vaccination-campaign.jpg')
              return path.join(root, 'placeholder.jpg')
            }
            return path.join(root, 'placeholder.jpg')
          }

          const uploadedAssetRefByPath = new Map<string, string>()

          async function uploadImageFromPublic(localPath: string) {
            const normalizedPath = path.resolve(localPath)
            const cached = uploadedAssetRefByPath.get(normalizedPath)
            if (cached) return cached

            if (!fs.existsSync(normalizedPath)) {
              throw new Error(`Missing local image file: ${normalizedPath}`)
            }

            const stream = fs.createReadStream(normalizedPath)
            const filename = path.basename(normalizedPath)
            const asset = await client.assets.upload('image', stream as any, { filename })
            uploadedAssetRefByPath.set(normalizedPath, asset._id)
            return asset._id
          }

          async function createOrReplaceDocument(doc: any) {
            const result = await client.createOrReplace(doc)
            console.log(`✅ Upserted ${doc._type}: ${doc.title || doc.name}`)
            return result
          }

          async function deleteAllByTypes(types: string[]) {
            for (const type of types) {
              console.log(`🧹 Deleting documents of type: ${type}`)
              await client.delete({ query: `*[_type == "${type}"]` })
            }
          }

          async function seedSanity() {
            const contentPath = path.resolve(__dirname, '../1-MedWHOLE Alliance Website Content.txt')
            const rawContent = fs.readFileSync(contentPath, 'utf8')
            const normalized = rawContent.replace(/\r\n/g, '\n')
            const lines = normalized.split('\n')

            const shouldReset = process.argv.includes('--reset') || process.env.SANITY_SEED_RESET === 'true' || process.env.SANITY_SEED_RESET === '1'
            const forceYes = process.argv.includes('--yes') || process.env.SANITY_SEED_YES === 'true' || process.env.SANITY_SEED_YES === '1'

            console.log('🌱 Starting Sanity CMS seeding...')
            console.log(`   Dataset: ${dataset}`)
            console.log(`   Project: ${projectId}`)
            console.log(`   Reset mode: ${shouldReset ? 'ON' : 'OFF'}`)

            if (shouldReset && !forceYes) {
              console.error('\n❌ Refusing to wipe Sanity without explicit confirmation.')
              console.error('   Re-run with: `pnpm sanity:seed -- --reset --yes`')
              console.error('   Or set env: `SANITY_SEED_RESET=1 SANITY_SEED_YES=1`')
              process.exit(1)
            }

            if (shouldReset) {
              await deleteAllByTypes(['news', 'event', 'program', 'team', 'gallery'])
            }

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

            // Seed News
            console.log('\n📰 Seeding News...')
            for (let i = 0; i < newsItems.length; i++) {
              const item = newsItems[i]
              const slug = slugify(item.title)
              const category = mapNewsCategory(item.categoryRaw)
              const imagePath = pickLocalImagePath('news', `${category} ${item.title}`)
              const assetId = await uploadImageFromPublic(imagePath)

              await createOrReplaceDocument({
                _id: `news.${slug}`,
                _type: 'news',
                title: item.title,
                slug: { _type: 'slug', current: slug },
                excerpt: truncate(item.excerpt || item.title, 200),
                content: toPortableText(item.paragraphs),
                featuredImage: {
                  _type: 'image',
                  asset: { _type: 'reference', _ref: assetId },
                  alt: item.title,
                },
                category,
                author: item.author,
                publishedAt: item.publishedAt,
                featured: i === 0,
                isActive: true,
              })
            }

            // Seed Events
            console.log('\n📅 Seeding Events...')
            for (let i = 0; i < eventItems.length; i++) {
              const item = eventItems[i]
              const slug = slugify(item.title)
              const imagePath = pickLocalImagePath('event', `${item.armCategory} ${item.title}`)
              const assetId = await uploadImageFromPublic(imagePath)
              const description = item.description || item.paragraphs[0] || ''

              await createOrReplaceDocument({
                _id: `event.${slug}`,
                _type: 'event',
                title: item.title,
                slug: { _type: 'slug', current: slug },
                description: description,
                content: [
                  ...toPortableText(item.paragraphs),
                  {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: assetId },
                    alt: item.title,
                  },
                ],
                category: item.armCategory,
                date: item.dateISO,
                location: item.location,
                featured: i < 3,
                isActive: true,
              })
            }

            // Seed Team
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
                bio: `${item.name} serves as ${item.role} at MedWHOLE Alliance.`,
                photo: {
                  _type: 'image',
                  asset: { _type: 'reference', _ref: assetId },
                  alt: item.name,
                },
                category: 'leadership',
                order: i + 1,
                isActive: true,
              })
            }

            // Seed Programs
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

            // Seed Gallery
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
