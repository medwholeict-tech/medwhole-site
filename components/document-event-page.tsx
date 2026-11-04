import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { BreadcrumbSchema } from "@/components/structured-data"
import { EditorialCopyPage } from "@/components/editorial-copy-page"
import type { WebsiteCopyEvent } from "@/lib/website-copy"

export function DocumentEventPage({ event }: { event: WebsiteCopyEvent }) {
  const page = {
    ...event,
    eyebrow: event.eyebrow,
    subheading: event.standfirst,
    sections: event.sections,
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          ...event.breadcrumb.map((item) => ({ name: item.label, url: item.href })),
          { name: "this event", url: event.path },
        ]}
      />
      <EditorialCopyPage
        page={page}
        beforeHero={
          <div className="border-b border-grey-azure/50 bg-parchment">
            <nav aria-label="Breadcrumb" className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-5 py-3 text-xs font-semibold text-pine-teal sm:px-8">
              {event.breadcrumb.map((item) => (
                <span key={item.href} className="inline-flex items-center gap-1">
                  <Link href={item.href} className="underline-offset-4 hover:underline">{item.label}</Link>
                  <ChevronRight aria-hidden="true" className="h-3 w-3 text-grey-azure" />
                </span>
              ))}
              <span className="text-graphite">this event</span>
            </nav>
          </div>
        }
      />
    </>
  )
}
