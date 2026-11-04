import { getCombinedSocialFeed } from "@/lib/social-feed"
import { getNews } from "@/lib/sanity-queries"

export const revalidate = 3600 // Revalidate hourly

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medwhole.org"

  // Fetch both social feed and news articles in parallel
  const [socialItems, newsArticles] = await Promise.all([
    getCombinedSocialFeed(10).catch(() => []),
    getNews(undefined, 10).catch(() => []),
  ])

  type FeedEntry = {
    title: string
    link: string
    guid: string
    pubDate: string
    description: string
    category?: string
    thumbnail?: string
  }

  const entries: FeedEntry[] = []

  // Add news items
  if (Array.isArray(newsArticles)) {
    for (const article of newsArticles) {
      entries.push({
        title: article.title || "MedWHOLE Update",
        link: `${siteUrl}/news/${article.slug?.current || ""}`,
        guid: `news-${article._id || article.slug?.current}`,
        pubDate: new Date(article.publishedAt || Date.now()).toUTCString(),
        description: article.excerpt || article.title || "",
        category: article.category || "News",
      })
    }
  }

  // Add social items (YouTube videos & Instagram field notes)
  for (const item of socialItems) {
    entries.push({
      title: item.title,
      link: item.url,
      guid: item.id,
      pubDate: new Date(item.publishedAt).toUTCString(),
      description: item.description || item.title,
      category: item.platform === "youtube" ? "YouTube Video" : "Instagram Field Note",
      thumbnail: item.thumbnailUrl,
    })
  }

  // Sort by date descending
  entries.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const itemsXml = entries
    .map((entry) => {
      const mediaThumbnail = entry.thumbnail
        ? `<media:thumbnail url="${escapeXml(entry.thumbnail)}" />`
        : ""
      const categoryTag = entry.category
        ? `<category>${escapeXml(entry.category)}</category>`
        : ""

      return `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${escapeXml(entry.link)}</link>
      <guid isPermaLink="false">${escapeXml(entry.guid)}</guid>
      <pubDate>${entry.pubDate}</pubDate>
      <description>${escapeXml(entry.description)}</description>
      ${categoryTag}
      ${mediaThumbnail}
    </item>`
    })
    .join("\n")

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>MedWHOLE Alliance for Health and Development</title>
    <link>${siteUrl}</link>
    <description>Free education, healthcare and skills training from a Nigerian non-profit, beginning with communities along the Airport Road corridor in Kyami District, AMAC, FCT Abuja. Since 2021.</description>
    <language>en-NG</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
