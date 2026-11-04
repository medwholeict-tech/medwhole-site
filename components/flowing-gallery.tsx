"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { libraryPhotos, libraryPhotoSrc, libraryPhotoHref } from "@/lib/photo-library"

interface FlowingItem {
  id: string
  src: string
  alt: string
  href: string
  aspectRatio: string
  widthClass: string
  sizes: string
}

const galleryLayouts = [
  { aspectRatio: "aspect-[16/10]", widthClass: "w-[300px] sm:w-[380px] lg:w-[440px]", sizes: "(min-width:1024px) 440px, (min-width:640px) 380px, 300px" },
  { aspectRatio: "aspect-[4/5]", widthClass: "w-[210px] sm:w-[260px] lg:w-[300px]", sizes: "(min-width:1024px) 300px, (min-width:640px) 260px, 210px" },
  { aspectRatio: "aspect-[16/9]", widthClass: "w-[340px] sm:w-[420px] lg:w-[480px]", sizes: "(min-width:1024px) 480px, (min-width:640px) 420px, 340px" },
  { aspectRatio: "aspect-[3/4]", widthClass: "w-[200px] sm:w-[250px] lg:w-[290px]", sizes: "(min-width:1024px) 290px, (min-width:640px) 250px, 200px" },
]

// Keep both people and the hands-on activity in frame for these wider scenes.
const wideScenes = new Set(["mg-9074-copy", "dsc09359", "dsc08053"])

const flowingItems: FlowingItem[] = [
  {
    id: "summer-school",
    src: "/images/field-notes/summer-school.jpg",
    alt: "A teacher and children at MedWHOLE Summer School in Gosa",
    href: "/academy/summer-school",
    ...galleryLayouts[0],
  },
  ...libraryPhotos.map((photo, index) => ({
    id: photo.name,
    src: libraryPhotoSrc(photo.name).replace(".webp", "-gallery.webp"),
    alt: photo.alt,
    href: libraryPhotoHref(photo.category),
    ...galleryLayouts[wideScenes.has(photo.name) ? 0 : (index + 1) % galleryLayouts.length],
  })),
  {
    id: "reading-club",
    src: "/IMG-20260805-WA0000.jpg",
    alt: "Children learning together in the reading club",
    href: "/academy/reading-club",
    ...galleryLayouts[3],
  },
]

export function FlowingGallery() {
  const [paused, setPaused] = useState(false)
  return (
    <section
      className="relative overflow-hidden border-t border-grey-azure bg-parchment py-12 sm:py-16 lg:py-[7.5vw]"
      aria-labelledby="flowing-gallery-heading"
    >
      {/* Editorial Section Header */}
      <div className="mx-auto mb-10 max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-pine-teal">
              Field Notes & Moments
            </p>
            <h2
              id="flowing-gallery-heading"
              className="section-heading"
            >
              Life along the Airport Road corridor
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <button type="button" aria-pressed={paused} aria-controls="flowing-gallery-track" onClick={() => setPaused((value) => !value)} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-dark-azure focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pine-teal motion-reduce:hidden">
            {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
            {paused ? "Play gallery" : "Pause gallery"}
          </button>
          <Link
            href="/impact"
            data-no-transition
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-dark-azure transition-colors hover:text-pine-teal sm:text-sm"
          >
            Impact
            <ArrowRight
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
          </div>
        </div>
      </div>

      {/* Infinite Flowing Marquee Track */}
      <div className="flowing-marquee-wrapper group relative w-full overflow-hidden">
        <div id="flowing-gallery-track" data-paused={paused} className="flowing-marquee-track flex w-max items-center">
          {/* First set of items */}
          <div className="flex shrink-0 items-center gap-4 pr-4 sm:gap-6 sm:pr-6">
          {flowingItems.map((item, index) => (
            <FlowingCard key={`flow-1-${item.id}-${index}`} item={item} />
          ))}
          </div>

          {/* Duplicate set of items for seamless infinite loop */}
          <div aria-hidden="true" className="flex shrink-0 items-center gap-4 pr-4 sm:gap-6 sm:pr-6">
          {flowingItems.map((item, index) => (
            <FlowingCard key={`flow-2-${item.id}-${index}`} item={item} aria-hidden />
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FlowingCard({ item, "aria-hidden": ariaHidden }: { item: FlowingItem; "aria-hidden"?: boolean }) {
  return (
    <Link
      href={item.href}
      tabIndex={ariaHidden ? -1 : undefined}
      aria-hidden={ariaHidden}
      data-no-transition
      className={cn(
        "group/card relative block shrink-0 overflow-hidden rounded-[4px] border border-grey-azure/50 bg-pale-sky transition-colors duration-500 hover:border-pine-teal",
        item.aspectRatio,
        item.widthClass
      )}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes={item.sizes}
        loading="lazy"
        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
      />
    </Link>
  )
}
