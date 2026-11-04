import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default function PublicPagesContentPage() {
  return (
    <CmsHandoff
      title="Public pages"
      description="Approved page copy and controlled editorial sections."
      path="/collections/pages"
    />
  )
}
