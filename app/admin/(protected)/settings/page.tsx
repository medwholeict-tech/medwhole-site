import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default function SettingsPage() {
  return (
    <CmsHandoff
      title="Site settings"
      description="Organisation details, public contact information and default search metadata."
      path="/globals/site-settings"
    />
  )
}
