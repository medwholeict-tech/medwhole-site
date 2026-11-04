import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  LayoutTemplate,
  Settings2,
  TriangleAlert,
} from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cmsAdminUrl, cmsCollectionUrl, cmsGlobalUrl } from "@/lib/cms/admin"
import { payloadHealth } from "@/lib/cms/payload"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

const editorialCollections = [
  { collection: "pages", title: "Public pages", description: "Approved page copy, hero content and controlled editorial sections." },
  { collection: "programmes", title: "Programmes", description: "Health, literacy and empowerment programme records." },
  { collection: "events", title: "Events", description: "Event details, dates, locations and galleries." },
  { collection: "news", title: "News and reports", description: "Articles, announcements and quarterly reports." },
  { collection: "communities", title: "Communities", description: "Community profiles and the stories attached to them." },
  { collection: "impact-stories", title: "Impact stories", description: "Dignified, consented stories of lasting change." },
  { collection: "team-members", title: "Team members", description: "Leadership and staff profiles." },
  { collection: "partners", title: "Partners", description: "Partner organisations, logos and links." },
  { collection: "resources", title: "Resources", description: "Downloadable documents, reports and publications." },
  { collection: "jobs", title: "Job postings", description: "Open roles, departments and deadlines." },
] as const

const siteGlobals = [
  { slug: "homepage", title: "Homepage", description: "Hero video, impact figures, featured stories and the flowing gallery." },
  { slug: "site-settings", title: "Site settings", description: "Organisation details, contact information and default search metadata." },
  { slug: "navigation", title: "Navigation", description: "Primary navigation, footer groups and call-to-action links." },
] as const

function CmsLink({
  href,
  external,
  children,
  variant = "link",
}: {
  href: string
  external: boolean
  children: React.ReactNode
  variant?: "link" | "button"
}) {
  if (variant === "button") {
    return (
      <Button asChild variant="outline" size="sm">
        {external ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
            <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        ) : (
          <Link href={href}>{children}</Link>
        )}
      </Button>
    )
  }

  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-pine-teal)] underline-offset-4 hover:underline"
    >
      {children}
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </a>
  ) : (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-pine-teal)] underline-offset-4 hover:underline"
    >
      {children}
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  )
}

export default async function ContentWorkspacePage() {
  if (!(await auth())?.user) redirect("/admin/login")
  const health = await payloadHealth()
  const adminUrl = cmsAdminUrl()
  const connectionLabel = health.reachable ? "Connected" : health.configured ? "Configured but unreachable" : "Not configured"

  return (
    <>
      <AdminHeader
        title="Content"
        subtitle="Editorial records are managed in Payload CMS, where drafts, versions, media and publishing live together."
      />

      <div className="space-y-6 p-4 sm:p-6">
        <Card className="border-[var(--color-grey-azure)] shadow-none">
          <CardContent className="flex flex-wrap items-start justify-between gap-5 p-6">
            <div className="flex gap-4">
              {health.reachable ? (
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[var(--color-pine-teal)]" aria-hidden="true" />
              ) : (
                <TriangleAlert className="mt-0.5 h-6 w-6 shrink-0 text-[var(--color-dark-azure)]" aria-hidden="true" />
              )}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-[var(--color-dark-azure)]">Payload CMS</h2>
                  <Badge variant={health.reachable ? "default" : "secondary"}>{connectionLabel}</Badge>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-graphite">
                  {health.reachable
                    ? "Content changes made in Payload appear on the public site once published and revalidated."
                    : health.configured
                      ? `The CMS address is set but the service did not respond${health.error ? `: ${health.error}` : "."}`
                      : "Add the CMS address and server-side editor key to the website environment to enable editorial links."}
                </p>
                {health.baseUrl && (
                  <p className="mt-2 break-all font-mono text-xs text-graphite">CMS: {health.baseUrl}</p>
                )}
                {!health.configured && (
                  <div className="mt-4 border border-[var(--color-grey-azure)] bg-[var(--color-parchment)] p-4 text-sm">
                    <p className="mb-2 font-semibold text-[var(--color-dark-azure)]">Required server environment variables</p>
                    <ul className="space-y-1 font-mono text-xs text-graphite">
                      <li>PAYLOAD_CMS_URL</li>
                      <li>PAYLOAD_CMS_READ_API_KEY</li>
                      <li>PAYLOAD_CMS_ADMIN_API_KEY</li>
                    </ul>
                    <p className="mt-3 text-xs leading-5 text-graphite">
                      See <span className="font-mono">docs/payload-environment.md</span> for the full credential set and role guidance.
                    </p>
                  </div>
                )}
              </div>
            </div>
            {adminUrl && (
              <CmsLink href={adminUrl} external variant="button">
                Open CMS
              </CmsLink>
            )}
          </CardContent>
        </Card>

        <section aria-labelledby="site-content-heading">
          <div className="mb-4 flex items-center gap-3">
            <LayoutTemplate className="h-5 w-5 text-[var(--color-pine-teal)]" aria-hidden="true" />
            <h2 id="site-content-heading" className="text-lg font-semibold text-[var(--color-dark-azure)]">
              Site-wide content
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {siteGlobals.map((item) => {
              const externalUrl = cmsGlobalUrl(item.slug)
              return (
                <Card key={item.slug} className="flex flex-col shadow-none transition-colors hover:border-[var(--color-pine-teal)]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Settings2 className="h-4 w-4 text-[var(--color-pine-teal)]" aria-hidden="true" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between gap-4">
                    <p className="text-sm leading-6 text-graphite">{item.description}</p>
                    <CmsLink href={externalUrl ?? `/admin/content/${item.slug}`} external={Boolean(externalUrl)}>
                      Edit in Payload
                    </CmsLink>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <section aria-labelledby="editorial-heading">
          <div className="mb-4 flex items-center gap-3">
            <FileText className="h-5 w-5 text-[var(--color-pine-teal)]" aria-hidden="true" />
            <h2 id="editorial-heading" className="text-lg font-semibold text-[var(--color-dark-azure)]">
              Editorial collections
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {editorialCollections.map((item) => {
              const externalUrl = cmsCollectionUrl(item.collection)
              return (
                <Card key={item.collection} className="flex flex-col shadow-none transition-colors hover:border-[var(--color-pine-teal)]">
                  <CardHeader>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between gap-4">
                    <p className="text-sm leading-6 text-graphite">{item.description}</p>
                    <CmsLink href={externalUrl ?? `/admin/content/library/${item.collection}`} external={Boolean(externalUrl)}>
                      Open records
                    </CmsLink>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <Card className="border-[var(--color-grey-azure)] shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="h-4 w-4 text-[var(--color-pine-teal)]" aria-hidden="true" />
              Media library
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-2xl text-sm leading-6 text-graphite">
              Images, video and documents require alternative text, a category and consent confirmation before publication.
            </p>
            <CmsLink href={cmsCollectionUrl("media") ?? "/admin/content/library/media"} external={Boolean(cmsCollectionUrl("media"))}>
              Manage media
            </CmsLink>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
