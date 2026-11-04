import Link from "next/link"
import {
  ArrowUpRight,
  Calendar,
  ExternalLink,
  FileText,
  GraduationCap,
  Newspaper,
  Users,
} from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cmsAdminUrl, cmsCreateUrl } from "@/lib/cms/admin"
import { listPayloadDocuments, payloadHealth } from "@/lib/cms/payload"
import type { CmsCollection, CmsDocument } from "@/lib/cms/types"

export const dynamic = "force-dynamic"

const counters = [
  { title: "Programmes", collection: "programmes" as CmsCollection, icon: GraduationCap },
  { title: "Events", collection: "events" as CmsCollection, icon: Calendar },
  { title: "News and reports", collection: "news" as CmsCollection, icon: Newspaper },
  { title: "Team members", collection: "team-members" as CmsCollection, icon: Users },
]

const quickActions = [
  { title: "Add a programme", description: "Create a new programme record.", collection: "programmes" },
  { title: "Create an event", description: "Publish an upcoming event and its details.", collection: "events" },
  { title: "Write a news update", description: "Add an article, announcement or report.", collection: "news" },
  { title: "Upload media", description: "Add an image, video or document with alt text.", collection: "media" },
] as const

function formatDate(value: unknown) {
  if (typeof value !== "string") return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function recordTitle(record: CmsDocument) {
  for (const field of ["title", "name", "alt"]) {
    const value = record[field]
    if (typeof value === "string" && value.trim()) return value
  }
  return `Record ${record.id}`
}

export default async function AdminDashboard() {
  const health = await payloadHealth()

  let counts: Record<string, number | null> = Object.fromEntries(counters.map((item) => [item.collection, null]))
  let recent: CmsDocument[] = []

  if (health.reachable) {
    const [countResults, recentResult] = await Promise.all([
      Promise.allSettled(counters.map((item) => listPayloadDocuments(item.collection, "limit=1&depth=0"))),
      listPayloadDocuments("news", "limit=5&depth=0&sort=-updatedAt").catch(() => null),
    ])

    counts = Object.fromEntries(
      counters.map((item, index) => {
        const result = countResults[index]
        return [item.collection, result.status === "fulfilled" ? (result.value.totalDocs ?? result.value.docs.length) : null]
      }),
    )
    recent = recentResult?.docs ?? []
  }

  const cmsUrl = cmsAdminUrl()
  const connectionLabel = health.reachable ? "Connected" : health.configured ? "Unreachable" : "Not configured"

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle="A clear view of the content and enquiries that need attention."
      />

      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-[var(--color-grey-azure)] bg-white p-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-graphite">
            <span className="font-semibold text-[var(--color-dark-azure)]">Payload CMS</span>
            <Badge variant={health.reachable ? "default" : "secondary"}>{connectionLabel}</Badge>
            {!health.reachable && (
              <span className="text-graphite">
                {health.configured ? health.error || "The CMS did not respond." : "Add the CMS URL and keys to load live content."}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/content">Content workspace</Link>
            </Button>
            {cmsUrl && (
              <Button asChild size="sm">
                <a href={cmsUrl} target="_blank" rel="noopener noreferrer">
                  Open CMS
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {counters.map((item) => {
            const value = counts[item.collection]
            return (
              <Card key={item.collection} className="border-[var(--color-grey-azure)] shadow-none">
                <CardContent className="flex items-center justify-between gap-4 p-6">
                  <div>
                    <p className="text-sm font-medium text-graphite">{item.title}</p>
                    <p className="mt-2 text-3xl font-bold text-dark-azure">{value === null ? "—" : value}</p>
                    <p className="mt-1 text-xs text-graphite">{value === null ? "CMS unavailable" : "Records in Payload"}</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center border border-[var(--color-grey-azure)] bg-[var(--color-pale-sky)]/25 text-[var(--color-pine-teal)]">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {quickActions.map((action) => {
                const externalUrl = cmsCreateUrl(action.collection)
                const href = externalUrl ?? "/admin/content"
                const content = (
                  <>
                    <div className="flex h-9 w-9 items-center justify-center border border-[var(--color-grey-azure)] text-[var(--color-pine-teal)]">
                      <FileText className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-dark-azure">{action.title}</p>
                      <p className="text-xs text-graphite">{action.description}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-grey-azure" aria-hidden="true" />
                  </>
                )
                return externalUrl ? (
                  <a
                    key={action.collection}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 transition-colors hover:bg-parchment"
                  >
                    {content}
                  </a>
                ) : (
                  <Link key={action.collection} href={href} className="flex items-center gap-3 p-3 transition-colors hover:bg-parchment">
                    {content}
                  </Link>
                )
              })}
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Recently updated</CardTitle>
            </CardHeader>
            <CardContent>
              {recent.length === 0 ? (
                <p className="py-6 text-sm leading-6 text-graphite">
                  {health.reachable
                    ? "No news or report records have been updated yet."
                    : "Connect Payload to see recent editorial activity."}
                </p>
              ) : (
                <ul className="divide-y divide-[var(--color-grey-azure)]">
                  {recent.map((record) => {
                    const href = cmsAdminUrl(`/collections/news/${encodeURIComponent(record.id)}`)
                    return (
                      <li key={record.id} className="py-3">
                        <a
                          href={href ?? "/admin/content"}
                          {...(href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="flex items-start justify-between gap-4 text-sm hover:underline"
                        >
                          <span className="font-medium text-dark-azure">{recordTitle(record)}</span>
                          <span className="shrink-0 text-xs text-graphite">{formatDate(record.updatedAt)}</span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-[var(--color-grey-azure)] bg-[var(--color-parchment)] shadow-none">
          <CardHeader>
            <CardTitle className="text-base">How publishing works</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm leading-6 text-graphite md:grid-cols-3">
            <div>
              <p className="font-semibold text-[var(--color-dark-azure)]">1. Edit in Payload</p>
              <p>Open the CMS to create or update a record. Drafts are saved automatically.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-dark-azure)]">2. Review before publishing</p>
              <p>Check wording, imagery, alt text and consent details while the record is still a draft.</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-dark-azure)]">3. Publish</p>
              <p>Publishing makes the approved record available to the public site and its cache is refreshed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
