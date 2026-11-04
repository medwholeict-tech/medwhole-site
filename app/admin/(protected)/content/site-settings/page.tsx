import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default function SiteSettingsContentPage() {
  return (
    <CmsHandoff
      title="Site settings"
      description="Organisation details, contact information and default search metadata."
      path="/globals/site-settings"
    />
  )
}
