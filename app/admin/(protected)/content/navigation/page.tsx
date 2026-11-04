import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default function NavigationContentPage() {
  return (
    <CmsHandoff
      title="Navigation"
      description="Primary navigation, footer groups and call-to-action links."
      path="/globals/navigation"
    />
  )
}
