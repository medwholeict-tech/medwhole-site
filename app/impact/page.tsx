import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { PageHero } from "@/components/page-hero"
import { ButtonPill } from "@/components/ui/button-pill"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/impact")

const impact2026Figures = [
  { value: "506", label: "people seen in one day in a community with no clinic — Kunyami, 14 February 2026", href: "/events/kunyami-health-outreach-feb-2026" },
  { value: "670", label: "children and teenagers in class on one morning — both sites, August 2026", href: "/events/summer-school-gosa-2026" },
  { value: "196", label: "pupils nutritionally screened — Toge, 30 June 2026", href: "/events/toge-school-health-jun-2026" },
  { value: "7", label: "surgeries identified, completed and recovered — February to June 2026", href: "/events/kunyami-health-outreach-feb-2026" },
]

const replicationFigures = [
  { value: "2", label: "communities" },
  { value: "2", label: "programmes replicated" },
  { value: "168", label: "on day one at the new club" },
  { value: "+97%", label: "growth across Kunyami's first week" },
]

const impactStories = [
  { title: "Seven referrals, seven recoveries", detail: "Kunyami to Garki, February to June 2026", href: "/events/kunyami-health-outreach-feb-2026" },
  { title: "Twenty-one children to three hundred and five", detail: "Good News Club, Gosa, 2021 to 2026", href: "/academy/good-news-club" },
  { title: "From the registration desk to a graduation", detail: "ComPart, Kunyami, 2026", href: "/events/compart-graduation-jun-2026" },
]

export default function ImpactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {/* 1. EDITORIAL HERO */}
        <PageHero
          eyebrow="Evidence & Outcomes"
          title="Impact"
          description="Every figure here is dated, sourced, and traceable to a named community on a named day."
          actions={
            <ButtonPill href="#how-we-count" variant="outline">
              How we count
            </ButtonPill>
          }
        />

        {/* 2. HEADLINE FIGURES */}
        <section className="border-b border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="so-far-heading">
          <div className="page-container">
            <p className="eyebrow text-pine-teal">Headline figures</p>
            <h2 id="so-far-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              What the work has done
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {impact2026Figures.map((item) => (
                <Link
                  href={item.href}
                  key={item.label}
                  className="group rounded-[4px] border border-grey-azure/50 bg-white p-7 transition-all duration-300 hover:border-pine-teal hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-teal"
                >
                  <p className="font-heading text-4xl sm:text-5xl lg:text-6xl text-dark-azure tracking-tight transition-transform duration-300 group-hover:-translate-y-0.5">
                    {item.value}
                  </p>
                  <p className="mt-4 text-xs leading-relaxed text-graphite/80 font-medium">
                    {item.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 3. BY PILLAR */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="by-pillar-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              The three pillars
            </p>
            <h2 id="by-pillar-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              Where the work landed
            </h2>
            <div className="mt-10 space-y-6 text-base leading-8 text-graphite sm:text-lg">
              <div className="rounded-[4px] border-l-4 border-pine-teal bg-parchment p-8">
                <h3 className="font-heading text-2xl text-dark-azure">Literacy</h3>
                <p className="mt-3">
                  In August 2026, more than 700 children and teenagers attended free Summer School across two communities. On the Thursday of the first week, 670 were in class at once. Good News Club began with twenty-one children in 2021. Three hundred and five were present at its fifth anniversary in February 2026. More than fifty children have returned to school through the Back-to-School Scholarship since 2021.
                </p>
              </div>

              <div className="rounded-[4px] border-l-4 border-dark-azure bg-parchment p-8">
                <h3 className="font-heading text-2xl text-dark-azure">Health</h3>
                <p className="mt-3">
                  At Kunyami on 14 February 2026 we saw 506 people in a single day: 274 children and 232 adults. The community has no health facility, so for most of them this was the first consultation available to them in their own village. The day produced 697 clinical services — 450 deworming treatments, 136 laboratory investigations, 39 electrocardiograms, 47 eye consultations and 25 pairs of medicated glasses. At Toge on 30 June, 196 pupils were screened and 193 dewormed. Eighteen were undernourished. One teacher was referred for high blood pressure.
                </p>
              </div>

              <div className="rounded-[4px] border-l-4 border-amber-flame bg-parchment p-8">
                <h3 className="font-heading text-2xl text-dark-azure">Empowerment</h3>
                <p className="mt-3">
                  Twelve people completed the first ComPart cohort between February and June 2026, across three learning streams. The public health stream delivered eight sessions and then planned and ran a community sanitation project. The first Community Innovation Challenge ran in Gosa in August 2026. Its outcomes are being compiled.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. REPLICATION */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="replication-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Scalability &amp; Transfer
            </p>
            <h2 id="replication-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              2026: the same model, a second community
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg">
              <p>
                Good News Club and Summer School were both built in Gosa over five years. In 2026 both opened in Kunyami.
              </p>
              <p>
                Good News Club Kunyami drew 168 children to its first meeting on 6 February. Summer School Kunyami drew 122 on its first morning in August and 240 by its fourth — fifty-six per cent of what Gosa reaches in its fifth year, inside one week.
              </p>
              <p className="font-medium text-dark-azure">
                Five years proving it in one community. One year moving it into the next.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {replicationFigures.map((fig) => (
                <div key={fig.label} className="rounded-[4px] border border-grey-azure/50 bg-white p-7 text-center">
                  <p className="font-heading text-4xl sm:text-5xl text-dark-azure tracking-tight">{fig.value}</p>
                  <p className="mt-3 text-xs uppercase tracking-wider text-graphite/75 font-medium">{fig.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="impact-stories-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">Stories</p>
            <h2 id="impact-stories-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">The people behind the figures</h2>
            <ul className="mt-8 divide-y divide-grey-azure/50 border-y border-grey-azure/50">
              {impactStories.map((story) => (
                <li key={story.href}>
                  <Link href={story.href} className="group block py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-teal">
                    <span className="font-heading text-2xl text-dark-azure group-hover:text-pine-teal transition-colors">{story.title}</span>
                    <span className="mt-2 block text-sm text-graphite/80">{story.detail}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-grey-azure/50 bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="impact-reports-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">Reports and downloads</p>
            <h2 id="impact-reports-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">Reports and downloads</h2>
            <ul className="mt-8 divide-y divide-grey-azure/50 border-y border-grey-azure/50">
              {["Quarterly programme reports", "Annual report", "Financial summary", "Organisational profile"].map((report) => (
                <li key={report} className="py-5 text-base text-graphite/90 font-medium">
                  {report === "Annual report" ? "2026 annual report — publishing Q4" : report}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 6. HOW WE COUNT */}
        <section id="how-we-count" className="bg-dark-azure py-16 text-white sm:py-20 lg:py-24" aria-labelledby="count-methodology-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-amber-flame">How we count</p>
            <h2 id="count-methodology-heading" className="font-heading text-3xl leading-tight text-white sm:text-4xl lg:text-5xl tracking-tight">
              Three measures, reported separately
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-pale-sky sm:text-lg">
              <p>
                We publish three measures and never add them together. Unique people counts distinct individuals. Attendances counts visits — the same child on four mornings is four attendances and one person. Services counts what was delivered.
              </p>
              <p>
                Where our own records disagree, we publish the figure we can reconcile and say which one it is. At Toge, our report's column totals did not match its component rows, so this site uses the component sums: 196 screened and 193 dewormed.
              </p>
              <p className="text-white font-medium">{"One measurement limitation is worth naming. Nutritional status at Toge was assessed using BMI-for-Age Z-score, the WHO standard for school-age children, but exact dates of birth were not on record, so each child's age was taken at the midpoint of their stated year. The figures are a close approximation. We are capturing dates of birth from now on."}</p>
            </div>
            <div className="mt-10">
              <ButtonPill href="/about/accountability" variant="amber">
                Accountability
              </ButtonPill>
            </div>
          </div>
        </section>

        {/* 7. WHAT COMES NEXT */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="next-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Future Direction
            </p>
            <h2 id="next-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              What comes next
            </h2>
            <p className="mt-6 text-base leading-8 text-graphite sm:text-lg">
              A health post along the Airport Road corridor. Water, sanitation and river-safety work in Toge. ComPart in more corridor communities. Exact dates of birth captured at every screening so our nutrition figures become exact.
            </p>
          </div>
        </section>

        {/* 10. GET INVOLVED */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="involved-heading">
          <div className="page-container page-container--narrow-center text-center">
            <p className="eyebrow text-pine-teal">
              Partner &amp; Support
            </p>
            <h2 id="involved-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
              Get involved
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ButtonPill href="/give" variant="amber">
                Give
              </ButtonPill>
              <ButtonPill href="/partner" variant="dark">
                Partner with us
              </ButtonPill>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
