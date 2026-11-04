import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getPastEvents, getUpcomingEvents } from "@/lib/sanity-queries"
import { urlFor } from "@/lib/sanity"
import styles from "./home-updates.module.css"

type HomepageUpdate = {
  id: string
  href: string
  title: string
  imageUrl: string
  imageAlt: string
  category: string
  date: string
}

const fallbackUpdates: HomepageUpdate[] = [
  { id: "summer-school-gosa-2026", href: "/events/summer-school-gosa-2026", title: "Summer School, Gosa 2026", imageUrl: "/images/field-notes/summer-school.jpg", imageAlt: "A teacher and children at MedWHOLE Summer School in Gosa", category: "Literacy", date: "2026-08-31" },
  { id: "summer-school-kunyami-2026", href: "/events/summer-school-kunyami-2026", title: "Summer School, Kunyami 2026", imageUrl: "/IMG-20260805-WA0000.jpg", imageAlt: "Children learning together at MedWHOLE Summer School", category: "Literacy", date: "2026-08-28" },
  { id: "kunyami-health-outreach-feb-2026", href: "/events/kunyami-health-outreach-feb-2026", title: "Kunyami Community Health Outreach", imageUrl: "/images/field-notes/health-outreach.jpg", imageAlt: "Clinical team providing care in Kunyami", category: "Health", date: "2026-02-21" },
]

const dateFormatter = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" })

export async function HomeUpdates() {
  let updates: HomepageUpdate[] = []
  try {
    const [upcoming, past] = await Promise.all([getUpcomingEvents(undefined, 3), getPastEvents(undefined, 3)])
    updates = [...upcoming, ...past].slice(0, 3).map((event: any) => ({
      id: event._id,
      href: `/events/${event.slug.current}`,
      title: event.title,
      imageUrl: event.featuredImage ? urlFor(event.featuredImage).width(1100).height(760).fit("crop").url() : "/images/field-notes/summer-school.jpg",
      imageAlt: event.featuredImage?.alt || event.title,
      category: event.category || "Event",
      date: event.date,
    }))
  } catch {
    // Sanity errors can contain request headers; never log the raw request.
    console.warn("Unable to load homepage events; showing published fallback updates.")
  }
  if (updates.length < 3) updates = fallbackUpdates

  return (
    <section className={styles.updates} aria-labelledby="updates-heading">
      <div className={styles.heading}>
        <div>
          <p className="eyebrow text-pine-teal">Latest Updates</p>
          <h2 id="updates-heading" className="section-heading">News and events</h2>
        </div>
        <Link data-no-transition href="/news" className={styles.all}>All news and events <ArrowRight aria-hidden="true" /></Link>
      </div>
      <div className={styles.grid}>
        {updates.map(update => (
          <article key={update.id} className={styles.article}>
            <Link data-no-transition href={update.href} className={styles.image} aria-label={update.title}><Image src={update.imageUrl} alt={update.imageAlt} fill sizes="(min-width: 760px) 14vw, 36vw" /></Link>
            <div className={styles.copy}>
              <time dateTime={update.date}>{dateFormatter.format(new Date(update.date))}</time>
              <h3><Link data-no-transition href={update.href}>{update.title}</Link></h3>
              <Link data-no-transition href={update.href} className={styles.read}>Read more <ArrowRight aria-hidden="true" /></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
export function HomeUpdatesSkeleton() {
  return <div className="h-32 bg-white" aria-hidden="true" />
}


