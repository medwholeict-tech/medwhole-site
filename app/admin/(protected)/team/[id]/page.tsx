import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default async function EditTeamMemberPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <CmsHandoff
      title="Edit team member"
      description="Open the profile in Payload to update the draft, review the version and publish."
      path={`/collections/team-members/${encodeURIComponent(params.id)}`}
      backHref="/admin/team"
      backLabel="Back to team members"
    />
  )
}
