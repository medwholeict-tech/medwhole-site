import { AdminShell } from "@/components/admin-shell"

export const metadata = {
  title: "MedWHOLE Admin",
  robots: { index: false, follow: false, noarchive: true },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminShell>{children}</AdminShell>
}
