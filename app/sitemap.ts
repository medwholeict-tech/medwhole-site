import type { MetadataRoute } from "next"
import { getSitemapEntries } from "@/lib/sanity-queries"
import { absoluteUrl } from "@/lib/seo"
import { approvedPages } from "@/lib/approved-copy"

export const revalidate = 3600

const priorityByPath: Record<string, number> = {
  "/": 1,
  "/academy": 0.9,
  "/our-work": 0.95,
  "/events": 0.9,
  "/news": 0.9,
  "/give": 0.9,
}
const approvedRoutes = Object.values(approvedPages).map(({ path }) => ({
  path,
  changeFrequency: path === "/" || ["/academy", "/our-work", "/events", "/news"].includes(path) ? "weekly" as const : "monthly" as const,
  priority: priorityByPath[path] ?? (path.startsWith("/our-work/") ? 0.85 : 0.75),
}))
const supplementalRoutes = [
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
]

const dynamicRouteByType: Record<string, string> = {
  event: "/events",
  news: "/news",
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [...approvedRoutes, ...supplementalRoutes].map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  }))

  try {
    const entries = await getSitemapEntries()
    const dynamicEntries: MetadataRoute.Sitemap = entries.flatMap((entry: { _type: string; slug?: string; _updatedAt?: string }) => {
      const basePath = dynamicRouteByType[entry._type]
      if (!basePath || !entry.slug) return []
      if (["kunyami-health-outreach-2026", "community-participation-programme-compart-2026", "compart-community-participation-programme"].includes(entry.slug)) return []

      return [{
        url: absoluteUrl(`${basePath}/${entry.slug}`),
        lastModified: entry._updatedAt ? new Date(entry._updatedAt) : undefined,
        changeFrequency: entry._type === "event" ? "weekly" : "monthly",
        priority: entry._type === "event" ? 0.8 : 0.7,
      }]
    })

    return [...new Map([...staticEntries, ...dynamicEntries].map((entry) => [entry.url, entry])).values()]
  } catch (error) {
    console.error("Could not add Sanity entries to sitemap:", error)
    return staticEntries
  }
}
