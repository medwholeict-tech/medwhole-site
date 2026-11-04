import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default function PartnersPage() {
  return (
    <CmsHandoff
      title="Partners"
      description="Partner organisations, logos and website links."
      path="/collections/partners"
    />
  )
}
