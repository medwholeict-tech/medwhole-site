"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { defaultCommunityStories } from "@/lib/community-stories"

export interface CommunityStoryItem {
  id: string
  number: string
  name: string
  kicker: string
  location: string
  headline: string
  description: string
  tags: string[]
  imageSrc: string
  imageAlt: string
  href: string
  ctaLabel: string
  isExpansion?: boolean
}

export function CommunityDossier({ items = defaultCommunityStories }: { items?: CommunityStoryItem[] }) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [announcement, setAnnouncement] = React.useState("")

  React.useEffect(() => {
    if (!api) return
    const update = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
      setAnnouncement("Showing " + api.slidesInView().map((index) => items[index]?.name).filter(Boolean).join(", "))
    }
    update()
    api.on("select", update)
    api.on("reInit", update)
    api.on("slidesInView", update)
    return () => {
      api.off("select", update)
      api.off("reInit", update)
      api.off("slidesInView", update)
    }
  }, [api, items])

  return (
    <div className="w-full text-graphite">
      <div className="mb-8 flex flex-col justify-between gap-6 sm:mb-10 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <h2 id="places-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl">Where we work</h2>
          <p className="mt-4 text-base leading-7 text-graphite">Where our work began: Gosa, Kunyami and Toge, in Kyami District, AMAC, FCT Abuja.</p>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-6 sm:justify-end">
          <Link href="/our-work" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-pine-teal underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pine-teal">All our work <ArrowRight className="size-4" aria-hidden="true" /></Link>
          <div className="flex gap-2">
            <button type="button" onClick={() => api?.scrollPrev()} disabled={!canScrollPrev} aria-label="Previous community" aria-controls="community-stories" className="flex size-11 items-center justify-center rounded-full border border-grey-azure text-dark-azure hover:border-pine-teal hover:bg-pine-teal hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine-teal disabled:cursor-not-allowed disabled:opacity-30"><ArrowLeft className="size-4" aria-hidden="true" /></button>
            <button type="button" onClick={() => api?.scrollNext()} disabled={!canScrollNext} aria-label="Next community" aria-controls="community-stories" className="flex size-11 items-center justify-center rounded-full border border-grey-azure text-dark-azure hover:border-pine-teal hover:bg-pine-teal hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine-teal disabled:cursor-not-allowed disabled:opacity-30"><ArrowRight className="size-4" aria-hidden="true" /></button>
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
      <Carousel setApi={setApi} opts={{ align: "start", containScroll: "trimSnaps" }} aria-label="Community stories" className="w-full min-w-0">
        <CarouselContent id="community-stories" className="-ml-5 sm:-ml-6">
          {items.map((item) => (
            <CarouselItem key={item.id} className="basis-[88%] pl-5 sm:basis-1/2 sm:pl-6 lg:basis-1/3">
              <Link href={item.href} className="group flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pine-teal">
                <div className="relative mb-5 aspect-[16/10] overflow-hidden bg-pale-sky">
                  <Image src={item.imageSrc} alt={item.imageAlt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 88vw" className="object-cover" />
                </div>
                <p className="text-xs leading-5 text-pine-teal">{item.location}</p>
                <h3 className="font-heading text-2xl leading-tight text-dark-azure group-hover:text-pine-teal">{item.name}</h3>
                <p className="mt-3 text-sm leading-7 text-graphite">{item.headline ? item.headline + " " : ""}{item.description}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-pine-teal group-hover:underline">{item.ctaLabel}<ArrowRight className="size-4 shrink-0" aria-hidden="true" /></span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
