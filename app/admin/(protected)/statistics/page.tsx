import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default function StatisticsPage() {
  return (
    <CmsHandoff
      title="Impact figures"
      description="Approved figures and supporting labels shown on the homepage."
      path="/globals/homepage"
    />
  )
}
