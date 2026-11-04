"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SignOutButton({ className }: { className?: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={className}
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
    >
      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
      Sign out
    </Button>
  )
}
