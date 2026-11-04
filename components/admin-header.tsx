import { ExternalLink, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/admin/sign-out-button"
import { auth } from "@/lib/auth"
import { cmsAdminUrl } from "@/lib/cms/admin"

export async function AdminHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const session = await auth()
  const cmsUrl = cmsAdminUrl()

  return (
    <header className="sticky top-0 z-10 border-b border-grey-azure bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4 py-4 pl-16 pr-4 sm:pr-6 lg:pl-6">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-dark-azure sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-graphite">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {session?.user?.email && (
            <span className="hidden items-center gap-2 border border-grey-azure px-3 py-1.5 text-xs text-graphite sm:flex">
              <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
              {session.user.email}
            </span>
          )}
          {cmsUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={cmsUrl} target="_blank" rel="noopener noreferrer">
                Open CMS
                <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          )}
          <SignOutButton className="text-graphite hover:bg-parchment hover:text-dark-azure" />
        </div>
      </div>
    </header>
  )
}
