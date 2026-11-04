import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ButtonPill } from "@/components/ui/button-pill"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/about/team")

const policies = [
  "Safeguarding and child protection",
  "Equal opportunities and non-discrimination",
  "Code of conduct for facilitators and volunteers",
  "Photography and image consent",
]

export default function TeamAndGovernancePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {/* 1. HERO */}
        <section className="bg-dark-azure text-white" aria-labelledby="team-hero-heading">
          <div className="page-container py-16 sm:py-20 lg:py-24">
            <div className="max-w-3xl">
              <p className="eyebrow text-amber-flame">
                Team and governance
              </p>
              <h1 id="team-hero-heading" className="font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Team and governance
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-pale-sky sm:text-xl">
                Who does the work, who holds the decisions, and where our policies sit.
              </p>
            </div>
          </div>
        </section>

        {/* 2. HOW WE ARE GOVERNED */}
        <section className="border-t border-grey-azure/50 bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="governed-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Decision-Making &amp; Oversight
            </p>
            <h2 id="governed-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">{"Board of Trustees"}</h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg">
              <p>{"MedWHOLE is overseen by a Board of Trustees. Every quarter, the board reviews what was spent and on what, the results of clinical safety audits, and the safeguarding log."}</p>
              <p>{"The board sets the organisation's direction and holds its leadership to account for delivering it."}</p>
            </div>
            <div className="mt-10 border-t border-grey-azure/50 pt-8">
              <h3 className="font-heading text-2xl text-dark-azure">{"How decisions are made"}</h3>
              <div className="mt-4 space-y-4 text-base leading-8 text-graphite sm:text-lg">
                <p>{"Programme decisions are made by the General Coordinator with the team leads who will carry them out. Every programme has a budget before it runs, and it is approved before money is spent."}</p><p>{"We adopt a new community only after spending time there first: a courtesy visit to its leaders, any clearances the work needs, and a first piece of work small enough to learn from. That is how Toge began — a visit to the school in March 2026, clearance from the AMAC Local Education Authority in April, and a school health day in June."}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. REGISTRATION AND LEGAL STATUS */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="registration-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Registration
            </p>
            <h2 id="registration-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">
              Registration
            </h2>
            <div className="mt-6 space-y-3 rounded-[4px] border border-grey-azure/50 bg-white p-6 text-sm text-graphite sm:p-8 sm:text-base">
              <p>MedWHOLE Alliance for Health and Development is a registered non-profit organisation in Nigeria, Charity ID 169086.</p>
              <p>Our main office is the MedWHOLE Resource Centre, 7 Nissi Drive, Fort Royal, Nnamdi Azikiwe Airport Road, Kyami District, AMAC, FCT Abuja.</p>
            </div>
          </div>
        </section>

        {/* 6. OUR POLICIES */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="policies-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Standards &amp; Compliance
            </p>
            <h2 id="policies-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">{"Policies"}</h2>
            <ul className="mt-6 space-y-3">
              {policies.map((policy) => (
                <li key={policy} className="flex items-center gap-3 text-base text-graphite sm:text-lg">
                  <span className="h-2 w-2 rounded-full bg-pine-teal" />
                  <span>{policy}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonPill href="/safeguarding" variant="dark">{"Read our safeguarding policy"}</ButtonPill>
              <ButtonPill href="/about/accountability" variant="outline">
                Accountability
              </ButtonPill>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
