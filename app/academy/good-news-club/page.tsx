import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { PageHero } from "@/components/page-hero"
import { ButtonPill } from "@/components/ui/button-pill"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/academy/good-news-club")

const figures = [
  {
    "value": "21 → 305",
    "label": "over five years"
  },
  {
    "value": "190",
    "label": "a week in Gosa"
  },
  {
    "value": "168",
    "label": "on day one in Kunyami"
  },
  {
    "value": "2",
    "label": "communities"
  }
]

export default function GoodNewsClubPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {/* 1. EDITORIAL HERO - EXACT CONTENT */}
        <PageHero
          backLink={{ href: "/academy", label: "MedWHOLE Academy" }}
          eyebrow="MedWHOLE Academy Programme"
          title="Good News Club"
          description="A free weekly club for children and teenagers, in Gosa and Kunyami."
          actions={
            <ButtonPill href="#where-and-when" variant="amber">
              Find your nearest club
            </ButtonPill>
          }
        >
          <p className="mt-6 text-sm text-pale-sky">{"Weekly · Term time · 190 children a week · Free"}</p>
        </PageHero>

        {/* 2. WHAT IT IS */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="what-is-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Overview
            </p>
            <h2 id="what-is-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">
              What it is
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg">
              <p>
                Good News Club meets once a week through the year. Bible lessons, memory verses, songs, learning activities and a light refreshment. There is a separate section for teenagers, the Junior Youth Club.
              </p>
              <p>
                It is where MedWHOLE began. Twenty-one children met at Christ Word Centre in Gosa in 2021. The club now averages 190 children a week.
              </p>
            </div>
          </div>
        </section>

        {/* 3. WHO IT IS FOR */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="who-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Welcome to All
            </p>
            <h2 id="who-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">
              Who it is for
            </h2>
            <p className="font-heading text-xl text-dark-azure sm:text-2xl">
              Free, and open to every child in the community.
            </p>
            <p className="mt-6 text-base leading-8 text-graphite sm:text-lg">{"Children, with a teenagers' section. Free, and open to every child in the community."}</p>
          </div>
        </section>

        {/* 4. WHERE AND WHEN */}
        <section id="where-and-when" className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="schedule-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Weekly Gatherings
            </p>
            <h2 id="schedule-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">
              Where and when
            </h2>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3 text-base leading-7 text-graphite sm:text-lg">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-pine-teal" />
                <span>{"Gosa Primary — weekly, resumed for 2026 on 7 February. Saturdays at 3pm during Summer School."}</span>
              </li>
              <li className="flex items-start gap-3 text-base leading-7 text-graphite sm:text-lg">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-pine-teal" />
                <span>{"Kunyami — weekly since 6 February 2026. Fridays, 4pm to 5pm."}</span>
              </li>
            </ul>
            <div className="mt-10 border-t border-grey-azure/50 pt-8">
              <h3 className="font-heading text-2xl text-dark-azure sm:text-3xl">{"Events"}</h3>
              <ul className="mt-4 space-y-3">
                <li className="text-base leading-8 text-graphite">{"First Kunyami meeting — 6 February 2026, 168 children"}</li>
                <li className="text-base leading-8 text-graphite">{"Gosa 2026 resumption — 7 February 2026, 190 average weekly attendance"}</li>
                <li className="text-base leading-8 text-graphite">{"Fifth anniversary, Gosa — 22 February 2026, All Saints Anglican Church, 305 children and teenagers with 19 teachers and volunteers"}</li>
                <li className="text-base leading-8 text-graphite">{"Film show, Gosa — 21 March 2026, 206 children"}</li>
                <li className="text-base leading-8 text-graphite">{"Film show, Kunyami — 27 March 2026, 85 children"}</li>
              </ul>
            </div>
</div>
        </section>

        {/* 5. RESULTS */}
        <section className="border-t border-grey-azure/50 bg-dark-azure py-16 text-white sm:py-24" aria-labelledby="results-heading">
          <div className="page-container">
            <p className="eyebrow text-amber-flame">
              Longitudinal Impact
            </p>
            <h2 id="results-heading" className="font-heading text-3xl leading-tight text-white sm:text-4xl lg:text-5xl tracking-tight mt-2">
              Five years of the club
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {figures.map((fig) => (
                <div key={fig.label} className="rounded-[4px] border border-white/20 bg-prussian-blue p-7">
                  <p className="font-heading text-4xl sm:text-5xl text-amber-flame tracking-tight">{fig.value}</p>
                  <p className="mt-3 text-xs uppercase tracking-wider text-pale-sky/85 font-medium">{fig.label}</p>
                </div>
              ))}
            </div>

            <blockquote className="mt-12 rounded-[4px] border-y border-white/20 py-8 text-center">
              <p className="font-heading text-2xl italic text-white sm:text-3xl">
                &ldquo;Twenty-one children grew to three hundred and five.&rdquo;
              </p>
            </blockquote>
            <div className="mt-10 space-y-4 border-t border-white/20 pt-8">
              <p className="text-base leading-8 text-pale-sky sm:text-lg">{"Twenty-one children in 2021. Three hundred and five present at the fifth anniversary in 2026."}</p>
              <p className="text-base leading-8 text-pale-sky sm:text-lg">{"In its first year in Kunyami the club drew 168 children on its opening day — close to what Gosa reaches weekly after five years."}</p>
            </div>
</div>
        </section>

        {/* 6. GET INVOLVED */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="involved-heading">
          <div className="page-container page-container--narrow-center text-center">
            <p className="eyebrow text-pine-teal">
              Join Us
            </p>
            <h2 id="involved-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl">
              Get involved
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ButtonPill href="/volunteer?area=teaching" variant="dark">{"Volunteer to teach"}</ButtonPill>
              <ButtonPill href="/give?designation=MedWHOLE+Academy" variant="amber">
                Give
              </ButtonPill>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
