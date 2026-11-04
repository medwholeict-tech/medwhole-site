"use client"

import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-parchment">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-64">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
