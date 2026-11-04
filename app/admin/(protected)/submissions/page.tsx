import Link from "next/link"
import { redirect } from "next/navigation"
import { AlertCircle, Inbox } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { listPrivatePayloadDocuments } from "@/lib/cms/payload"
import type { CmsCollection, CmsDocument } from "@/lib/cms/types"
import { SubmissionInbox } from "@/components/admin/submission-inbox"

export const dynamic = "force-dynamic"

const inboxes: { slug: CmsCollection; label: string; finance?: boolean }[] = [
  { slug: "contact-submissions", label: "Contact" },
  { slug: "volunteer-applications", label: "Volunteers" },
  { slug: "partnership-applications", label: "Partnerships" },
  { slug: "event-registrations", label: "Event registrations" },
  { slug: "newsletter-subscribers", label: "Newsletter" },
  { slug: "email-deliveries", label: "Email delivery" },
  { slug: "donation-intents", label: "Donations", finance: true },
  { slug: "donation-payments", label: "Payments", finance: true },
]

export default async function SubmissionsWorkspacePage(props: { searchParams?: Promise<{ inbox?: string }> }) {
  const searchParams = await props.searchParams;
  if (!(await auth())?.user) redirect("/admin/login")
  const active = inboxes.find((item) => item.slug === searchParams?.inbox) || inboxes[0]
  let records: CmsDocument[] = []
  let error = ""
  try {
    const result = await listPrivatePayloadDocuments(active.slug, "limit=50&sort=-submittedAt")
    records = result.docs
  } catch {
    error = active.finance
      ? "Finance inbox unavailable. Configure a dedicated finance API key and confirm its Payload role."
      : "Operational inbox unavailable. Configure the Payload operations API key and activate the collection. Existing form endpoints are unchanged."
  }

  return <>
    <AdminHeader title="Form submissions" subtitle="A role-restricted inbox for enquiries, applications, registrations and giving." />
    <div className="space-y-6 p-6">
      <nav aria-label="Submission inboxes" className="flex flex-wrap gap-x-5 gap-y-2 border-b border-grey-azure pb-3 text-sm">
        {inboxes.map((item) => <Link key={item.slug} href={`/admin/submissions?inbox=${item.slug}`} aria-current={active.slug === item.slug ? "page" : undefined} className={active.slug === item.slug ? "font-semibold text-pine-teal underline underline-offset-8" : "text-graphite hover:text-dark-azure"}>{item.label}</Link>)}
      </nav>
      {error ? <Card className="shadow-none"><CardContent className="flex gap-3 p-5 text-sm text-graphite"><AlertCircle className="h-5 w-5 shrink-0 text-dark-azure" /><p>{error}</p></CardContent></Card> : <Card className="shadow-none"><CardHeader><CardTitle className="flex items-center gap-2"><Inbox className="h-5 w-5 text-pine-teal" />{active.label}<span className="text-sm font-normal text-graphite">({records.length})</span></CardTitle></CardHeader><CardContent><SubmissionInbox collection={active.slug} records={records} /></CardContent></Card>}
      <p className="text-xs leading-5 text-graphite">Sensitive records stay in Payload and are fetched server-side through role-specific credentials. Unconfigured Payload inboxes do not fall back to exposing private data through the website API.</p>
    </div>
  </>
}
