import type { Metadata } from "next"
import { approvedPages } from "@/lib/approved-copy"

const homepageCopy = approvedPages["/"]

export interface SEOProps {
  title?: string
  titleIsAbsolute?: boolean
  description?: string
  image?: string
  imageAlt?: string
  url?: string
  type?: "website" | "article" | "profile"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
  noindex?: boolean
}

function normaliseSiteUrl(value?: string) {
  const fallback = "https://www.medwhole.org"
  try {
    const url = new URL(value || fallback)
    if (url.hostname === "medwhole.org") url.hostname = "www.medwhole.org"
    return url.origin
  } catch {
    return fallback
  }
}

export const siteConfig = {
  name: homepageCopy.title,
  shortName: "MedWHOLE",
  charityId: "169086",
  defaultTitle: homepageCopy.title,
  description: homepageCopy.description,
  url: normaliseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  ogImage: "/og-image.png",
  locale: "en_NG",
  keywords: [
    "MedWHOLE",
    "development organisation",
    "whole-person development",
    "community development Nigeria",
    "community health Nigeria",
    "health programmes Nigeria",
    "literacy programmes Nigeria",
    "empowerment programmes Nigeria",
    "Nigerian non-profit",
    "FCT Abuja community programmes",
    "Whole People Lasting Impact",
  ],
} as const

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.url}/`).toString()
}

export function metaDescription(value?: string, fallback = siteConfig.description) {
  const text = (value || fallback).replace(/\s+/g, " ").trim()
  if (text.length <= 160) return text
  const shortened = text.slice(0, 157)
  return `${shortened.slice(0, shortened.lastIndexOf(" "))}…`
}

export function generateSEO({
  title,
  titleIsAbsolute = false,
  description,
  image,
  imageAlt,
  url = "/",
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags,
  noindex = false,
}: SEOProps = {}): Metadata {
  const metadataTitle = title
    ? titleIsAbsolute
      ? title
      : `${title} | ${siteConfig.shortName}`
    : siteConfig.defaultTitle
  const pageDescription = description || siteConfig.description
  const pageUrl = absoluteUrl(url)
  const pageImage = image?.startsWith("http") ? image : absoluteUrl(image || siteConfig.ogImage)
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

  return {
    metadataBase: new URL(siteConfig.url),
    title: metadataTitle,
    description: pageDescription,
    applicationName: siteConfig.shortName,
    keywords: [...siteConfig.keywords, ...(tags || [])],
    authors: [{ name: author || siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "Nonprofit",
    referrer: "origin-when-cross-origin",
    robots: noindex
      ? {
          index: false,
          follow: false,
          noarchive: true,
          googleBot: { index: false, follow: false, noimageindex: true },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    alternates: {
      canonical: pageUrl,
      languages: {
        "en-NG": pageUrl,
        "x-default": pageUrl,
      },
      types: {
        "application/rss+xml": `${siteConfig.url}/feed.xml`,
      },
    },
    openGraph: {
      type,
      locale: siteConfig.locale,
      url: pageUrl,
      title: metadataTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: imageAlt || title || "MedWHOLE - Whole People. Lasting Impact.",
        },
      ],
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime: modifiedTime || publishedTime,
            authors: [author || siteConfig.name],
            tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description: pageDescription,
      images: [{ url: pageImage, alt: imageAlt || title || siteConfig.name }],
    },
    verification: googleVerification ? { google: googleVerification } : undefined,
    icons: {
      icon: [
        { url: "/favicon.svg?v=20260922", type: "image/svg+xml" },
        { url: "/favicon.ico?v=20260922", sizes: "any" },
        { url: "/favicon.png?v=20260922", sizes: "32x32", type: "image/png" },
        { url: "/android-chrome-192x192.png?v=20260922", sizes: "192x192", type: "image/png" },
        { url: "/android-chrome-512x512.png?v=20260922", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png?v=20260922", sizes: "180x180", type: "image/png" }],
      shortcut: ["/favicon.ico?v=20260922"],
    },
    manifest: "/site.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: siteConfig.shortName,
    },
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    other: {
      "msapplication-TileColor": "#1b3a57",
      "msapplication-config": "/browserconfig.xml",
    },
  }
}
