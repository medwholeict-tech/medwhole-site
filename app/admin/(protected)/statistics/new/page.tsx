import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default function NewStatisticPage() {
  return (
    <CmsHandoff
      title="Update impact figures"
      description="Impact figures are edited inside the homepage global in Payload."
      path="/globals/homepage"
      backHref="/admin/statistics"
      backLabel="Back to impact figures"
    />
  )
}
