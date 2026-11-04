"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  ExternalLink,
  FileText,
  Images,
  Inbox,
  LayoutDashboard,
  Menu,
  Settings,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/admin/sign-out-button"

const menuItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Content", href: "/admin/content", icon: FileText },
  { title: "Media library", href: "/admin/media", icon: Images },
  { title: "Form submissions", href: "/admin/submissions", icon: Inbox },
  { title: "Site settings", href: "/admin/settings", icon: Settings },
]

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        aria-label={isMobileOpen ? "Close admin menu" : "Open admin menu"}
        aria-expanded={isMobileOpen}
        aria-controls="admin-sidebar"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <aside
        id="admin-sidebar"
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-grey-azure bg-white transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-grey-azure p-5">
            <Link
              href="/admin/dashboard"
              className="inline-flex min-h-11 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-pine-teal)]"
              onClick={() => setIsMobileOpen(false)}
            >
              <Image
                src="/icon/Logo Type Dark Azure (With Colours).svg"
                alt="MedWHOLE"
                width={150}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-graphite">Admin</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4" aria-label="Admin sections">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const active = isActivePath(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-[var(--color-dark-azure)] text-white"
                          : "text-graphite hover:bg-parchment hover:text-dark-azure",
                      )}
                    >
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="space-y-2 border-t border-grey-azure p-4">
            <Button asChild variant="outline" className="w-full justify-start" size="sm">
              <Link href="/" target="_blank" rel="noopener noreferrer">
                View website
                <ExternalLink className="ml-auto h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <SignOutButton className="w-full justify-start border border-transparent text-[var(--color-prussian-blue)] hover:border-grey-azure hover:bg-parchment hover:text-[var(--color-dark-azure)]" />
          </div>
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
