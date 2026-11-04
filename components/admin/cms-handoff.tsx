import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, ExternalLink, ServerCrash } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { cmsAdminUrl } from "@/lib/cms/admin"

type CmsHandoffProps = {
  title: string
  description: string
  path: string
  backHref?: string
  backLabel?: string
}

/**
 * Sends editors to the Payload admin, which owns editorial records, drafts,
 * versions, media and publishing. When the CMS is not configured the page
 * explains exactly what is missing instead of rendering a half-working form.
 */
export async function CmsHandoff({
  title,
  description,
  path,
  backHref = "/admin/content",
  backLabel = "Back to content",
}: CmsHandoffProps) {
  if (!(await auth())?.user) redirect("/admin/login")
  const url = cmsAdminUrl(path)
  if (url) redirect(url)

  return (
    <>
      <AdminHeader title={title} subtitle={description} />
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <Card className="border-[var(--color-grey-azure)] shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-[var(--color-dark-azure)]">
              <ServerCrash className="h-5 w-5 text-[var(--color-pine-teal)]" aria-hidden="true" />
              Payload CMS is not connected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-graphite">
            <p>
              Editorial records live in Payload so that drafts, versions, media and publishing stay in one place.
              This admin needs the CMS address and a server-side editor key before it can open them.
            </p>
            <div className="border border-[var(--color-grey-azure)] bg-[var(--color-parchment)] p-4">
              <p className="mb-2 font-semibold text-[var(--color-dark-azure)]">Required server environment variables</p>
              <ul className="space-y-1 font-mono text-xs text-graphite">
                <li>PAYLOAD_CMS_URL</li>
                <li>PAYLOAD_CMS_READ_API_KEY</li>
                <li>PAYLOAD_CMS_ADMIN_API_KEY</li>
              </ul>
            </div>
            <p>
              Add them to the website&rsquo;s deployment environment, then reload this page. The setup is described in
              <span className="font-mono text-xs"> docs/payload-environment.md</span>.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="outline">
                <Link href={backHref}>
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                  {backLabel}
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/admin/content">
                  Check connection
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
