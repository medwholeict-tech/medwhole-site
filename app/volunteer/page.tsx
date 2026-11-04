import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { PageHero } from "@/components/page-hero"
import { ButtonPill } from "@/components/ui/button-pill"
import { VolunteerApplicationForm } from "@/components/volunteer-application-form"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/volunteer")

const whereNeeded = [
  {
    role: "Teach",
    details: "Summer School runs six class bands at once in Gosa and five in Kunyami, Monday to Thursday mornings through August",
  },
  {
    role: "Mentor",
    details: "ComPart and the Community Innovation Challenge need facilitators across several weeks",
  },
  {
    role: "Clinical",
    details: "outreaches need consultation, laboratory, nursing, eye care and pharmacy",
  },
  {
    role: "Media",
    details: "photography and video, with consent discipline",
  },
  {
    role: "Logistics",
    details: "registration, triage flow, materials",
  },
]

const whatYouReceive = [
  "Training before you start,",
  "a named person you report to,",
  "and a role rather than a crowd.",
  "Several of our own facilitators began as community volunteers at a single outreach.",
]

export default function VolunteerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {/* 1. EDITORIAL HERO - EXACT CONTENT */}
        <PageHero
          eyebrow="Volunteer"
          title="Volunteer"
          description="Our Summer School programme needs six facilitators every morning in August. That is one of the things we need."
          actions={
            <ButtonPill href="#apply" variant="amber">
              Apply to volunteer
            </ButtonPill>
          }
        />

        {/* 2. WHERE YOU ARE NEEDED - EXACT CONTENT */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="where-needed-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              What we need
            </p>
            <h2 id="where-needed-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              Where you are needed
            </h2>
            <ul className="mt-8 space-y-4">
              {whereNeeded.map((item) => (
                <li key={item.role} className="flex items-start gap-3.5 text-base leading-7 text-graphite sm:text-lg">
                  <span className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-pine-teal" />
                  <span>
                    <strong className="text-dark-azure font-semibold">{item.role}</strong> — {item.details}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. WHAT WE ASK - EXACT CONTENT */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="what-we-ask-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Commitment &amp; Safeguarding
            </p>
            <h2 id="what-we-ask-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              What we ask
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg">
              <p>
                Be honest with yourself about time. Summer School is four weeks of mornings. An outreach is one long day. A ComPart stream is fortnightly for several months.
              </p>
              <p className="font-medium text-dark-azure text-lg">
                We would rather have you for one outreach you turn up to than four weeks you cannot sustain.
              </p>
            </div>
          </div>
        </section>

        {/* 4. WHAT YOU RECEIVE - EXACT CONTENT */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="receive-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              What you get
            </p>
            <h2 id="receive-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              What you get
            </h2>
            <ul className="mt-6 space-y-3">
              {whatYouReceive.map((item) => (
                <li key={item} className="flex items-start gap-3.5 text-base leading-7 text-graphite sm:text-lg">
                  <span className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-pine-teal" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 border-t border-grey-azure/50 pt-8">
              <h3 className="font-heading text-2xl text-dark-azure sm:text-3xl">Safeguarding</h3>
              <p className="mt-4 text-base leading-8 text-graphite sm:text-lg">
                Everyone working with children receives our code of conduct before they start.
              </p>
              <div className="mt-6">
                <ButtonPill href="/safeguarding" variant="dark">
                  Safeguarding
                </ButtonPill>
              </div>
            </div>
          </div>
        </section>

        {/* 5. APPLY - EXACT CONTENT */}
        <section id="apply" className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="apply-heading">
          <div className="page-container page-container--reading">
            <p className="eyebrow text-pine-teal">
              Join Our Team
            </p>
            <h2 id="apply-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              Apply to volunteer
            </h2>
            <p className="mt-4 text-base text-graphite sm:text-lg">
              Application form covering name, contact details, location, role areas of interest, availability by frequency and duration, and your reasons for applying.
            </p>

            <VolunteerApplicationForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
