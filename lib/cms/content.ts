import "server-only"

import { cache } from "react"
import type { CmsDocument } from "./types"
import { getPublicPayloadGlobal, isPayloadPublicEnabled, listPublicPayloadDocuments, payloadBaseUrl } from "./payload"
import type { SourceBlock, SourcePage } from "@/lib/approved-copy"
import { convertSourcePage, type WebsiteCopyPage } from "@/lib/website-copy"
import { mediaUrl } from "./media"

type PayloadMedia = {
  url?: string | null
  alt?: string | null
  filename?: string | null
}

type PayloadPage = CmsDocument & {
  title?: string
  path?: string
  metaDescription?: string
  eyebrow?: string
  heading?: string
  subheading?: string
  heroImage?: PayloadMedia | string | null
  heroImageAlt?: string | null
  pageContent?: Record<string, unknown> | null
  sections?: Array<{
    blockType?: string
    sectionNumber?: number
    sectionLabel?: string
    sourceBlocks?: unknown
  }> | null
}

export type PayloadNewsArticle = {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  category: string
  author?: string
  imageUrl?: string
  imageAlt: string
  body?: string
  content?: unknown
  updatedAt?: string
}

export type PayloadTeamMember = {
  id: string
  name: string
  role?: string
  biography?: string
  email?: string
  linkedinUrl?: string
  photoUrl?: string
}

export type PayloadNavigationLink = {
  label: string
  href: string
  description?: string
}

export type PayloadNavigationGroup = PayloadNavigationLink & {
  items?: PayloadNavigationLink[]
}

export type PayloadNavigation = {
  headerGroups?: PayloadNavigationGroup[]
  headerCta?: { label?: string; href?: string }
  footerNavigation?: PayloadNavigationLink[]
  legalNavigation?: PayloadNavigationLink[]
}

export type PayloadSiteSettings = {
  organisationName?: string
  siteTitle?: string
  siteDescription?: string
  tagline?: string
  publicEmail?: string
  publicPhone?: string
  publicAddress?: string
  socialLinks?: Array<{ label?: string; url?: string }>
}

export function payloadMediaUrl(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === "string") {
    if (/^https?:\/\//i.test(value)) return value
    return payloadBaseUrl ? `${payloadBaseUrl}${value.startsWith("/") ? "" : "/"}${value}` : value
  }
  if (typeof value === "object") {
    const media = value as PayloadMedia
    if (media.url) {
      if (/^https?:\/\//i.test(media.url)) return media.url
      return payloadBaseUrl ? `${payloadBaseUrl}${media.url.startsWith("/") ? "" : "/"}${media.url}` : media.url
    }
  }
  return undefined
}

function publishedQuery(extra = "") {
  const base = "where[_status][equals]=published"
  return extra ? `${base}&${extra}` : base
}

export const getPayloadSourcePage = cache(async (path: string): Promise<SourcePage | null> => {
  if (!isPayloadPublicEnabled()) return null
  try {
    const result = await listPublicPayloadDocuments<PayloadPage>(
      "pages",
      `${publishedQuery(`where[path][equals]=${encodeURIComponent(path)}`)}&limit=1&depth=1`,
    )
    const page = result.docs[0]
    if (!page) return null
    const sections = (page.sections ?? [])
      .filter((section) => section.blockType === "approved-content-section")
      .map((section) => ({
        number: section.sectionNumber ?? 0,
        label: section.sectionLabel ?? "",
        blocks: Array.isArray(section.sourceBlocks) ? (section.sourceBlocks as SourceBlock[]) : [],
      }))
      .filter((section) => section.label && section.blocks.length > 0)
    if (sections.length === 0) return null
    return {
      path: page.path || path,
      title: page.title || page.heading || "",
      description: page.metaDescription || page.subheading || "",
      breadcrumb: page.eyebrow || "",
      sections,
    }
  } catch {
    return null
  }
})

export const getPayloadWebsitePage = cache(async (path: string): Promise<WebsiteCopyPage | null> => {
  const page = await getPayloadSourcePage(path)
  return page ? convertSourcePage(page) : null
})

export const getPayloadPageContent = cache(async (path: string): Promise<Record<string, unknown> | null> => {
  if (!isPayloadPublicEnabled()) return null
  try {
    const result = await listPublicPayloadDocuments<PayloadPage>(
      "pages",
      `${publishedQuery(`where[path][equals]=${encodeURIComponent(path)}`)}&limit=1&depth=0`,
    )
    return result.docs[0]?.pageContent ?? null
  } catch {
    return null
  }
})

export const getPayloadNews = cache(async (): Promise<PayloadNewsArticle[]> => {
  if (!isPayloadPublicEnabled()) return []
  try {
    const result = await listPublicPayloadDocuments<CmsDocument>(
      "news",
      `${publishedQuery()}&limit=100&sort=-publishedAt&depth=1`,
    )
    const now = Date.now()
    return result.docs
      .filter((doc) => {
        const publishedAt = typeof doc.publishedAt === "string" ? Date.parse(doc.publishedAt) : 0
        return !publishedAt || publishedAt <= now
      })
      .map((doc) => {
        const slugValue = doc.slug
        const slug = typeof slugValue === "string"
          ? slugValue
          : typeof slugValue === "object" && slugValue && "current" in slugValue
            ? String((slugValue as { current?: string }).current || "")
            : ""
        const image = doc.image && typeof doc.image === "object" ? doc.image : (doc.details as { publicImage?: unknown } | undefined)?.publicImage
        return {
          id: doc.id,
          title: typeof doc.title === "string" ? doc.title : "",
          slug,
          excerpt: typeof doc.summary === "string" ? doc.summary : "",
          publishedAt: typeof doc.publishedAt === "string" ? doc.publishedAt : "",
          category: typeof doc.category === "string" ? doc.category : "",
          author: typeof doc.author === "string" ? doc.author : undefined,
          imageUrl: mediaUrl(image),
          imageAlt: typeof doc.imageAlt === "string" ? doc.imageAlt : "",
          body: typeof doc.body === "string" ? doc.body : undefined,
          content: doc.content,
          updatedAt: typeof doc.updatedAt === "string" ? doc.updatedAt : undefined,
        }
      })
      .filter((article) => article.slug && article.title)
  } catch {
    return []
  }
})

export const getPayloadNewsBySlug = cache(async (slug: string): Promise<PayloadNewsArticle | null> => {
  const articles = await getPayloadNews()
  return articles.find((article) => article.slug === slug) ?? null
})

export const getPayloadTeam = cache(async (): Promise<PayloadTeamMember[]> => {
  if (!isPayloadPublicEnabled()) return []
  try {
    const result = await listPublicPayloadDocuments<CmsDocument>(
      "team-members",
      `${publishedQuery()}&limit=100&sort=order&depth=1`,
    )
    return result.docs.map((doc) => ({
      id: doc.id,
      name: typeof doc.name === "string" ? doc.name : "",
      role: typeof doc.role === "string" ? doc.role : undefined,
      biography: typeof doc.biography === "string" ? doc.biography : undefined,
      email: typeof doc.email === "string" ? doc.email : undefined,
      linkedinUrl: typeof doc.linkedinUrl === "string" ? doc.linkedinUrl : undefined,
      photoUrl: payloadMediaUrl(doc.image),
    })).filter((member) => member.name)
  } catch {
    return []
  }
})

export const getPayloadHomepage = cache(async (): Promise<Record<string, unknown> | null> => {
  if (!isPayloadPublicEnabled()) return null
  try {
    return await getPublicPayloadGlobal<Record<string, unknown>>("homepage")
  } catch {
    return null
  }
})

export const getPayloadSiteSettings = cache(async (): Promise<PayloadSiteSettings | null> => {
  if (!isPayloadPublicEnabled()) return null
  try {
    return await getPublicPayloadGlobal<PayloadSiteSettings>("site-settings")
  } catch {
    return null
  }
})

export const getPayloadNavigation = cache(async (): Promise<PayloadNavigation | null> => {
  if (!isPayloadPublicEnabled()) return null
  try {
    return await getPublicPayloadGlobal<PayloadNavigation>("navigation")
  } catch {
    return null
  }
})
