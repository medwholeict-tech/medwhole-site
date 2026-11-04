import { CmsHandoff } from "@/components/admin/cms-handoff"

export const dynamic = "force-dynamic"

export default function EventsPage() {
  return (
    <CmsHandoff
      title="Events"
      description="Event details, dates, locations, registration links and galleries."
      path="/collections/events"
    />
  )
}
