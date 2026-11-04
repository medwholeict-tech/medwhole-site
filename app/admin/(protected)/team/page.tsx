import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default function TeamMembersPage() {
  return (
    <CmsHandoff
      title="Team members"
      description="Leadership and staff profiles, ordered as they should appear on the public site."
      path="/collections/team-members"
    />
  )
}
