import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { PageHero } from "@/components/page-hero"
import { ButtonPill } from "@/components/ui/button-pill"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/academy/scholarship")

export default function ScholarshipPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {/* 1. EDITORIAL HERO - EXACT CONTENT */}
        <PageHero
          backLink={{ href: "/academy", label: "MedWHOLE Academy" }}
          eyebrow="MedWHOLE Academy"
          title="Back-to-School Scholarship"
          description="For children who had left school, and what it costs to get them back."
        />

        {/* 2. WHAT IT IS - EXACT CONTENT */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="what-is-heading">
          <div className="page-container page-container--narrow">
            <h2 id="what-is-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              What it is
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg">
              <p>
                Most of the children at our Summer School programme are on holiday from their own schools. A few are not enrolled anywhere. The scholarship is for them: it covers what it takes to get a child back into school and keep them there.
              </p>
              <p>More than fifty children have gone back to school through the programme since 2021.</p>
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
              Children of school age in Gosa and Kunyami who are out of school. Free, and open to every child in the community.
            </p>
          </div>
        </section>

        {/* 4. HOW IT WORKS - EXACT CONTENT */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="how-heading">
          <div className="page-container page-container--narrow">
            <h2 id="how-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              How it works
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg">
              <p>
                Some families come to us. Other children we meet through our clubs and our Summer School programme, and find out they are not enrolled anywhere. Either way, we sit down with the family, find out what is keeping the child out of school, and cover what it takes to get them back into a classroom.
              </p>
              <p>Then we stay in touch, because getting a child back is only half of it. Keeping them there is the rest.</p>
              <p>
                To ask about a scholarship, visit the Gosa liaison office, Shop 6, Gosa Shopping Complex, or write to info@medwhole.org.
              </p>
            </div>
            <div className="mt-8">
              <ButtonPill href="/give?designation=Back-to-School+Scholarship" variant="amber">Fund a child&apos;s return to school</ButtonPill>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
