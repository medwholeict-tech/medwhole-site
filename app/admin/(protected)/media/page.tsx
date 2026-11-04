import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default function MediaWorkspacePage() {
  return (
    <CmsHandoff
      title="Media library"
      description="Images, video and documents with alternative text, categories and consent details."
      path="/collections/media"
    />
  )
}
