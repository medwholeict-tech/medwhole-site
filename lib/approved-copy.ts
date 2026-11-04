import source from "./approved-website-copy.json"

export type SourceBlock = { kind: string; text?: string; items?: string[] }
export type SourceSection = { number: number; label: string; blocks: SourceBlock[] }
export type SourcePage = { path: string; title: string; description: string; breadcrumb: string; sections: SourceSection[] }
export const approvedPages: Record<string, SourcePage> = source.pages
export const sourceDigest = source.sha256
export const communityNames = ["Gosa", "Kunyami", "Toge"] as const
export const district = "Kyami District, AMAC, FCT Abuja, Nigeria"
export const communityLocation = (name: string) => `${name}, ${district}`
export const resourceCentre = `MedWHOLE Resource Centre — 7 Nissi Drive, Fort Royal, Nnamdi Azikiwe Airport Road, ${district}`
export const liaisonOffice = `Gosa liaison office — Shop 6, Gosa Shopping Complex, Nnamdi Azikiwe Airport Road, ${district}`
export const accessCommunity = "Free, and open to everyone in the community."
export const accessChildren = "Free, and open to every child in the community."

export function sectionId(section: SourceSection) {
  const name = section.blocks.find((block) => block.kind === "heading")?.text || section.label
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

const fixedLinks: Record<string, string> = {
  "about": "/about", "how we work": "/about/journey", "the made whole journey": "/about/journey",
  "accountability": "/about/accountability", "our accountability": "/about/accountability",
  "team and governance": "/about/team", "our work": "/our-work", "see our work": "/our-work", "all our work": "/our-work",
  "health": "/our-work/health", "literacy": "/our-work/literacy", "empowerment": "/our-work/empowerment",
  "medwhole academy": "/academy", "academy": "/academy", "explore the academy": "/academy",
  "summer school": "/academy/summer-school", "good news club": "/academy/good-news-club",
  "reading club": "/academy/reading-club", "library and reading club": "/academy/reading-club",
  "scholarship": "/academy/scholarship", "back-to-school scholarship": "/academy/scholarship",
  "exam coaching": "/academy/exam-coaching", "medical outreaches": "/our-work/health/medical-outreaches",
  "continuity of care": "/our-work/health/continuity-of-care", "how we follow up": "/our-work/health/continuity-of-care",
  "school health interventions": "/our-work/health/school-health", "nutrition": "/our-work/health/nutrition",
  "health systems strengthening": "/our-work/health/health-systems", "compart": "/our-work/empowerment/compart",
  "community innovation challenge": "/our-work/empowerment/community-innovation-challenge",
  "kunyami health outreach": "/events/kunyami-health-outreach-feb-2026",
  "summer school — gosa 2026": "/events/summer-school-gosa-2026",
  "summer school — kunyami 2026": "/events/summer-school-kunyami-2026",
  "school health intervention — toge": "/events/toge-school-health-jun-2026",
  "graduation and project presentation day": "/events/compart-graduation-jun-2026",
  "seven referrals, seven recoveries": "/events/kunyami-health-outreach-feb-2026",
  "twenty-one children to three hundred and five": "/academy/good-news-club",
  "from the registration desk to a graduation": "/events/compart-graduation-jun-2026",
  "see what the money did": "/impact", "all news and events": "/news", "contact": "/contact", "contact us": "/contact",
  "safeguarding": "/safeguarding", "read our safeguarding policy": "/safeguarding#the-policy",
  "a safeguarding concern": "/safeguarding", "partnership and funding enquiries": "/partner", "press": "mailto:info@medwhole.org?subject=Media%20enquiry",
  "request a conversation": "#talk-to-us", "apply to volunteer": "#apply",
  "see this year's programmes": "#what-the-academy-runs", "talk to us about a new community": "/partner",
}

export function copyLink(label: string, path = "/"): string | undefined {
  const key = label.toLowerCase().trim()
  if (fixedLinks[key]) return fixedLinks[key]
  if (key === "give" || key.startsWith("fund ") || key.startsWith("give to")) {
    const designation = key === "give" ? "" : approvedPages[path]?.sections[0]?.blocks.find((b) => b.kind === "heading")?.text || label
    const community = path.startsWith("/communities/") ? path.split("/").pop() : undefined
    const query = new URLSearchParams({ ...(designation ? { designation } : {}), ...(community ? { community } : {}) })
    return `/give${query.size ? `?${query}` : ""}`
  }
  if (key.startsWith("volunteer") || key === "mentorship") {
    const community = path.startsWith("/communities/") ? path.split("/").pop() : undefined
    return `/volunteer${community ? `?community=${community}` : ""}`
  }
  if (key.startsWith("partner")) return `/partner${path.startsWith("/communities/") ? `?community=${path.split("/").pop()}` : ""}`
  if (key === "talk to us") return `/contact${path.startsWith("/communities/") ? `?community=${path.split("/").pop()}` : ""}`
  if (key === "learn more") return undefined
  if (/^\S+@\S+\.\S+$/.test(label)) return `mailto:${label}`
  return undefined
}

export type EventRecord = {
  slug: string; programme: string; pillar: string; community: string; start: string; end: string;
  time?: string; people?: number; peopleLabel?: string; teachers?: number; services?: number; serviceLabel?: string; attendances?: number; graduates?: number;
}
// Event facts are kept separately from people/attendance/services totals. Unknown totals stay unset.
export const eventRecords: EventRecord[] = [
  { slug: "summer-school-gosa-2026", programme: "/academy/summer-school", pillar: "Literacy", community: "Gosa", start: "2026-08-03", end: "2026-08-31", time: "09:00", attendances: 1570 },
  { slug: "summer-school-kunyami-2026", programme: "/academy/summer-school", pillar: "Literacy", community: "Kunyami", start: "2026-08-03", end: "2026-08-28", time: "09:00", attendances: 753 },
  { slug: "kunyami-health-outreach-feb-2026", programme: "/our-work/health/medical-outreaches", pillar: "Health", community: "Kunyami", start: "2026-02-14", end: "2026-02-14", people: 506, services: 697 },
  { slug: "toge-school-health-jun-2026", programme: "/our-work/health/school-health", pillar: "Health", community: "Toge", start: "2026-06-30", end: "2026-06-30", people: 196, peopleLabel: "pupils screened", teachers: 9, services: 193, serviceLabel: "deworming doses" },
  { slug: "compart-graduation-jun-2026", programme: "/our-work/empowerment/compart", pillar: "Empowerment", community: "Kunyami", start: "2026-06-07", end: "2026-06-07", graduates: 12 },
]

export function eventStatus(event: Pick<EventRecord, "start" | "end">, now = new Date()) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos", year: "numeric", month: "2-digit", day: "2-digit" }).format(now)
  return event.start > today ? "Upcoming" : event.end < today ? "Completed" : "Running"
}

export const programmePaths = ["/academy", ...Object.keys(approvedPages).filter((path) => path.startsWith("/academy/")), ...Object.keys(approvedPages).filter((path) => path.split("/").length === 4 && path.startsWith("/our-work/"))]
export function programmePillar(path: string) { return path.startsWith("/academy") ? "Literacy" : path.includes("/health/") ? "Health" : "Empowerment" }
export function programmeCommunities(path: string) {
  if (path.endsWith("/community-innovation-challenge")) return ["Gosa"]
  if (path.endsWith("/compart")) return ["Kunyami"]
  if (path.startsWith("/academy")) return path.endsWith("/reading-club") ? ["Gosa"] : ["Gosa", "Kunyami"]
  if (path.endsWith("/school-health")) return ["Toge"]
  return [...communityNames]
}
