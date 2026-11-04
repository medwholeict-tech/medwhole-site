import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { PageHero } from "@/components/page-hero"
import { ButtonPill } from "@/components/ui/button-pill"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/academy/reading-club")

export default function ReadingClubPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {/* 1. EDITORIAL HERO - EXACT CONTENT */}
        <PageHero
          backLink={{ href: "/academy", label: "MedWHOLE Academy" }}
          eyebrow="MedWHOLE Academy"
          title="Library and Reading Club"
          description="Reading support through the year, and guided practice for computer-based exams."
        />

        {/* 2. WHAT IT IS - EXACT CONTENT */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="what-is-heading">
          <div className="page-container page-container--narrow">
            <h2 id="what-is-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              What it is
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg">
              <p>
                The Reading Club runs outside the August programme, as year-round support. It also provides guided practice on computer-based tests for candidates sitting JAMB — four candidates were supported this way in the second quarter of 2026.
              </p>
              <p>
                {"Summer School includes a reading assessment, which is the only literacy measure in our programmes. It means we can report what a child's reading did over four weeks, not only that they attended."}
              </p>
            </div>
          </div>
        </section>

        {/* 3. WHO IT IS FOR - EXACT CONTENT */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="who-heading">
          <div className="page-container page-container--narrow">
            <h2 id="who-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              Who it is for
            </h2>
            <p className="font-heading text-xl text-dark-azure sm:text-2xl mt-4 font-normal">
              Children and teenagers. Free, and open to every child in the community.
            </p>
          </div>
        </section>

        {/* 4. HOW TO JOIN - EXACT CONTENT */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="join-heading">
          <div className="page-container page-container--narrow">
            <h2 id="join-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              How to join
            </h2>
            <p className="mt-6 text-base leading-8 text-graphite sm:text-lg">
              {"The Reading Club is free and there is no sign-up. Ask at the Gosa liaison office, Shop 6, Gosa Shopping Complex, for this term's meeting times, or write to info@medwhole.org."}
            </p>
            <div className="mt-8">
              <ButtonPill href="/contact" variant="dark">Contact us</ButtonPill>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
