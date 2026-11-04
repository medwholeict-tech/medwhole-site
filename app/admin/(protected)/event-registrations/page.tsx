import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default function EventRegistrationsPage() {
  redirect("/admin/submissions?inbox=event-registrations")
}
