import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { websiteCopyEvents } from "@/lib/website-copy"
import { getSourceEvents } from "@/lib/public-content"
import { groupPublishedEvents } from "@/lib/public-page-ux"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/events")

export const revalidate = 3600

export default async function EventsPage() {
  const groups = groupPublishedEvents(await getSourceEvents())

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        <section className="bg-dark-azure text-white" aria-labelledby="events-heading">
          <div className="page-container py-16 sm:py-20 lg:py-24">
            <p className="eyebrow text-amber-flame">News and Events</p>
            <h1 id="events-heading" className="font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">Events</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-pale-sky sm:text-xl">What is coming up, where, and what it costs to attend. Almost always nothing.</p>
          </div>
        </section>
        {([{ heading: "Upcoming events", items: groups.current }, { heading: "Past events", items: groups.past }]).map(({ heading, items }) => (
        <section key={heading} className="py-12 sm:py-16" aria-label={heading}>
          <div className="page-container">
            <h2 className="mb-8 font-heading text-3xl text-dark-azure sm:text-4xl">{heading}</h2>
            {items.length ? <ul className="divide-y divide-grey-azure/50 border-y border-grey-azure/50">
              {items.map((event) => {
                const approved = websiteCopyEvents[event.path.split("/").pop()!]
                const dateLabel = event.date ? new Intl.DateTimeFormat("en-NG", { dateStyle: "long", timeZone: "Africa/Lagos" }).format(new Date(`${event.date}T12:00:00+01:00`)) : ""
                return (
                <li key={event.path}>
                  <Link href={event.path} className="group grid gap-3 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-teal sm:grid-cols-[1fr_auto] sm:items-center sm:py-8">
                    <span>
                      <span className="block meta-label text-pine-teal">{approved?.eyebrow || `Event · ${event.pillar}`}{event.isFree ? " · Free to attend" : ""}</span>
                      <span className="mt-2 block font-heading text-xl leading-snug text-dark-azure sm:text-2xl">{approved?.heading || event.title}</span>
                      <span className="mt-2 block text-sm leading-6 text-graphite sm:text-base">{approved?.subheading || `${dateLabel} · ${event.communities.join(", ")} · ${event.status}`}</span>
                    </span>
                    <ArrowRight aria-hidden="true" className="h-5 w-5 text-pine-teal transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              )})}
            </ul> : <p role="status" className="text-base leading-8 text-graphite">{heading === "Upcoming events" ? "No upcoming events are currently listed. Past events are available below." : "No past events are currently listed."}</p>}
          </div>
        </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  )
}
