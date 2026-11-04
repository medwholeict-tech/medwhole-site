import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default function ProgramsPage() {
  return (
    <CmsHandoff
      title="Programmes"
      description="Health, literacy and empowerment programme records."
      path="/collections/programmes"
    />
  )
}
