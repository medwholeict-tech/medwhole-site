import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default function NewProgramPage() {
  return (
    <CmsHandoff
      title="Add a programme"
      description="Create the programme record in Payload so drafts, media and publishing stay consistent."
      path="/collections/programmes/create"
      backHref="/admin/programs"
      backLabel="Back to programmes"
    />
  )
}
