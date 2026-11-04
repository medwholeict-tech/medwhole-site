import { notFound } from "next/navigation"
import { CmsHandoff } from "@/components/admin/cms-handoff"
import type { CmsCollection } from "@/lib/cms/types"

export const dynamic = "force-dynamic"

const collections: Partial<Record<string, { title: string; collection: CmsCollection }>> = {
  pages: { title: "Public pages", collection: "pages" },
  programmes: { title: "Programmes", collection: "programmes" },
  events: { title: "Events", collection: "events" },
  news: { title: "News and reports", collection: "news" },
  communities: { title: "Communities", collection: "communities" },
  "impact-stories": { title: "Impact stories", collection: "impact-stories" },
  "team-members": { title: "Team members", collection: "team-members" },
  partners: { title: "Partners", collection: "partners" },
  resources: { title: "Resources", collection: "resources" },
  jobs: { title: "Job postings", collection: "jobs" },
  media: { title: "Media library", collection: "media" },
}

export default async function NewCmsDocumentHandoff(props: { params: Promise<{ collection: string }> }) {
  const params = await props.params;
  const section = collections[params.collection]
  if (!section) notFound()

  return (
    <CmsHandoff
      title={`Add to ${section.title}`}
      description="Create the record in Payload so drafts, media and publishing stay consistent."
      path={`/collections/${section.collection}/create`}
    />
  )
}
