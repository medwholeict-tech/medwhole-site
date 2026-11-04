import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { cache } from "react"
import { CmsRichText } from "@/components/cms-rich-text"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react"
import { EventRegistrationForm } from "@/components/event-registration-form"
import { DocumentEventPage } from "@/components/document-event-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { StorySupportCta } from "@/components/story-support-cta"
import { BreadcrumbSchema, EventSchema } from "@/components/structured-data"
import { getEventBySlug } from "@/lib/cms/queries"
import { mediaUrl } from "@/lib/cms/media"
import { generateSEO, metaDescription, siteConfig } from "@/lib/seo"
import { generateApprovedSEO } from "@/lib/approved-seo"
import { websiteCopyEvents } from "@/lib/website-copy"

export const revalidate = 60

interface EventPageProps {
  params: Promise<{
    slug: string
  }>
}

const getEvent = cache(getEventBySlug)

export function generateStaticParams() {
  return Object.keys(websiteCopyEvents).map((slug) => ({ slug }))
}

export async function generateMetadata(props: EventPageProps): Promise<Metadata> {
  const params = await props.params;
  const documentEvent = websiteCopyEvents[params.slug]
  if (documentEvent) {
    return generateApprovedSEO(documentEvent.path, { type: "article" })
  }

  const event = await getEvent(params.slug)
  if (!event) {
    return generateSEO({ title: "Event not found", url: `/events/${params.slug}`, noindex: true })
  }

  const description = metaDescription(event.excerpt || event.description)
  const image = event.featuredImage
    ? mediaUrl(event.featuredImage)!
    : undefined

  return generateSEO({
    title: event.title,
    description,
    image,
    imageAlt: event.featuredImage?.alt || event.title,
    url: `/events/${params.slug}`,
    type: "article",
    publishedTime: event.date,
    modifiedTime: event._updatedAt,
    tags: [event.category, event.status].filter(Boolean),
  })
}

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Africa/Lagos",
})

const timeFormatter = new Intl.DateTimeFormat("en-NG", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Africa/Lagos",
})

export default async function EventPage(props: EventPageProps) {
  const params = await props.params;
  const documentEvent = websiteCopyEvents[params.slug]
  if (documentEvent) return <DocumentEventPage event={documentEvent} />

  const event = await getEvent(params.slug)

  if (!event) notFound()

  const eventDate = new Date(event.date)
  const endDate = event.endDate ? new Date(event.endDate) : null
  const now = new Date()
  const isOngoing = event.status === "ongoing"
  const isPastEvent = event.status === "completed" || (!event.status && (endDate || eventDate) < now)
  const registrationDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null
  const isRegistrationOpen = registrationDeadline ? registrationDeadline > now : !isPastEvent
  const hasStory = event.description || event.content

  const price = !event.isFree && event.price
    ? new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: event.currency || "NGN",
        maximumFractionDigits: 0,
      }).format(event.price)
    : null

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "News, Events and Stories", url: "/news" }, { name: event.title, url: `/events/${params.slug}` }]} />
        <EventSchema
          name={event.title}
          description={metaDescription(event.excerpt || event.description)}
          startDate={event.date}
          endDate={event.endDate}
          location={event.venue || event.location || "FCT Abuja, Nigeria"}
          image={event.featuredImage ? mediaUrl(event.featuredImage)! : siteConfig.ogImage}
          url={`/events/${params.slug}`}
          status={event.status}
        />
        <section className="bg-dark-azure text-white">
          <div className={`grid page-container ${event.featuredImage ? "lg:grid-cols-[0.92fr_1.08fr]" : ""}`}>
            <div className="flex min-h-[34rem] flex-col justify-center py-12 lg:py-20">
              <Link href="/news" className="mb-10 inline-flex w-fit items-center gap-2 text-sm font-semibold text-pale-sky hover:text-white">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Back to news and events
              </Link>

              <div className="meta-label flex flex-wrap items-center gap-2">
                {event.category ? <span className="border border-pale-sky px-3 py-1.5 text-pale-sky">{event.category}</span> : null}
                {isOngoing ? <span className="bg-ocean-mist px-3 py-1.5 text-prussian-blue">Ongoing</span> : null}
                {isPastEvent ? <span className="bg-parchment px-3 py-1.5 text-prussian-blue">Impact story</span> : null}
              </div>

              <h1 className="mt-6 max-w-3xl font-heading text-4xl sm:text-5xl lg:text-6xl">
                {event.title}
              </h1>
              {event.excerpt ? <p className="mt-6 max-w-2xl text-lg leading-8 text-pale-sky">{event.excerpt}</p> : null}

              <div className="mt-8 grid gap-3 text-sm text-pale-sky sm:grid-cols-2">
                <p className="flex items-start gap-2">
                  <Calendar aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-amber-flame" />
                  <span>{isOngoing ? "Started " : ""}{dateFormatter.format(eventDate)}</span>
                </p>
                {event.location ? (
                  <p className="flex items-start gap-2">
                    <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-amber-flame" />
                    <span>{event.location}</span>
                  </p>
                ) : null}
                {event.schedule ? (
                  <p className="flex items-start gap-2 sm:col-span-2">
                    <Clock aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-amber-flame" />
                    <span>{event.schedule}</span>
                  </p>
                ) : null}
              </div>
            </div>

            {event.featuredImage ? (
              <div data-image-reveal className="relative m-5 min-h-[26rem] overflow-hidden rounded-[4px] bg-pale-sky lg:my-8 lg:mr-8 lg:min-h-[36rem]">
                <Image
                  src={mediaUrl(event.featuredImage)!}
                  alt={event.featuredImage.alt || event.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 54vw, 100vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-prussian-blue/80 px-5 py-4 text-sm text-pale-sky sm:px-8">
                  A MedWHOLE story from {event.location || "the community"}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {hasStory ? (
          <section className="bg-white" aria-labelledby="what-happened-heading" data-reveal>
            <div className="grid page-container gap-8 py-16 sm:py-20 lg:grid-cols-[0.36fr_0.64fr] lg:py-24">
              <div>
                <p className="eyebrow text-pine-teal">The story</p>
                <h2 id="what-happened-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl">What happened</h2>
              </div>
              <div className="max-w-3xl">
                {event.description ? <p className="font-heading text-xl leading-9 text-dark-azure sm:text-2xl">{event.description}</p> : null}
                {event.content ? (
                  <div className="prose prose-lg mt-7 max-w-none text-graphite prose-p:leading-8">
                    <CmsRichText value={event.content} />
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {event.storyMoments?.length ? (
          <section className="bg-white" aria-labelledby="moments-heading" data-reveal>
            <div className="page-container py-16 sm:py-20 lg:py-24">
              <div className="max-w-2xl">
                <p className="eyebrow text-pine-teal">Inside the story</p>
                <h2 id="moments-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl">Moments that shaped the day</h2>
              </div>

              <div className="mt-10 space-y-10 lg:space-y-16">
                {event.storyMoments.map((moment: any, index: number) => (
                  <figure key={moment.id || index} className="grid items-center gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:gap-12">
                    <div data-image-reveal className={`relative aspect-[4/3] overflow-hidden rounded-[4px] bg-pale-sky ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                      <Image
                        src={mediaUrl(moment.image)!}
                        alt={moment.image?.alt || moment.title || event.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 62vw, 100vw"
                      />
                    </div>
                    <figcaption className={index % 2 === 1 ? "lg:order-1" : ""}>
                      <p className="eyebrow text-pine-teal">Moment {String(index + 1).padStart(2, "0")}</p>
                      {moment.title ? <h3 className="font-heading text-2xl text-dark-azure sm:text-3xl">{moment.title}</h3> : null}
                      {moment.caption ? <p className="mt-4 text-base leading-8 text-graphite">{moment.caption}</p> : null}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {event.impactFigures?.length ? (
          <section className="bg-dark-azure text-white" aria-labelledby="outcomes-heading" data-reveal>
            <div className="page-container py-12 sm:py-16">
              <div className="grid gap-8 lg:grid-cols-[0.32fr_0.68fr]">
                <div>
                  <p className="eyebrow text-ocean-mist">Accountable impact</p>
                  <h2 id="outcomes-heading" className="font-heading text-3xl sm:text-4xl">Key outcomes</h2>
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                  {event.impactFigures.map((figure: any) => (
                    <div key={figure._key} className="border-t border-pale-sky/40 pt-4">
                      <dt className="text-sm leading-6 text-pale-sky">{figure.label}</dt>
                      <dd className="order-first mb-2 metric-value text-amber-flame">{figure.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>
        ) : null}

        {event.communityContext || event.whyItMatters ? (
          <section className="bg-white" aria-labelledby="context-heading" data-reveal>
            <div className="grid page-container gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
              {event.communityContext ? (
                <article className="border-t-2 border-pine-teal pt-6">
                  <p className="eyebrow text-pine-teal">Community context</p>
                  <h2 id="context-heading" className="font-heading text-3xl text-dark-azure">The place behind the story</h2>
                  <p className="mt-5 text-base leading-8 text-graphite">{event.communityContext}</p>
                </article>
              ) : null}
              {event.whyItMatters ? (
                <article className="border-t-2 border-amber-flame pt-6">
                  <p className="eyebrow text-pine-teal">Beyond the activity</p>
                  <h2 className="font-heading text-3xl text-dark-azure">Why it matters</h2>
                  <p className="mt-5 text-base leading-8 text-graphite">{event.whyItMatters}</p>
                </article>
              ) : null}
            </div>
          </section>
        ) : null}

        {isOngoing && event.participation ? (
          <section className="bg-pine-teal text-white" aria-labelledby="participate-heading" data-reveal>
            <div className="grid page-container gap-10 py-16 sm:py-20 lg:grid-cols-[0.55fr_0.45fr]">
              <div>
                <p className="eyebrow text-ocean-mist">Ongoing programme</p>
                <h2 id="participate-heading" className="font-heading text-3xl sm:text-4xl">How to participate</h2>
                {event.participation.description ? <p className="mt-5 max-w-2xl text-lg leading-8 text-pale-sky">{event.participation.description}</p> : null}
                {event.schedule ? (
                  <p className="mt-7 flex items-center gap-3 font-semibold text-white">
                    <Clock aria-hidden="true" className="h-5 w-5 text-amber-flame" />
                    {event.schedule}
                  </p>
                ) : null}
              </div>
              {event.participation.steps?.length ? (
                <ul className="space-y-4 border-t border-ocean-mist/60 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  {event.participation.steps.map((step: string) => (
                    <li key={step} className="flex gap-3 text-pale-sky">
                      <span className="mt-1 flex h-6 w-6 flex-none items-center justify-center bg-amber-flame text-prussian-blue">
                        <Check aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <span className="leading-7">{step}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="bg-parchment" aria-labelledby="details-heading" data-reveal>
          <div className="grid page-container gap-8 py-16 sm:py-20 lg:grid-cols-[0.36fr_0.64fr]">
            <div>
              <p className="eyebrow text-pine-teal">Practical information</p>
              <h2 id="details-heading" className="font-heading text-3xl text-dark-azure">Event details</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="border-t border-grey-azure pt-4">
                <p className="text-sm font-semibold text-dark-azure">Date and time</p>
                <p className="mt-2 text-sm leading-7 text-graphite">{dateFormatter.format(eventDate)}</p>
                {endDate ? <p className="text-sm leading-7 text-graphite">to {dateFormatter.format(endDate)}</p> : null}
                {event.schedule ? <p className="text-sm leading-7 text-graphite">{event.schedule}</p> : event.showTime !== false ? <p className="text-sm leading-7 text-graphite">{timeFormatter.format(eventDate)}</p> : null}
              </div>
              <div className="border-t border-grey-azure pt-4">
                <p className="text-sm font-semibold text-dark-azure">Location</p>
                <p className="mt-2 text-sm leading-7 text-graphite">{event.venue || event.location || "Contact MedWHOLE for venue information"}</p>
              </div>
              <div className="border-t border-grey-azure pt-4">
                <p className="text-sm font-semibold text-dark-azure">Participation</p>
                <p className="mt-2 text-sm leading-7 text-graphite">{event.isFree ? "Free" : price || "Contact the organiser"}</p>
                {event.capacity ? <p className="flex items-center gap-2 text-sm leading-7 text-graphite"><Users aria-hidden="true" className="h-4 w-4" /> Capacity: {event.capacity}</p> : null}
                {isPastEvent ? <p className="text-sm leading-7 text-graphite">This event has ended.</p> : null}
              </div>
              <div className="border-t border-grey-azure pt-4">
                <p className="text-sm font-semibold text-dark-azure">Contact</p>
                {event.contactEmail ? <a href={`mailto:${event.contactEmail}`} className="mt-2 flex items-center gap-2 text-sm leading-7 text-pine-teal hover:text-dark-azure"><Mail aria-hidden="true" className="h-4 w-4" />{event.contactEmail}</a> : null}
                {event.contactPhone ? <a href={`tel:${event.contactPhone}`} className="flex items-center gap-2 text-sm leading-7 text-pine-teal hover:text-dark-azure"><Phone aria-hidden="true" className="h-4 w-4" />{event.contactPhone}</a> : null}
              </div>
              {event.requiresRegistration && !isPastEvent && isRegistrationOpen && event.registrationType === "external" && event.registrationUrl ? (
                <div className="sm:col-span-2">
                  <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-[4px] bg-amber-flame px-6 font-semibold text-prussian-blue hover:bg-white">
                    Register now <ExternalLink aria-hidden="true" className="h-4 w-4" />
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {event.requiresRegistration && event.registrationType === "custom" && event.registrationForm?.fields && !isPastEvent && isRegistrationOpen ? (
          <section className="bg-white py-16 sm:py-20 lg:py-24">
            <div id="registration-form" className="page-container page-container--reading">
              <EventRegistrationForm
                eventId={event._id}
                eventTitle={event.title}
                fields={event.registrationForm.fields}
                submitButtonText={event.registrationForm.submitButtonText}
                successMessage={event.registrationForm.successMessage}
              />
            </div>
          </section>
        ) : null}

        {event.closingReflection ? (
          <section className="border-t border-grey-azure/50 bg-white" aria-labelledby="reflection-heading" data-reveal>
            <div className="page-container page-container--narrow-center py-16 sm:py-20 lg:py-24 text-center">
              <p className="eyebrow text-pine-teal">Looking forward</p>
              <h2 id="reflection-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">The story continues</h2>
              <p className="mt-6 font-heading text-xl leading-9 text-graphite sm:text-2xl">{event.closingReflection}</p>
            </div>
          </section>
        ) : null}

        <StorySupportCta title={event.title} sourcePath={`/events/${params.slug}`} eyebrow={isOngoing ? "Sustain this programme" : "Continue the impact"} />
      </main>
      <SiteFooter />
    </div>
  )
}
