import "server-only"
import { cache } from "react"
import { client } from "@/lib/sanity"
import { approvedPages, communityLocation, eventRecords, eventStatus, programmeCommunities, programmePaths, programmePillar } from "@/lib/approved-copy"
import type { DirectoryItem } from "@/components/copy-directory"
import type { CommunityStoryItem } from "@/components/community-dossier"
import type { SourcePage } from "@/lib/approved-copy"
import { defaultCommunityStories } from "@/lib/community-stories"
import { urlFor } from "@/lib/sanity"

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
  try {
    return await client.fetch(`*[_type == "news" && isActive == true && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) [0...100] { _id, title, slug, excerpt, publishedAt, category, "relatedPath": coalesce(relatedPath, relatedEvent->canonicalPath, relatedProgram->canonicalPath) }`)
  } catch { return [] }
})

export const getSourceEvents = cache(async (): Promise<DirectoryItem[]> => {
  try {
    const extra = await client.fetch(`*[_type == "event" && isActive == true && defined(programmePath) && defined(community) && defined(date)] | order(date desc) [0...100] { title, slug, excerpt, date, endDate, showTime, location, venue, isFree, programmePath, community }`)
    const knownSlugs = new Set([...eventRecords.map((e) => e.slug), "kunyami-health-outreach-2026", "community-participation-programme-compart-2026"])
    const items: DirectoryItem[] = extra.filter((e: any) => !knownSlugs.has(e.slug?.current) && programmePaths.includes(e.programmePath)).map((e: any) => ({
      path: `/events/${e.slug.current}`, title: e.title, summary: e.excerpt, pillar: programmePillar(e.programmePath),
      communities: [e.community], programme: programmeDirectory.find((p) => p.path === e.programmePath)?.title,
      date: e.date.slice(0, 10), end: (e.endDate || e.date).slice(0, 10), time: e.showTime === false ? undefined : new Intl.DateTimeFormat("en-NG", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" }).format(new Date(e.date)),
      venue: e.venue || e.location || communityLocation(e.community), isFree: e.isFree === true,
      status: eventStatus({ start: e.date.slice(0, 10), end: (e.endDate || e.date).slice(0, 10) }),
    }))
    return [...approvedEventDirectory, ...items].sort((a, b) => (b.date || "").localeCompare(a.date || ""))
  } catch { return approvedEventDirectory }
})

export type DownloadRecord = { title: string; url: string; publishedDate?: string }
export const getSourceDownloads = cache(async (): Promise<DownloadRecord[]> => {
  try {
    const resources = await client.fetch(`*[_type == "resource" && isActive == true && defined(publishedDate)] | order(publishedDate desc) { title, publishedDate, "url": coalesce(file.asset->url, externalUrl) }`)
    return resources.filter((r: DownloadRecord) => r.url && /^https:\/\//.test(r.url))
  } catch { return [] }
})

export const getPublishedCommunities = cache(async (): Promise<any[]> => {
  try {
    return await client.fetch(`*[_type == "community" && isActive == true && hasEstablishedWork == true && defined(description) && defined(homepageSummary) && count(sections) > 0] | order(establishedAt asc) { name, slug, establishedAt, homepageSummary, description, subheading, sections, image }`)
  } catch { return [] }
})

export async function getCommunitySlides(): Promise<CommunityStoryItem[]> {
  const knownDates = ["2021", "2026-02", "2026-06"]
  const existing = defaultCommunityStories.filter((story) => !story.isExpansion).map((story, index) => ({ story, date: knownDates[index] }))
  const extra = (await getPublishedCommunities()).filter((community) => !["gosa", "kunyami", "toge"].includes(community.slug?.current)).map((community) => ({
    date: community.establishedAt,
    story: { id: community.slug.current, number: "", name: community.name, kicker: "", location: community.name, headline: "", description: community.homepageSummary, tags: [], imageSrc: community.image?.consentConfirmed ? urlFor(community.image).width(1000).url() : "/placeholder.svg", imageAlt: community.image?.consentConfirmed ? community.image.alt || community.name : "Community photograph pending", href: `/communities/${community.slug.current}`, ctaLabel: "Learn more" },
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
  try {
    const images = await client.fetch(`*[_type == "event" && slug.current == $slug && isActive == true][0].gallery[consentConfirmed == true]`, { slug })
    return (images || []).filter((image: any) => image.asset && image.alt).map((image: any) => ({ url: urlFor(image).width(1200).url(), alt: image.alt, caption: image.caption }))
  } catch { return [] }
}
