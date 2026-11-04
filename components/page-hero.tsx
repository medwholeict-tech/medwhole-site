import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PageHeroProps {
  eyebrow?: string
  title: string
  description?: string
  leadParagraph?: string
  backLink?: {
    href: string
    label: string
  }
  image?: {
    src: string
    alt: string
    caption?: string
  }
  tone?: "dark" | "parchment" | "teal"
  actions?: React.ReactNode
  children?: React.ReactNode
  className?: string
  meta?: React.ReactNode
}

/**
 * MedWHOLE Editorial Page Hero inspired by Tengile MalaMala:
 * - Macro/micro scale contrast: massive, quiet Libre Baskerville display title
 *   paired with precise, tracked-out micro-eyebrow.
 * - Architectural line height (1.05–1.08), negative letter tracking.
 * - Kinetic word-by-word reveal.
 * - Fluid editorial spacing with generous breathing room.
 * - Seamless integration with ButtonPill action buttons.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  leadParagraph,
  backLink,
  image,
  tone = "dark",
  actions,
  children,
  className,
  meta,
}: PageHeroProps) {
  const isDark = tone === "dark"
  const isTeal = tone === "teal"
  const isParchment = tone === "parchment"

  const surfaceClasses = isDark
    ? "bg-dark-azure text-white"
    : isTeal
      ? "bg-pine-teal text-white"
      : "bg-parchment text-dark-azure border-b border-grey-azure/50"

  const eyebrowColor = isDark || isTeal ? "text-amber-flame" : "text-pine-teal"
  const descColor = isDark || isTeal ? "text-pale-sky" : "text-graphite"
  const titleColor = isDark || isTeal ? "text-white" : "text-dark-azure"
  const backLinkColor = isDark || isTeal ? "text-pale-sky hover:text-white" : "text-pine-teal hover:text-dark-azure"

  const words = title.split(" ")

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-grey-azure/50",
        surfaceClasses,
        className
      )}
      aria-label={title}
    >
      <div
        className={cn(
          "page-container py-16 sm:py-20 lg:py-24",
          image && "grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"
        )}
      >
        <div className="max-w-3xl">
          {backLink && (
            <Link
              href={backLink.href}
              className={cn(
                "mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                backLinkColor
              )}
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              <span>{backLink.label}</span>
            </Link>
          )}

          {eyebrow && (
            <div className="mb-5 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-amber-flame" aria-hidden="true" />
              <p
                className={cn(
                  "text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] font-content",
                  eyebrowColor
                )}
              >
                {eyebrow}
              </p>
            </div>
          )}

          {/* Tengile Dramatic Display Title */}
          <h1
            data-words-reveal
            className={cn(
              "font-heading font-normal leading-[1.06] tracking-[-0.035em] text-balance",
              "text-4xl sm:text-6xl lg:text-7xl xl:text-[4.75rem]",
              titleColor
            )}
          >
            {words.map((word, i) => (
              <span key={i} className="word-mask mr-[0.25em] last:mr-0 inline-block overflow-hidden">
                <span
                  className="word-reveal inline-block"
                  style={{ transitionDelay: `${i * 55}ms` }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          {description && (
            <p
              className={cn(
                "appear-blur-in mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl font-content",
                descColor
              )}
              style={{ transitionDelay: "180ms" }}
            >
              {description}
            </p>
          )}

          {leadParagraph && (
            <p
              className={cn(
                "appear-blur-in mt-4 max-w-2xl text-base leading-8 opacity-90 sm:text-lg font-content",
                isDark || isTeal ? "text-white" : "text-graphite"
              )}
              style={{ transitionDelay: "240ms" }}
            >
              {leadParagraph}
            </p>
          )}

          {meta && <div className="mt-6">{meta}</div>}

          {actions && (
            <div
              className="appear-blur-in mt-8 flex flex-wrap items-center gap-4"
              style={{ transitionDelay: "300ms" }}
            >
              {actions}
            </div>
          )}

          {children}
        </div>

        {image && (
          <div
            data-image-reveal
            className="relative aspect-[16/11] min-h-[22rem] overflow-hidden rounded-[4px] border border-grey-azure/50 bg-pale-sky sm:min-h-[26rem]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="image-hover object-cover transition-transform duration-700 ease-out"
            />
            {image.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-prussian-blue/80 px-4 py-3 text-xs text-pale-sky sm:px-6">
                {image.caption}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
