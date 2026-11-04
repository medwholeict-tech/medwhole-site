import Link from "next/link"
import { HeartHandshake } from "lucide-react"
import { ButtonPill } from "@/components/ui/button-pill"

type StorySupportCtaProps = {
  title: string
  sourcePath: string
  eyebrow?: string
}

export function StorySupportCta({
  title,
  sourcePath,
  eyebrow = "Give with purpose",
}: StorySupportCtaProps) {
  const donationUrl = `/give?designation=${encodeURIComponent(title)}&source=${encodeURIComponent(sourcePath)}`

  return (
    <section className="border-t border-grey-azure/50 bg-dark-azure text-white" aria-labelledby="story-support-heading" data-reveal>
      <div className="grid page-container gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow text-amber-flame">{eyebrow}</p>
          <h2 id="story-support-heading" className="font-heading font-normal text-3xl leading-tight sm:text-4xl lg:text-5xl tracking-[-0.03em] mt-3">
            Help this work continue.
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-pale-sky font-content">
            Your gift can help MedWHOLE sustain the people, practical support, and follow-up that make lasting community impact possible.
          </p>
        </div>

        <div className="rounded-[4px] border border-pale-sky/40 bg-prussian-blue px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[4px] bg-amber-flame text-prussian-blue">
              <HeartHandshake aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="meta-label text-ocean-mist">Your gift will reference</p>
              <p className="font-heading font-normal text-xl leading-8 text-white mt-1">{title}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonPill href={donationUrl} variant="amber">
              Give to this work
            </ButtonPill>
            <ButtonPill href="/partner" variant="outline">
              Discuss a partnership
            </ButtonPill>
          </div>
          <p className="mt-5 text-xs leading-6 text-pale-sky/80 border-t border-pale-sky/20 pt-4">
            A gift here pays for a specific thing in a specific community. Choose what it funds.
          </p>
        </div>
      </div>
    </section>
  )
}
