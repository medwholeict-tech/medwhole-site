import "server-only"
import { cache } from "react"
import { getAllEvents, getNews, publishedDocuments } from "@/lib/cms/queries"
import { approvedPages, communityLocation, eventRecords, eventStatus, programmeCommunities, programmePaths, programmePillar } from "@/lib/approved-copy"
import type { DirectoryItem } from "@/components/copy-directory"
import type { CommunityStoryItem } from "@/components/community-dossier"
import type { SourcePage } from "@/lib/approved-copy"
import { defaultCommunityStories } from "@/lib/community-stories"
import { mediaUrl } from "@/lib/cms/media"

export const programmeDirectory: DirectoryItem[] = programmePaths.map((path) => ({
  path, title: approvedPages[path].sections[0].blocks.find((b) => b.kind === "heading")!.text!,
  summary: approvedPages[path].sections[0].blocks.find((b) => b.kind === "subheading")?.text,
  pillar: programmePillar(path), communities: programmeCommunities(path),
  status: path.endsWith("/health-systems") ? "In development" : "Active",
}))
export const approvedEventDirectory: DirectoryItem[] = eventRecords.map((event) => ({
  path: `/events/${event.slug}`, title: approvedPages[`/events/${event.slug}`].sections[0].blocks.find((b) => b.kind === "heading")!.text!,
  summary: approvedPages[`/events/${event.slug}`].sections[1].blocks.find((b) => b.kind === "paragraph")?.text,
  pillar: event.pillar, communities: [event.community], programme: programmeDirectory.find((p) => p.path === event.programme)?.title,
  date: event.start, end: event.end, time: event.time, venue: communityLocation(event.community), status: eventStatus(event), isFree: true,
}))

export type NewsRecord = { _id: string; title: string; slug: { current: string }; excerpt: string; publishedAt: string; category: string; relatedPath?: string }
export const getSourceNews = cache(async (): Promise<NewsRecord[]> => {
  return (await getNews(undefined, 100)) as NewsRecord[]
})

export const getSourceEvents = cache(async (): Promise<DirectoryItem[]> => {
  const extra = await getAllEvents().catch(() => [])
  const knownSlugs = new Set([...eventRecords.map(event => event.slug), "kunyami-health-outreach-2026", "community-participation-programme-compart-2026"])
  const items = extra.filter(event => !knownSlugs.has(event.slug?.current)).map(event => ({
    path: `/events/${event.slug.current}`, title: event.title, summary: event.excerpt,
    pillar: event.programmePath && programmePaths.includes(event.programmePath) ? programmePillar(event.programmePath) : event.category,
    communities: event.community ? [event.community] : [],
    programme: programmeDirectory.find(programme => programme.path === event.programmePath)?.title,
    date: event.date.slice(0, 10), end: (event.endDate || event.date).slice(0, 10),
    time: event.showTime === false ? undefined : new Intl.DateTimeFormat("en-NG", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" }).format(new Date(event.date)),
    venue: event.venue || event.location, isFree: event.isFree === true,
    status: eventStatus({ start: event.date.slice(0, 10), end: (event.endDate || event.date).slice(0, 10) }),
  }))
  return [...approvedEventDirectory, ...items].sort((a, b) => (b.date || "").localeCompare(a.date || ""))
})

export type DownloadRecord = { title: string; url: string; publishedDate?: string }
export const getSourceDownloads = cache(async (): Promise<DownloadRecord[]> => {
  const resources = await publishedDocuments("resources").catch(() => [])
  return resources.map(record => ({ title: record.title, publishedDate: record.publishedAt,
    url: mediaUrl(record.document) || record.details?.externalUrl || "" })).filter(record => /^https:\/\//.test(record.url))
})

export const getPublishedCommunities = cache(async (): Promise<any[]> => {
  return (await publishedDocuments("communities").catch(() => [])).map(record => ({
    ...record, slug: { current: record.slug }, description: record.body || record.summary,
    homepageSummary: record.summary, sections: (record.sections || []).map((section: any) => ({
      heading: section.heading, paragraphs: (section.body || "").split(/\n{2,}/).filter(Boolean),
    })),
  }))
})

export async function getCommunitySlides(): Promise<CommunityStoryItem[]> {
  const knownDates = ["2021", "2026-02", "2026-06"]
  const existing = defaultCommunityStories.filter((story) => !story.isExpansion).map((story, index) => ({ story, date: knownDates[index] }))
  const extra = (await getPublishedCommunities()).filter((community) => !["gosa", "kunyami", "toge"].includes(community.slug?.current)).map((community) => ({
    date: community.establishedAt,
    story: { id: community.slug.current, number: "", name: community.name, kicker: "", location: community.name, headline: "", description: community.homepageSummary, tags: [], imageSrc: community.image?.consentConfirmed ? mediaUrl(community.image)! : "/placeholder.svg", imageAlt: community.image?.consentConfirmed ? community.image.alt || community.name : "Community photograph pending", href: `/communities/${community.slug.current}`, ctaLabel: "Learn more" },
  }))
  return [...existing, ...extra].sort((a, b) => a.date.localeCompare(b.date)).map(({ story }, index) => ({ ...story, number: String(index + 1).padStart(2, "0") })).concat(defaultCommunityStories.filter((story) => story.isExpansion))
}

export async function getPublishedCommunityPage(slug: string): Promise<SourcePage | undefined> {
  const community = (await getPublishedCommunities()).find((record) => record.slug?.current === slug)
  if (!community) return undefined
  return { path: `/communities/${slug}`, title: community.name, description: community.description, breadcrumb: `Where we work › ${community.name}`, sections: [
    { number: 1, label: "Hero", blocks: [{ kind: "heading", text: community.name }, { kind: "subheading", text: community.subheading || community.homepageSummary }] },
    ...community.sections.map((section: any, index: number) => ({ number: index + 2, label: section.heading, blocks: (section.paragraphs || []).map((text: string) => ({ kind: "paragraph", text })) })),
    { number: community.sections.length + 2, label: `Join our work in ${community.name}`, blocks: [{ kind: "buttons", items: [`Volunteer in ${community.name}`, `Fund our work in ${community.name}`, "Talk to us"] }] },
  ] }
}

export async function getEventGallery(slug: string): Promise<{ url: string; alt: string; caption?: string }[]> {
  const event = (await getAllEvents().catch(() => [])).find(record => record.slug.current === slug)
  return (event?.gallery || []).filter((image: any) => image.consentConfirmed && image.alt && mediaUrl(image))
    .map((image: any) => ({ url: mediaUrl(image)!, alt: image.alt, caption: image.caption }))
}
