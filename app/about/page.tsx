import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ButtonPill } from "@/components/ui/button-pill"
import { PageHero } from "@/components/page-hero"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/about")

const figures = [
  {
    value: "Since 2021",
    label: "",
  },
  {
    value: "3",
    label: "communities",
  },
  {
    value: "700+",
    label: "children at Summer School this August",
  },
  {
    value: "506",
    label: "people seen at one outreach",
  },
  {
    value: "7",
    label: "referrals followed through to recovery",
  },
  {
    value: "12",
    label: "young adults through a full skills cohort",
  },
]

const waysWeWork = [
  "Our work is motivated by Christian faith. It shows less in what we say than in how we work, and it has never decided who we serve. Our services are open to everyone, without condition and without regard to faith, background or belief.",
  "Families hand us their children every August, and we keep that trust by asking first and keeping our word. When three parents in Toge declined deworming for their children, the refusals were written down and the children were not treated.",
  "Free does not mean second-rate. When we screened 196 pupils at Toge, we measured them against the standard the World Health Organization uses for school-age children, the same one a well-funded clinic would use.",
  "And we say what we cannot count. Our Toge figures came with a plain note on the limits of our own method. When our registers disagree with each other, we publish the number we can reconcile and explain why. A figure we cannot stand behind does not go on this site.",
  "Seven people found to need surgery at Kunyami were not handed a referral slip and forgotten. We followed each of them to a hospital in Garki and stayed with them until they recovered. That is what care looks like after the outreach has packed up.",
  "None of it is done alone. The Health Service team runs deworming inside the Academy's summer school. Young people who came to help at an outreach became the next cohort we trained. Doctors, teachers, volunteers and community leaders work as one team, and the community is part of it.",
  "When the budget for Toge was cut mid-planning, the team redesigned the day rather than cancelling it, and reached 196 pupils rather than a handful. In Gosa, young adults bring us ideas for their own community's problems and we fund the best of them. We would rather find a better way than repeat a familiar one.",
  "And we answer for all of it. Every figure we publish can be traced to a named community on a named day, and our trustees review spending and safeguarding every quarter.",
]

export default async function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {/* 1. EDITORIAL HERO - EXACT CONTENT */}
        <PageHero
          eyebrow="About MedWHOLE"
          title="Who we are"
          leadParagraph="A Nigerian non-profit restoring people and communities, and staying long enough for the change to hold. Our work began in 2021 in Gosa, on the Nnamdi Azikiwe Airport Road in Kyami District, AMAC, FCT Abuja."
          description="We do not think a person is a single problem to be solved. Health, learning and livelihood arrive together in people's lives, so we work on them together, in the same communities, year after year."
        >
          <p className="mt-4 max-w-3xl text-base leading-8 text-white sm:text-lg">
            {"That conviction is the organisation. Everything else on this page — the three pillars, the method, the governance, the figures below — is how we act on it and how we hold ourselves to it."}
          </p>
        </PageHero>

        {/* 2. STATISTICAL HORIZON - EXACT CONTENT */}
        <section className="border-b border-grey-azure/50 bg-parchment py-14 sm:py-20" aria-label="So far">
          <div className="page-container">
            <p className="eyebrow text-pine-teal">So far</p>
            <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {figures.map((figure) => (
                <div key={figure.value + figure.label} className="border-l-2 border-grey-azure/60 pl-4 sm:pl-5">
                  <dt className="font-heading font-normal text-3xl sm:text-4xl lg:text-5xl tracking-tight text-dark-azure leading-none">
                    {figure.value}
                  </dt>
                  {figure.label ? (
                    <dd className="mt-3 text-xs sm:text-sm leading-5 text-graphite font-content">
                      {figure.label}
                    </dd>
                  ) : null}
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 3. ROOTED IN COMMUNITY - EXACT CONTENT */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white" aria-labelledby="rooted-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">Our first communities</p>
            <h2 id="rooted-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight mt-2">
              Rooted in community
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg font-content">
              <p>
                {"MedWHOLE Alliance for Health and Development is a registered Nigerian non-profit. Our work began in 2021 in Gosa, a community on the Airport Road outside Abuja, with a weekly club for twenty-one children. Today we run education, health and empowerment programmes in Gosa, Kunyami and Toge. These are our first communities."}
              </p>
              <p>
                {"Our work is held in three pillars — health, literacy and empowerment. Each pillar holds programmes. Each programme holds dated events that carry their own numbers. Every figure on this site can be traced down to a named community on a named day."}
              </p>
            </div>
          </div>
        </section>

        {/* 4. WHAT WE MEAN BY WHOLE - EXACT CONTENT */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="whole-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">Our Approach</p>
            <h2 id="whole-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight mt-2">
              What we mean by whole
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg font-content">
              <p>
                {"Need rarely arrives one problem at a time. A family short of money for school fees is usually also a family that cannot easily reach a clinic. So we work on more than one thing at once, and we stay long enough to see what changes."}
              </p>
              <p>
                {"In practice that looks ordinary. A summer school timetable carries mathematics and reading in the morning, a skills lab in the afternoon, and a health talk midweek. The Health Service team runs deworming inside an education programme. The volunteers who staff a medical outreach become the next cohort of a skills course."}
              </p>
            </div>
            <div className="mt-8">
              <ButtonPill href="/about/journey" variant="dark">
                The Made Whole journey
              </ButtonPill>
            </div>
          </div>
        </section>

        {/* 5. WHERE WE ARE GOING - EXACT CONTENT */}
        <section className="bg-dark-azure py-16 sm:py-20 lg:py-24 text-white" aria-labelledby="purpose-heading">
          <div className="page-container">
            <p className="eyebrow text-amber-flame">Our purpose</p>
            <h2 id="purpose-heading" className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight mt-2">
              Where we are going
            </h2>
            <dl className="mt-10 grid gap-8 border-t border-white/20 pt-8 md:grid-cols-3">
              <div>
                <dt className="meta-label text-pale-sky">Vision</dt>
                <dd className="mt-2 text-base leading-8 text-white sm:text-lg font-content">
                  {"A society transformed by whole individuals who serve as lights within their communities."}
                </dd>
              </div>
              <div>
                <dt className="meta-label text-pale-sky">Mission</dt>
                <dd className="mt-2 text-base leading-8 text-white sm:text-lg font-content">
                  {"To improve human development through faith-centred engagement in health, literacy and empowerment, guiding individuals through discipleship and deployment toward sustainable community impact."}
                </dd>
              </div>
              <div>
                <dt className="meta-label text-pale-sky">Core belief</dt>
                <dd className="mt-2 font-heading text-2xl text-white">
                  {"Whole people create lasting impact."}
                </dd>
              </div>
            </dl>
            <p className="mt-10 max-w-4xl border-l-2 border-amber-flame pl-5 text-base leading-8 text-pale-sky sm:text-lg font-content">
              {"We picture communities where people are not only supported but equipped — where the people we have worked with become the leaders, teachers, carers and catalysts their own communities need."}
            </p>
            <p className="mt-4 max-w-4xl text-base leading-8 text-pale-sky sm:text-lg font-content">
              {"So every pillar is pursued in full, every piece of work touches more than one part of a person's life, and everyone we work with is prepared to serve others in turn."}
            </p>
          </div>
        </section>

        {/* 6. WHAT WE BELIEVE, AND HOW WE WORK - EXACT CONTENT */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white" aria-labelledby="work-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">Faith-informed action grounded in excellence.</p>
            <h2 id="work-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight mt-2">
              What we believe, and how we work
            </h2>
            <div className="mt-8 space-y-6 text-base leading-8 text-graphite sm:text-lg font-content">
              {waysWeWork.map((paragraph, index) => (
                <p key={paragraph} className={index === 0 ? "font-medium text-dark-azure sm:text-xl" : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-8 border-l-2 border-pine-teal pl-5 font-heading text-xl italic text-dark-azure sm:text-2xl">
              {"We would rather you saw what we value in the work than read it on a wall."}
            </p>
          </div>
        </section>

        {/* 7. GOVERNANCE - EXACT CONTENT */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="governance-heading">
          <div className="grid page-container gap-10 lg:grid-cols-2 items-center">
            <div>
              <p className="eyebrow text-pine-teal">Governance</p>
              <h2 id="governance-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight mt-2">
                How we are governed
              </h2>
              <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg font-content">
                <p>
                  {"MedWHOLE is overseen by a Board of Trustees and run day to day by the General Coordinator and team leads. Oversight and operations are kept separate."}
                </p>
                <p>
                  {"Every quarter the board reviews what was spent, the results of clinical safety audits, and the safeguarding log. MedWHOLE Alliance for Health and Development is a registered non-profit organisation in Nigeria, Charity ID 169086."}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 lg:pl-10">
              <ButtonPill href="/about/team" variant="dark">Team and governance</ButtonPill>
              <ButtonPill href="/about/accountability" variant="outline">Our accountability</ButtonPill>
              <ButtonPill href="/our-work" variant="outline">Our work</ButtonPill>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
