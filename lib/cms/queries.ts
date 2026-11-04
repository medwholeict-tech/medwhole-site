import "server-only"
import { cache } from "react"
import { listPublicPayloadDocuments, getPublicPayloadGlobal } from "./payload"
import { mediaUrl } from "./media"
import type { CmsCollection } from "./types"

type RecordData = Record<string, any>

export const publishedDocuments = cache(async (collection: CmsCollection): Promise<RecordData[]> => {
  const records: RecordData[] = []
  for (let page = 1; ; page++) {
    const result = await listPublicPayloadDocuments(collection, `where[_status][equals]=published&limit=100&page=${page}&depth=1`)
    records.push(...result.docs)
    if (page >= (result.totalPages || 1)) return records
  }
})

function view(record: RecordData): RecordData {
  const details = record.details && typeof record.details === "object" ? record.details : {}
  const image = record.image && typeof record.image === "object" ? record.image : details.publicImage
  return {
    ...details, ...record,
    _id: String(record.id), _updatedAt: record.updatedAt,
    slug: { current: record.slug || "" },
    featuredImage: image ? { ...image, url: mediaUrl(image), alt: record.imageAlt || image.alt } : undefined,
    excerpt: record.summary || record.standfirst || details.excerpt || "",
    description: details.description || record.summary || record.standfirst || "",
    content: record.content || undefined,
    date: record.startsAt || record.date,
    endDate: record.endsAt || undefined,
    location: record.location || details.location,
    registrationForm: details.registrationForm ? { ...details.registrationForm, notificationEmails: undefined } : undefined,
  }
}

function limitRecords(records: RecordData[], limit = 10) {
  return records.slice(0, Number.isFinite(limit) ? Math.max(1, Math.min(Math.trunc(limit), 100)) : 10)
}

export const getAllEvents = cache(async () => (await publishedDocuments("events")).map(view))
export async function getEventBySlug(slug: string) {
  return (await getAllEvents()).find(event => event.slug.current === slug) || null
}
export async function getUpcomingEvents(category?: string, limit = 10) {
  const now = Date.now()
  return limitRecords((await getAllEvents()).filter(event => (!category || event.category === category) &&
    (event.status === "ongoing" || event.status === "upcoming" || (!event.status && Date.parse(event.endDate || event.date) >= now)))
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date)), limit)
}
export async function getPastEvents(category?: string, limit = 10) {
  const now = Date.now()
  return limitRecords((await getAllEvents()).filter(event => (!category || event.category === category) &&
    (event.status === "completed" || (!event.status && Date.parse(event.endDate || event.date) < now)))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date)), limit)
}
export const getEvents = getUpcomingEvents

export async function getNews(category?: string, limit = 10) {
  return limitRecords((await publishedDocuments("news")).map(view)
    .filter(article => (!category || article.category === category) && (!article.publishedAt || Date.parse(article.publishedAt) <= Date.now()))
    .sort((a, b) => Date.parse(b.publishedAt || b.createdAt) - Date.parse(a.publishedAt || a.createdAt)), limit)
}
export async function getNewsBySlug(slug: string) {
  return (await getNews(undefined, 100)).find(article => article.slug.current === slug) || null
}
export async function getSitemapEntries() {
  const [events, news] = await Promise.all([getAllEvents(), getNews(undefined, 100)])
  return [...events.map(event => ({ _type: "event", slug: event.slug.current, _updatedAt: event._updatedAt })),
    ...news.map(article => ({ _type: "news", slug: article.slug.current, _updatedAt: article._updatedAt }))]
}
export async function getGalleryImages(category?: string, limit = 20) {
  return limitRecords((await publishedDocuments("media")).filter(media => !category || media.category === category), limit)
}
export async function getTeamMembers() { return publishedDocuments("team-members") }
export async function getPrograms(category?: string) {
  return (await publishedDocuments("programmes")).map(view).filter(record => !category || record.category === category)
}
export async function getPartners() { return publishedDocuments("partners") }
export async function getResources(category?: string) {
  return (await publishedDocuments("resources")).filter(record => !category || record.category === category)
}
export async function getJobs() { return publishedDocuments("jobs") }
export async function getImpactStories() { return publishedDocuments("impact-stories") }
export async function getSiteSettings() { return getPublicPayloadGlobal("site-settings") }
