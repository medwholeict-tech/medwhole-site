import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { PageHero } from "@/components/page-hero"
import { ButtonPill } from "@/components/ui/button-pill"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/academy/summer-school")

const attendanceFigures = [
  {
    "value": "700+",
    "label": "children across both sites in August 2026"
  },
  {
    "value": "670",
    "label": "in class on one Thursday morning"
  },
  {
    "value": "2,323",
    "label": "attendance-days in the first week alone"
  },
  {
    "value": "5",
    "label": "editions in Gosa"
  }
]

export default function SummerSchoolPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {/* 1. EDITORIAL HERO - EXACT CONTENT */}
        <PageHero
          backLink={{ href: "/academy", label: "MedWHOLE Academy" }}
          eyebrow="MedWHOLE Academy Programme"
          title="Summer School"
          description="Four weeks of free lessons every August, in Gosa and Kunyami."
          actions={
            <>
              <ButtonPill href="/give?designation=Summer%20School" variant="amber">{"Fund a child's place"}</ButtonPill>
              <ButtonPill href="/volunteer?area=teaching" variant="outline">{"Volunteer to teach"}</ButtonPill>
            </>
          }
        >
          <p className="mt-6 text-sm text-pale-sky">{"Mon–Thu, 9am–12pm · August · Primary 1 to SS 3 · Free"}</p>
        </PageHero>

        {/* 2. WHAT IT IS */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="what-it-is-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Overview
            </p>
            <h2 id="what-it-is-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">
              What it is
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg">
              <p>{"Summer School runs for four weeks every August. Mathematics, English and reading every morning, a memory verse, and from the second week a skills lab in the afternoon. The final week holds exams, a skills and memory verse competition, talks, and a closing party."}</p>
              <p>{"It has run in Gosa every year since 2021. In 2026 it ran in Kunyami for the first time, at the same time."}</p>
              <p>{"Most of the children who come are on holiday from schools that are overcrowded and short of trained teachers. Four weeks of focused teaching in August is how we help close that gap. Some who come are not in school at all, and for them there is the Back-to-School Scholarship."}</p>
            </div>
            <div className="mt-10 space-y-10 border-t border-grey-azure/50 pt-8">
              <div>
                <h3 className="font-heading text-2xl text-dark-azure sm:text-3xl">{"How it works"}</h3>
                <ul className="mt-4 space-y-3">
                  <li className="text-base leading-8 text-graphite">{"Monday to Thursday, 9am to 12pm. Friday is the rest day at Gosa; Saturday at Kunyami."}</li>
                  <li className="text-base leading-8 text-graphite">{"Good News Club runs as the weekend component — Saturdays at 3pm in Gosa, Fridays at 4pm in Kunyami."}</li>
                  <li className="text-base leading-8 text-graphite">{"The skills lab starts in week two."}</li>
                  <li className="text-base leading-8 text-graphite">{"Registration continues into the first week. Attendance builds by word of mouth — Gosa grew thirty-five per cent between its first and second mornings."}</li>
                  <li className="text-base leading-8 text-graphite">{"The Health Service team runs deworming during the programme. Parents give written consent in advance."}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading text-2xl text-dark-azure sm:text-3xl">{"What is taught"}</h3>
                <ul className="mt-4 space-y-3">
                  <li className="text-base leading-8 text-graphite">{"Mathematics"}</li>
                  <li className="text-base leading-8 text-graphite">{"English and reading, with a reading assessment"}</li>
                  <li className="text-base leading-8 text-graphite">{"Memory verse, daily"}</li>
                  <li className="text-base leading-8 text-graphite">{"Skill Lab — bead making, soap making, stool making, and at Gosa tote bags and air fresheners"}</li>
                  <li className="text-base leading-8 text-graphite">{"Health hygiene and sex education, taught in separate age bands"}</li>
                  <li className="text-base leading-8 text-graphite">{"Career Compass, health talks, and at Gosa a mental health talk"}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading text-2xl text-dark-azure sm:text-3xl">{"Events"}</h3>
                <ul className="mt-4 space-y-3">
                  <li className="text-base leading-8 text-graphite">{"Summer School — Gosa 2026, fifth edition, 3–31 August 2026, 450+ pupils"}</li>
                  <li className="text-base leading-8 text-graphite">{"Summer School — Kunyami 2026, first edition, 3–28 August 2026, 280 average daily attendance"}</li>
                </ul>
              </div>
            </div>
</div>
        </section>

        {/* 3. WHO IT IS FOR */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="who-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Eligibility &amp; Reach
            </p>
            <h2 id="who-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">
              Who it is for
            </h2>
            <p className="font-heading text-xl text-dark-azure sm:text-2xl">
              Free, and open to every child in the community.
            </p>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg">
              <p>{"Children and teenagers, from Primary 1 to SS 3. Gosa runs six class bands at once; Kunyami runs five."}</p>
              <p>{"About forty-three per cent of the children at Gosa are of secondary-school age, and JSS 1 and 2 is the largest single band in the school."}</p>
              <p>{"Free, and open to every child in the community."}</p>
            </div>
          </div>
        </section>

        {/* 4. WHERE AND WHEN */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="when-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Schedule &amp; Locations
            </p>
            <h2 id="when-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">
              Where and when
            </h2>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3 text-base leading-7 text-graphite sm:text-lg">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-pine-teal" />
                <span><strong className="text-dark-azure">Gosa</strong> — Monday to Thursday, 9am to 12 noon. Good News Club follows on Saturdays at 3pm.</span>
              </li>
              <li className="flex items-start gap-3 text-base leading-7 text-graphite sm:text-lg">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-pine-teal" />
                <span><strong className="text-dark-azure">Kunyami</strong> — Monday to Thursday, 9am to 12 noon. Good News Club follows on Fridays at 4pm.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 5. RESULTS */}
        <section className="border-t border-grey-azure/50 bg-dark-azure py-16 text-white sm:py-24" aria-labelledby="attendance-heading">
          <div className="page-container">
            <p className="eyebrow text-amber-flame">
              Verified Metrics
            </p>
            <h2 id="attendance-heading" className="font-heading text-3xl leading-tight text-white sm:text-4xl lg:text-5xl tracking-tight mt-2">
              Attendance in 2026
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {attendanceFigures.map((fig) => (
                <div key={fig.label} className="rounded-[4px] border border-white/20 bg-prussian-blue p-7">
                  <p className="font-heading text-4xl sm:text-5xl text-amber-flame tracking-tight">{fig.value}</p>
                  <p className="mt-3 text-xs uppercase tracking-wider text-pale-sky/85 font-medium">{fig.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. HEALTH SERVICES WITHIN SUMMER SCHOOL */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="deworming-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Integrated Health Support
            </p>
            <h2 id="deworming-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">
              Deworming
            </h2>
            <p className="mt-6 text-base leading-8 text-graphite sm:text-lg">
              The Health Service team runs deworming during the programme. Parents give written consent in advance.
            </p>
          </div>
        </section>

        {/* 7. GET INVOLVED */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="involved-heading">
          <div className="page-container page-container--narrow-center text-center">
            <p className="eyebrow text-pine-teal">
              Participate
            </p>
            <h2 id="involved-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl">
              Get involved
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ButtonPill href="/give?designation=Summer%20School" variant="amber">{"Fund a child's place"}</ButtonPill>
              <ButtonPill href="/volunteer?area=teaching" variant="dark">{"Volunteer to teach"}</ButtonPill>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
