import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

// Server-side gate for every admin page except /admin/login (which lives
// outside this route group). Mirrors the guard pattern already used on the
// content and submissions pages; the layout guarantees no admin page can be
// rendered without a valid session, even if an individual page forgets to
// check auth.
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!(await auth())?.user) {
    redirect("/admin/login")
  }

  return <>{children}</>
}
