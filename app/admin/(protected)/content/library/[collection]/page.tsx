import { notFound } from "next/navigation"
import { CmsHandoff } from "@/components/admin/cms-handoff"
import type { CmsCollection } from "@/lib/cms/types"

export const dynamic = "force-dynamic"

const collections: Partial<Record<string, { title: string; description: string; collection: CmsCollection }>> = {
  pages: { title: "Public pages", description: "Approved page copy and controlled editorial sections.", collection: "pages" },
  programmes: { title: "Programmes", description: "Health, literacy and empowerment programme records.", collection: "programmes" },
  events: { title: "Events", description: "Event details, dates, locations and galleries.", collection: "events" },
  news: { title: "News and reports", description: "Articles, announcements and quarterly reports.", collection: "news" },
  communities: { title: "Communities", description: "Community profiles and their stories.", collection: "communities" },
  "impact-stories": { title: "Impact stories", description: "Consented stories of lasting change.", collection: "impact-stories" },
  "team-members": { title: "Team members", description: "Leadership and staff profiles.", collection: "team-members" },
  partners: { title: "Partners", description: "Partner organisations, logos and links.", collection: "partners" },
  resources: { title: "Resources", description: "Downloadable documents and publications.", collection: "resources" },
  jobs: { title: "Job postings", description: "Open roles, departments and deadlines.", collection: "jobs" },
  media: { title: "Media library", description: "Images, video and documents with alt text and consent details.", collection: "media" },
}

export default async function CmsCollectionHandoff(props: { params: Promise<{ collection: string }> }) {
  const params = await props.params;
  const section = collections[params.collection]
  if (!section) notFound()

  return (
    <CmsHandoff
      title={section.title}
      description={section.description}
      path={`/collections/${section.collection}`}
    />
  )
}
