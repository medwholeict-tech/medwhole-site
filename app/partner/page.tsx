import { Mail, Phone } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { PageHero } from "@/components/page-hero"
import { ButtonPill } from "@/components/ui/button-pill"
import { PartnerApplicationForm } from "@/components/partner-application-form"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/partner")

const whyPartnerWithUs = [
  {
    title: "What we can show you",
    description: "Five years of delivery in one community, and a model that transferred to a second community in 2026 and worked immediately.",
  },
  {
    title: "What we can show you",
    description: "Good News Club and Summer School were both built in Gosa from 2021. Both opened in Kunyami in 2026. The club drew 168 children to its first meeting; the summer school reached fifty-six per cent of Gosa's fifth-year attendance within its first week.",
  },
  {
    title: "What we can show you",
    description: "That is the answer to the question funders ask before funding scale: does this work anywhere other than where you built it.",
  },
  {
    title: "One outcome, followed through",
    description: "At a free outreach in Kunyami on 14 February 2026, seven people were found to need surgery. Each was referred to Gibonna Women's Hospital in Garki. All seven were operated on. All seven recovered without complications.",
  },
]

const typesOfPartnership = [
  {
    title: "Programme funding",
    description: "fund a named programme or edition",
  },
  {
    title: "Technical",
    description: "clinical, education or monitoring expertise",
  },
  {
    title: "Institutional",
    description: "government, multilateral and regulatory relationships",
  },
  {
    title: "Corporate and CSR",
    description: "Corporate and CSR",
  },
  {
    title: "Faith-based",
    description: "churches and faith networks",
  },
]

const currentPartners = [
  {
    name: "Gibonna Women's Hospital, Garki",
    role: "surgical referral",
  },
  {
    name: "AMAC Local Education Authority",
    role: "clearance for school health work",
  },
  {
    name: "Vine Heritage Home",
    role: "outreach host",
  },
  {
    name: "Child Evangelism Fellowship",
    role: "Vacation Bible School health and welfare outreach",
  },
  {
    name: "Christ Word Centre, Gosa",
    role: "where Good News Club began",
  },
]

const downloads = [
  "Organisational profile",
  "Latest quarterly report",
  "Programme one-pagers",
]

export default function PartnerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {/* 1. EDITORIAL HERO - EXACT CONTENT */}
        <PageHero
          eyebrow="Values & Commitment"
          title="Partner with MedWHOLE"
          description="Faith-informed action grounded in excellence. What partnership looks like, and what it costs."
          actions={
            <ButtonPill href="#start-conversation" variant="amber">
              Request a conversation
            </ButtonPill>
          }
        />

        {/* 2. WHY PARTNER WITH US - EXACT CONTENT */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="why-partner-heading">
          <div className="page-container">
            <div className="max-w-3xl">
              <p className="eyebrow text-pine-teal">
                Credibility &amp; Track Record
              </p>
              <h2 id="why-partner-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
                What we can show you
              </h2>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {whyPartnerWithUs.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-[4px] border border-grey-azure/50 bg-parchment p-6 transition-all duration-300 hover:border-pine-teal"
                >
                  {item.title !== "What we can show you" ? (
                    <h3 className="font-heading text-xl text-dark-azure mb-3">{item.title}</h3>
                  ) : null}
                  <p className="text-sm leading-relaxed text-graphite/90">{item.description}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-base leading-8 text-graphite sm:text-lg">
              {"Most organisations our size can show you the outreach. We can show you what happened to the people in it, months later."}
            </p>

            <ul className="mt-8 grid gap-4 border-t border-grey-azure/50 pt-8 text-base leading-8 text-graphite sm:grid-cols-2 sm:text-lg">
              <li className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-pine-teal shrink-0" aria-hidden="true" />
                <span>5 years in Gosa</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-pine-teal shrink-0" aria-hidden="true" />
                <span>2 programmes replicated in 2026</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-pine-teal shrink-0" aria-hidden="true" />
                <span>3 communities</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-pine-teal shrink-0" aria-hidden="true" />
                <span>506 people seen in one day</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 3. TYPES OF PARTNERSHIP - EXACT CONTENT */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="types-heading">
          <div className="page-container">
            <div className="max-w-3xl">
              <p className="eyebrow text-pine-teal">
                Collaboration Models
              </p>
              <h2 id="types-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
                Types of partnership
              </h2>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {typesOfPartnership.map((t) => (
                <div
                  key={t.title}
                  className="rounded-[4px] border border-grey-azure/50 bg-white p-6 transition-all duration-300 hover:border-pine-teal"
                >
                  <h3 className="font-heading text-xl text-dark-azure">{t.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-graphite/90">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. FUND A PROGRAMME - EXACT CONTENT */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="fund-programme-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Attribution &amp; Ring-Fencing
            </p>
            <h2 id="fund-programme-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              Fund a programme
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg">
              <p>{"Named programmes with costs attached, so a partner can point at something specific."}</p>
            </div>
            <ul className="mt-8 grid gap-4 border-t border-grey-azure/50 pt-8 text-base leading-8 text-graphite sm:text-lg">
              <li className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-pine-teal shrink-0" aria-hidden="true" />
                <span>Community Innovation Challenge — ₦2,000,000 per edition</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-pine-teal shrink-0" aria-hidden="true" />
                <span>Summer School, per site, per season — cost outstanding</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-pine-teal shrink-0" aria-hidden="true" />
                <span>Medical outreach, per day — cost outstanding</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-pine-teal shrink-0" aria-hidden="true" />
                <span>ComPart cohort, start to graduation — cost outstanding</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-pine-teal shrink-0" aria-hidden="true" />
                <span>Health post on the Airport Road corridor — in development</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 5. CURRENT PARTNERS - EXACT CONTENT */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="current-partners-heading">
          <div className="page-container">
            <div className="max-w-3xl">
              <p className="eyebrow text-pine-teal">
                Active Alliances
              </p>
              <h2 id="current-partners-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
                Existing partners
              </h2>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {currentPartners.map((p) => (
                <div key={p.name} className="rounded-[4px] border border-grey-azure/50 bg-white p-6">
                  <h3 className="font-heading text-lg text-dark-azure">{p.name}</h3>
                  <p className="mt-2 text-sm text-pine-teal font-medium">{p.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. HOW WE ACCOUNT FOR FUNDS - EXACT CONTENT */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="account-funds-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Transparency
            </p>
            <h2 id="account-funds-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              How we account for funds
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg">
              <p>Every event records what it did on the day, and those records are what our published figures are built from. Programme budgets are set and approved before delivery, and spending is recorded against them.</p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonPill href="/about/accountability" variant="dark">
                Accountability
              </ButtonPill>
              <ButtonPill href="/about/accountability#how-we-count" variant="outline">
                How we count
              </ButtonPill>
            </div>
          </div>
        </section>

        {/* 7. WORKING WITH US - EXACT CONTENT */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="working-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Values &amp; Inclusivity
            </p>
            <h2 id="working-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              Our faith, and our partners
            </h2>
            <p className="font-heading text-xl text-dark-azure sm:text-2xl mt-3 font-normal">
              Free, and open to everyone in the community.
            </p>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg">
              <p>Our work is motivated by Christian faith. Our services are open to everyone, without condition and without regard to faith, background or belief.</p>
              <p>We work with secular, government and faith-based partners on the same terms, and no beneficiary of a partnership is ever asked what they believe.</p>
            </div>
          </div>
        </section>

        {/* 8. DOWNLOADS - EXACT CONTENT */}
        <section className="border-t border-grey-azure/50 bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="downloads-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Partner Briefings
            </p>
            <h2 id="downloads-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              Downloads
            </h2>
            <div className="mt-8 space-y-4">
              {downloads.map((title) => (
                <div
                  key={title}
                  className="rounded-[4px] border border-grey-azure/50 bg-parchment p-5"
                >
                  <h3 className="font-heading text-base text-dark-azure sm:text-lg">{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. START A CONVERSATION - EXACT CONTENT */}
        <section id="start-conversation" className="border-t border-grey-azure/50 bg-dark-azure py-16 text-white sm:py-24" aria-labelledby="conversation-heading">
          <div className="page-container page-container--reading">
            <p className="eyebrow text-amber-flame">
              Direct Contact
            </p>
            <h2 id="conversation-heading" className="font-heading text-3xl leading-tight text-white sm:text-4xl lg:text-5xl tracking-tight mt-2">
              Talk to us
            </h2>
            <p className="mt-4 text-base leading-relaxed text-pale-sky sm:text-lg">
              Write to our partnerships desk at partner@medwhole.org with a line on who you are and what you have in mind, or call +234 818 980 0001. We will come back to you to arrange a conversation.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 text-sm text-pale-sky">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-flame" />
                <span className="text-white font-medium">Partner Desk:</span>
                <a href="mailto:partner@medwhole.org" className="underline hover:text-white">partner@medwhole.org</a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-flame" />
                <span className="text-white font-medium">Executive Telephone:</span>
                <a href="tel:+2348189800001" className="underline hover:text-white">+234 818 980 0001</a>
              </p>
            </div>

            <PartnerApplicationForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
