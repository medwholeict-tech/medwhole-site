import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"
import { ArrowDown, ArrowRight } from "lucide-react"
import { FaithAccessStatement } from "@/components/faith-access-statement"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import type { CopyLink, CopySection, WebsiteCopyPage } from "@/lib/website-copy"
import { getPageVisualSystem, type PageVisual, type PageVisualSystem } from "@/lib/page-visuals"
import { cn } from "@/lib/utils"
import { CopyDirectory } from "@/components/copy-directory"
import { getSourceEvents, programmeDirectory } from "@/lib/public-content"

import { ThreeTierDiagram } from "@/components/three-tier-diagram"
import { ButtonPill } from "@/components/ui/button-pill"

const toneClasses = {
  white: "border-grey-azure/50 bg-white text-graphite",
  parchment: "border-grey-azure/50 bg-parchment text-graphite",
  dark: "border-dark-azure bg-dark-azure text-pale-sky",
  teal: "border-pine-teal bg-pine-teal text-pale-sky",
}

function ActionLinks({ links, inverted = false }: { links: CopyLink[]; inverted?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {links.map((link) => {
        const isGive = link.label.toLowerCase().includes("give") || link.label.toLowerCase().includes("donate")
        const variant = isGive ? "amber" : inverted ? "outline" : "dark"
        return (
          <ButtonPill key={`${link.href}-${link.label}`} href={link.href} variant={variant}>
            {link.label}
          </ButtonPill>
        )
      })}
    </div>
  )
}

function StoryImage({ visual, priority = false, compact = false }: { visual: PageVisual; priority?: boolean; compact?: boolean }) {
  return (
    <figure className={cn("relative overflow-hidden rounded-[4px] bg-pale-sky", compact ? "min-h-64 sm:min-h-80" : "min-h-[22rem] sm:min-h-[30rem]")} data-image-reveal>
      <Image
        src={visual.src}
        alt={visual.alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 48vw"
        className="object-cover transition-transform duration-700 ease-out hover:scale-105"
        style={{ objectPosition: visual.objectPosition }}
      />
    </figure>
  )
}

function PageContents({ page }: { page: WebsiteCopyPage }) {
  const sections = page.sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => section.heading)
  if (!sections.length) return null

  return (
    <nav aria-label="On this page" className="border-b border-grey-azure/50 bg-white">
      <div className="page-container py-6 lg:flex lg:items-start lg:gap-12">
        <p className="shrink-0 eyebrow text-pine-teal">On this page</p>
        <ol className="mt-4 grid flex-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:mt-0 lg:grid-cols-3">
          {sections.map(({ section, index }) => (
            <li key={sectionAnchor(section, index)}>
              <a href={`#${sectionAnchor(section, index)}`} className="group flex items-start gap-3 text-sm font-semibold leading-5 text-dark-azure">
                <span className="font-heading text-base text-grey-azure">{String(index + 1).padStart(2, "0")}</span>
                <span className="border-b border-transparent group-hover:border-pine-teal">{section.heading}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

function sectionAnchor(section: CopySection, index: number) {
  if (section.id) return section.id
  if (!section.heading) return `section-${index + 1}`
  return section.heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function splitCopyItem(item: string) {
  const divider = " — "
  const dividerIndex = item.indexOf(divider)

  if (dividerIndex < 1 || dividerIndex + divider.length >= item.length) {
    return { title: item, detail: undefined }
  }

  return {
    title: item.slice(0, dividerIndex),
    detail: item.slice(dividerIndex + divider.length),
  }
}

function normalizeLabel(value: string) {
  return value.trim().toLocaleLowerCase()
}

function findItemLink(title: string, links: CopyLink[] = []) {
  const normalizedTitle = normalizeLabel(title)
  return links.find((link) => normalizeLabel(link.label) === normalizedTitle)
}

function CopyItems({ items, links = [], inverted }: { items: string[]; links?: CopyLink[]; inverted: boolean }) {
  return (
    <ol className="max-w-4xl border-b border-grey-azure/50">
      {items.map((item, itemIndex) => {
        const { title, detail } = splitCopyItem(item)
        const itemLink = findItemLink(title, links)
        const rowClasses = cn(
          "grid min-h-20 grid-cols-[2rem_1fr] gap-3 border-t px-0 py-5 text-base leading-7 sm:grid-cols-[2.5rem_1fr] sm:gap-5 sm:py-6",
          itemLink && "group rounded-[4px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-flame focus-visible:ring-offset-2",
          inverted ? "border-pale-sky/35 text-white" : "border-grey-azure/50 text-graphite",
          itemLink && (inverted ? "hover:bg-prussian-blue" : "hover:bg-parchment"),
        )
        const content = (
          <>
            <span className={cn("pt-0.5 font-heading text-sm", inverted ? "text-amber-flame" : "text-pine-teal")}>{String(itemIndex + 1).padStart(2, "0")}</span>
            <span className={cn("grid gap-x-6 gap-y-1", itemLink && "grid-cols-[1fr_auto]")}>
              <span>
                <span className={cn("block font-semibold", inverted ? "text-white" : "text-dark-azure")}>{title}</span>
                {detail ? (
                  <span className={cn("mt-1 block text-sm leading-6 sm:text-base sm:leading-7", inverted ? "text-pale-sky" : "text-graphite")}>
                    <span aria-hidden="true">— </span>{detail}
                  </span>
                ) : null}
              </span>
              {itemLink ? (
                <ArrowRight
                  aria-hidden="true"
                  className={cn("mt-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1", inverted ? "text-amber-flame" : "text-pine-teal")}
                />
              ) : null}
            </span>
          </>
        )

        return itemLink ? (
          <li key={item}>
            <Link href={itemLink.href} className={rowClasses}>
              {content}
              <span className="sr-only">Learn more about {title}</span>
            </Link>
          </li>
        ) : (
          <li key={item} className={rowClasses}>{content}</li>
        )
      })}
    </ol>
  )
}

function EditorialSection({ section, index, visual, children }: { section: CopySection; index: number; visual?: PageVisual; children?: ReactNode }) {
  const tone = section.tone ?? "white"
  const architecture = section.heading === "How the work is organised"
  const inverted = tone === "dark" || tone === "teal"
  const linkedItemLabels = new Set(
    (section.items ?? []).flatMap((item) => {
      const { title } = splitCopyItem(item)
      return findItemLink(title, section.buttons) ? [normalizeLabel(title)] : []
    }),
  )
  const remainingButtons = section.buttons?.filter((button) => !linkedItemLabels.has(normalizeLabel(button.label)))

  return (
    <section
      id={sectionAnchor(section, index)}
      className={cn("scroll-mt-24 border-b", toneClasses[tone])}
      data-reveal
    >
      <div className="page-container py-12 sm:py-16 lg:py-20">
        <div className={cn(visual && "grid items-center gap-10 lg:grid-cols-12 lg:gap-16")}>
          {visual && index % 2 === 0 ? (
            <div className="lg:col-span-6"><StoryImage visual={visual} priority={index === 0} compact={architecture} /></div>
          ) : null}
          <div className={cn("max-w-4xl", (section.figures || children) && "max-w-none", visual && "lg:col-span-6")}>
          <div className="mb-5 flex items-center gap-3 meta-label text-grey-azure">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span className={cn("h-px w-10", inverted ? "bg-pale-sky/50" : "bg-grey-azure/70")} />
          </div>
          {section.heading ? (
            <h2
              className={cn(
                "max-w-4xl font-heading text-3xl leading-tight sm:text-4xl lg:text-5xl tracking-tight",
                inverted ? "text-white" : "text-dark-azure",
              )}
            >
              {section.heading}
            </h2>
          ) : null}

          {section.subheading ? (
            <p className={cn("font-heading text-xl sm:text-2xl mt-3 font-normal", inverted ? "text-pale-sky" : "text-dark-azure")}>
              {section.subheading}
            </p>
          ) : null}

          {section.accessLine ? (
            <p className={cn("font-heading text-lg italic sm:text-xl mt-3", inverted ? "text-amber-flame" : "text-pine-teal")}>
              {section.accessLine}
            </p>
          ) : null}

          {section.paragraphs?.length ? (
            <div className={cn("max-w-3xl space-y-5", (section.heading || section.subheading || section.accessLine) && "mt-6")}>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}

          {section.faithStatement ? (
            <div className={cn((section.heading || section.paragraphs?.length) && "mt-8")}>
              <FaithAccessStatement inverted={inverted} />
            </div>
          ) : null}

          {section.items?.length ? (
            <div className={cn((section.heading || section.paragraphs?.length || section.faithStatement) && "mt-8")}>
              <CopyItems items={section.items} links={section.buttons} inverted={inverted} />
            </div>
          ) : null}

          {section.figures?.length ? (
            <dl className={cn("grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4", (section.heading || section.paragraphs?.length) && "mt-10")}>
              {section.figures.map((figure) => (
                <div
                  key={`${figure.value}-${figure.label}`}
                  className={cn("border-t pt-5", inverted ? "border-pale-sky/40" : "border-grey-azure/50")}
                >
                  <dt className={cn("text-xs uppercase tracking-wider font-medium leading-5", inverted ? "text-pale-sky" : "text-graphite")}>{figure.label}</dt>
                  <dd className={cn("order-first mb-2 font-heading text-4xl sm:text-5xl tracking-tight", inverted ? "text-amber-flame" : "text-pine-teal")}>{figure.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {section.quote ? (
            <blockquote
              className={cn(
                "max-w-4xl border-l-2 border-amber-flame pl-6 font-heading text-2xl leading-10 sm:text-3xl",
                (section.heading || section.paragraphs?.length || section.figures?.length) && "mt-10",
                inverted ? "text-white" : "text-dark-azure",
              )}
            >
              {section.quote}
            </blockquote>
          ) : null}

          {remainingButtons?.length ? (
            <div className={cn((section.heading || section.paragraphs?.length || section.items?.length || section.figures?.length || section.quote || section.faithStatement) && "mt-8")}>
              <ActionLinks links={remainingButtons} inverted={inverted} />
            </div>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
          </div>
          {visual && index % 2 !== 0 ? (
            <div className="lg:col-span-6"><StoryImage visual={visual} priority={index === 0} /></div>
          ) : null}
          {architecture ? <div className="lg:col-span-12" data-architecture><ThreeTierDiagram showIntroduction={false} /></div> : null}
        </div>
      </div>
    </section>
  )
}

export async function EditorialCopyPage({ page, beforeHero }: { page: WebsiteCopyPage; beforeHero?: ReactNode }) {
  const visuals = getPageVisualSystem(page.path)
  const events = page.sections.some(section => section.heading === "Upcoming events") ? await getSourceEvents() : []
  const pillar = page.path.includes("/health") ? "Health" : page.path.includes("/literacy") ? "Literacy" : page.path.includes("/empowerment") ? "Empowerment" : undefined
  const upcoming = events.filter(event => event.status !== "Completed" && (!pillar || event.pillar === pillar))
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {beforeHero}
        <EditorialHero page={page} visuals={visuals} />
        <PageContents page={page} />

        {page.sections.map((section, index) => (
          <EditorialSection
            key={`${page.path}-${index}`}
            section={section}
            index={index}
            visual={index === 0 || index === 2 ? visuals.story[index === 0 ? 0 : 1] : undefined}
          >
            {section.heading === "All programmes" || section.heading === "Programmes" ? <CopyDirectory items={programmeDirectory.filter(item => !pillar || item.pillar === pillar)} /> : null}
            {section.heading === "Upcoming events" ? upcoming.length ? <CopyDirectory items={upcoming.slice(0, 5)} events /> : <div><p role="status" className="text-base leading-8">No upcoming events are currently listed.</p><Link href="/events" className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-pine-teal underline underline-offset-4">View past events <ArrowRight aria-hidden="true" className="size-4" /></Link></div> : null}
          </EditorialSection>
        ))}
      </main>
      <SiteFooter />
    </div>
  )
}

function HeroCopy({ page, inverted = true }: { page: WebsiteCopyPage; inverted?: boolean }) {
  return (
    <div className="max-w-4xl">
      <p className={cn("border-l-2 border-amber-flame pl-3 eyebrow", inverted ? "text-white" : "text-pine-teal")}>{page.eyebrow}</p>
      <h1 data-text-reveal className={cn("mt-6 font-heading text-4xl leading-[1.06] sm:text-5xl lg:text-6xl", inverted ? "text-white" : "text-dark-azure")}>{page.heading}</h1>
      <p className={cn("mt-6 max-w-3xl text-lg leading-8 sm:text-xl", inverted ? "text-pale-sky" : "text-graphite")}>{page.subheading}</p>
      {page.buttons?.length ? <div className="mt-8"><ActionLinks links={page.buttons} inverted={inverted} /></div> : null}
    </div>
  )
}

function EditorialHero({ page, visuals }: { page: WebsiteCopyPage; visuals: PageVisualSystem }) {
  if (visuals.layout === "health") {
    return (
      <section className="page-hero-split border-b border-grey-azure/50 bg-dark-azure text-white">
        <div className="page-container grid min-h-[38rem] lg:grid-cols-[minmax(0,1fr)_minmax(28rem,0.9fr)]">
          <div className="flex items-center py-12 sm:py-16 lg:pr-10"><HeroCopy page={page} /></div>
          <div className="relative min-h-[25rem] overflow-hidden lg:min-h-full" data-image-reveal>
            <Image src={visuals.hero.src} alt={visuals.hero.alt} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" style={{ objectPosition: visuals.hero.objectPosition }} />
          </div>
        </div>
      </section>
    )
  }

  if (visuals.layout === "programme" || visuals.layout === "empowerment") {
    return (
      <section className="border-b border-grey-azure/50 bg-parchment">
        <div className="page-container pb-10 pt-12 sm:pt-16 lg:pb-14"><HeroCopy page={page} inverted={false} /></div>
        <div className="relative mx-auto min-h-[26rem] max-w-[100rem] overflow-hidden sm:min-h-[34rem]" data-image-reveal>
          <Image src={visuals.hero.src} alt={visuals.hero.alt} fill priority sizes="100vw" className="object-cover" style={{ objectPosition: visuals.hero.objectPosition }} />
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-[42rem] overflow-hidden border-b border-grey-azure/50 bg-prussian-blue text-white">
      <Image src={visuals.hero.src} alt={visuals.hero.alt} fill priority sizes="100vw" className="object-cover" style={{ objectPosition: visuals.hero.objectPosition }} />
      <div className="absolute inset-0 bg-prussian-blue/75" aria-hidden="true" />
      <div className="page-container relative flex min-h-[42rem] items-end py-12 sm:py-16 lg:py-20">
        <div>
          <HeroCopy page={page} />
          <a href="#page-story" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-white"><ArrowDown aria-hidden="true" className="h-4 w-4" /> Read the story</a>
        </div>
      </div>
      <span id="page-story" className="absolute bottom-0" />
    </section>
  )
}
