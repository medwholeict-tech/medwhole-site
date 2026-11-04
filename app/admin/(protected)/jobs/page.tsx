import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default function JobsPage() {
  return (
    <CmsHandoff
      title="Job postings"
      description="Open roles, departments, locations and application deadlines."
      path="/collections/jobs"
    />
  )
}
