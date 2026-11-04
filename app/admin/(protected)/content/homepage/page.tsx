import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default function HomepageContentPage() {
  return (
    <CmsHandoff
      title="Homepage content"
      description="Hero video, impact figures, featured stories and the flowing gallery."
      path="/globals/homepage"
    />
  )
}
