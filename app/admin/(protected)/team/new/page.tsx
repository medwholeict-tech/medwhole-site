import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default function NewTeamMemberPage() {
  return (
    <CmsHandoff
      title="Add a team member"
      description="Create the profile in Payload and attach an approved portrait."
      path="/collections/team-members/create"
      backHref="/admin/team"
      backLabel="Back to team members"
    />
  )
}
