import { Handshake, Heart, Users } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { PageHero } from "@/components/page-hero"
import { ButtonPill } from "@/components/ui/button-pill"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/get-involved")

const waysToParticipate = [
  {
    id: "give",
    title: "Give",
    copy: "Fund a child's place, an outreach day, or a full programme.",
    btnLabel: "Give",
    btnHref: "/give",
    variant: "amber" as const,
    icon: Heart,
  },
  {
    id: "volunteer",
    title: "Volunteer",
    copy: "Teach, mentor, or bring a clinical skill.",
    btnLabel: "Volunteer",
    btnHref: "/volunteer",
    variant: "dark" as const,
    icon: Users,
  },
  {
    id: "partner",
    title: "Partner",
    copy: "For institutions, companies and funders.",
    btnLabel: "Partner",
    btnHref: "/partner",
    variant: "dark" as const,
    icon: Handshake,
  },
]

export default function GetInvolvedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {/* 1. EDITORIAL HERO - EXACT CONTENT */}
        <PageHero
          eyebrow="Participation Pathways"
          title="Get involved"
          description="Three ways in."
        />

        {/* 2. GIVE, VOLUNTEER, PARTNER - EXACT CONTENT */}
        <section className="bg-white py-16 sm:py-20 lg:py-28" aria-label="Ways to take part">
          <div className="page-container">
            <div className="grid gap-8 md:grid-cols-3">
              {waysToParticipate.map((way, index) => {
                const Icon = way.icon
                const num = String(index + 1).padStart(2, "0")
                return (
                  <div
                    key={way.id}
                    className="group flex flex-col justify-between rounded-[4px] border border-grey-azure/50 bg-parchment p-8 sm:p-10 transition-all duration-300 hover:border-pine-teal hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-3xl text-dark-azure/35 font-normal">
                          {num}
                        </span>
                        <div className="flex size-12 items-center justify-center rounded-[4px] bg-dark-azure text-white transition-colors group-hover:bg-pine-teal">
                          <Icon className="size-6 text-amber-flame" />
                        </div>
                      </div>

                      <div className="mt-8">
                        <h2 className="font-heading text-3xl text-dark-azure tracking-tight sm:text-4xl">
                          {way.title}
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-graphite/90 sm:text-lg">
                          {way.copy}
                        </p>
                      </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-grey-azure/40">
                      <ButtonPill href={way.btnHref} variant={way.variant}>
                        {way.btnLabel}
                      </ButtonPill>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 3. NOT SURE YET - EXACT CONTENT */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="not-sure-heading">
          <div className="page-container page-container--narrow">
            <div className="rounded-[4px] border border-grey-azure/50 bg-white p-8 sm:p-12">
              <p className="eyebrow text-pine-teal">
                Open Dialogue
              </p>
              <h2 id="not-sure-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl tracking-tight mt-2">
                Not sure yet
              </h2>
              <p className="mt-4 text-base leading-relaxed text-graphite sm:text-lg">
                {"Sponsorship and community support sit inside Partner. Mentorship sits inside Volunteer. For anything that does not fit, contact us."}
              </p>
              <div className="mt-8">
                <ButtonPill href="/contact" variant="dark">
                  Contact us
                </ButtonPill>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
