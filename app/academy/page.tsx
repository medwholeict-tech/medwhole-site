import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, GraduationCap, HeartHandshake, Sparkles, Award } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { ButtonPill } from "@/components/ui/button-pill"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/academy")

const academyNumbers = [
  { value: "21", label: "children in 2021" },
  { value: "700+", label: "in August 2026" },
  { value: "670", label: "in class on one morning" },
  { value: "5", label: "years running" },
]

const programmes = [
  {
    title: "Summer School",
    desc: "four weeks of free lessons every August, Monday to Thursday mornings. Mathematics, English and reading, plus a skills lab, exams and a closing party.",
    href: "/academy/summer-school",
    icon: BookOpen,
  },
  {
    title: "Good News Club",
    desc: "weekly through the year, in Gosa and Kunyami. Bible lessons, memory verses, songs and activities, with a teenagers' section.",
    href: "/academy/good-news-club",
    icon: Sparkles,
  },
  {
    title: "Library and Reading Club",
    desc: "reading support through the year, including guided practice for computer-based exams.",
    href: "/academy/reading-club",
    icon: Award,
  },
  {
    title: "Back-to-School Scholarship",
    desc: "for children who had dropped out, covering the cost of returning.",
    href: "/academy/scholarship",
    icon: GraduationCap,
  },
  {
    title: "Exam Coaching",
    desc: "WAEC and JAMB preparation for the senior bands.",
    href: "/academy/exam-coaching",
    icon: HeartHandshake,
  },
]

export default function AcademyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {/* 1. EDITORIAL HERO - EXACT CONTENT */}
        <PageHero
          eyebrow="Featured Work"
          title="MedWHOLE Academy"
          description="Whole child. Whole family. Whole community."
          actions={
            <>
              <ButtonPill href="#programmes-heading" variant="outline">See this year&apos;s programmes</ButtonPill>
              <ButtonPill href="#support-the-academy" variant="amber">Give to the Academy</ButtonPill>
            </>
          }
        />

        {/* 2. THE ACADEMY IN NUMBERS */}
        <section className="border-y border-grey-azure/50 bg-parchment py-14 sm:py-20" aria-label="The Academy in Numbers">
          <div className="page-container">
            <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4 lg:divide-x lg:divide-grey-azure/50">
              {academyNumbers.map((num) => (
                <div key={num.label} className="px-4">
                  <p className="font-heading text-4xl sm:text-5xl lg:text-6xl text-dark-azure tracking-tight">
                    {num.value}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-wider text-graphite/75 font-medium">
                    {num.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. WHAT THE ACADEMY IS */}
        <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="what-academy-is">
          <div className="grid page-container items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow text-pine-teal">
                Our Foundation
              </p>
              <h2 id="what-academy-is" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">Five years in Gosa</h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-graphite sm:text-lg sm:leading-8">
                <p>{"The Academy began in 2021 at Christ Word Centre in Gosa, with twenty-one children in a weekly club. The first summer school ran that same year."}</p>
                <p>{"In August 2026 we taught more than seven hundred children across two communities. On a single Thursday morning that month, 670 children and teenagers were in Summer School classes across both sites."}</p>
                <p className="font-medium text-dark-azure">{"Free, and open to every child in the community."}</p>
                <p className="font-medium text-dark-azure">{"No fees, no uniform requirement, no entrance test. A parent does not need to register in advance, and no child is asked what their family believes."}</p>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-grey-azure/50 bg-pale-sky">
              <Image
                src="/images/field-notes/summer-school.jpg"
                alt="Children in classroom during MedWHOLE Academy summer lessons"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* 4. OUR PROGRAMMES */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="programmes-heading">
          <div className="page-container">
            <div className="max-w-2xl">
              <p className="eyebrow text-pine-teal">
                Education Pathways
              </p>
              <h2 id="programmes-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">What the Academy runs</h2>
              <p className="mt-4 text-base text-graphite sm:text-lg">{"Free education for children and teenagers in Gosa and Kunyami. Holiday lessons every August, a club that meets weekly through the year, scholarships for children who had left school, and coaching for the exams that decide what comes next."}</p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {programmes.map((p) => {
                const Icon = p.icon
                return (
                  <Link
                    key={p.title}
                    href={p.href}
                    className="group flex flex-col justify-between rounded-[4px] border border-grey-azure/50 bg-white p-6 transition-all duration-300 hover:border-pine-teal hover:shadow-sm"
                  >
                    <div>
                      <div className="flex size-11 items-center justify-center rounded-[4px] bg-pale-sky/40 text-pine-teal transition-colors group-hover:bg-pine-teal group-hover:text-white">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="mt-6 font-heading text-xl text-dark-azure group-hover:text-pine-teal transition-colors">
                        {p.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-graphite/85">
                        {p.desc}
                      </p>
                    </div>
                    <div className="mt-8 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-pine-teal">
                      <span>Explore</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="mt-12 text-center sm:text-left">
              <ButtonPill href="/our-work/literacy" variant="dark">All Academy programmes</ButtonPill>
            </div>
          </div>
        </section>

        {/* 5. HOW WE TEACH & 6. WHO ATTENDS */}
        <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="how-we-teach-heading">
          <div className="page-container">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* How We Teach */}
              <div>
                <p className="eyebrow text-pine-teal">
                  One morning, one timetable
                </p>
                <h2 id="how-we-teach-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
                  How a day is built
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-graphite sm:text-lg sm:leading-8">
                  <p>
                    A Summer School morning carries mathematics, English and reading, and a memory verse. From the second week a skills lab is added — bead making, soap making, stool making, tote bags, air fresheners. In the final week there are exams, a skills competition, and talks on career, health and mental health.
                  </p>
                  <p>
                    The Health Service team runs deworming inside the same programme, with written parental consent obtained in advance.
                  </p>
                  <p className="font-semibold text-dark-azure">
                    One timetable, carrying reading, a trade, a health check and a conversation about what comes next.
                  </p>
                </div>
              </div>

              {/* Who Attends */}
              <div>
                <p className="eyebrow text-pine-teal">
                  Community Demographics
                </p>
                <h2 className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
                  Primary through senior secondary
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-graphite sm:text-lg sm:leading-8">
                  <p>
                    About forty-three per cent of the children at Gosa Summer School are of secondary-school age. The largest single class band is JSS 1 and 2 — 105 pupils on one morning, more than any primary band on any day.
                  </p>
                  <p>
                    So the Academy is not only a children's programme, and we have stopped describing it as one. Six class bands run at once every morning, from Primary 1 to SS 3.
                  </p>
                </div>

                <div className="mt-8 relative aspect-[16/9] overflow-hidden rounded-[4px] border border-grey-azure/50 bg-pale-sky">
                  <Image
                    src="/IMG-20260805-WA0011.jpg"
                    alt="Teenagers and children gathered in assembly at MedWHOLE Academy"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="mt-12 max-w-3xl border-t border-grey-azure/50 pt-8">
              <h3 className="font-heading text-2xl text-dark-azure sm:text-3xl">{"Where a child can go from here"}</h3>
              <div className="mt-4 space-y-4 text-base leading-8 text-graphite sm:text-lg">
                <p>{"A child who joins Good News Club at seven can move into the teenagers' section, sit in the secondary bands at Summer School, be coached through WAEC, and at eighteen compete in the Community Innovation Challenge with a grant behind their idea."}</p>
                <p>{"That path runs across programmes and across years, in one community. It is the reason the Academy is organised as a cluster rather than a set of separate activities."}</p>
              </div>
              <div className="mt-6">
                <ButtonPill href="/about/journey" variant="dark">{"The Made Whole journey"}</ButtonPill>
              </div>
            </div>
          </div>
        </section>

        {/* 7. TWO COMMUNITIES */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="two-communities-heading">
          <div className="page-container">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="eyebrow text-pine-teal">
                  Geographic Footprint
                </p>
                <h2 id="two-communities-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
                  Gosa and Kunyami
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-graphite sm:text-lg sm:leading-8">
                  <p>{"Summer School has run in Gosa every August since 2021. In 2026 it ran in Kunyami for the first time, at the same time, and Good News Club opened there in February."}</p>
                  <p>{"Kunyami drew 122 children on its first morning and 240 by the fourth. It had not stopped growing when the first week ended. Gosa, in its fifth year, filled to 423 by its second morning and held there."}</p>
                  <p>{"The two curves say different things and both are useful. One is a programme the community already knows. The other is a programme being discovered."}</p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 rounded-[4px] border border-grey-azure/50 bg-white p-6 text-center">
                  <div>
                    <p className="font-heading text-3xl sm:text-4xl text-dark-azure tracking-tight">21 → 305</p>
                    <p className="mt-2 text-xs uppercase tracking-wider text-graphite/75 font-medium">Good News Club Gosa, 2021 to 2026</p>
                  </div>
                  <div className="border-l border-grey-azure/50 pl-4">
                    <p className="font-heading text-3xl sm:text-4xl text-dark-azure tracking-tight">122 → 240</p>
                    <p className="mt-2 text-xs uppercase tracking-wider text-graphite/75 font-medium">Kunyami Summer School, first 4 days</p>
                  </div>
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-grey-azure/50 bg-pale-sky">
                <Image
                  src="/IMG-20260805-WA0007.jpg"
                  alt="Students and volunteers gathered in Kunyami"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <ul className="mt-10 grid gap-4 border-t border-grey-azure/50 pt-8 text-base leading-8 text-graphite sm:grid-cols-2 sm:text-lg">
              <li className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-pine-teal shrink-0" aria-hidden="true" />
                <span>450+ at Gosa, fifth edition</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-pine-teal shrink-0" aria-hidden="true" />
                <span>280 a day at Kunyami, first edition</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-pine-teal shrink-0" aria-hidden="true" />
                <span>190 at Good News Club each week</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-pine-teal shrink-0" aria-hidden="true" />
                <span>168 at the first Kunyami club meeting</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="border-t border-grey-azure/50 bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="academy-counting-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">How we count</p>
            <h2 id="academy-counting-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">Attendance and unique children</h2>
            <p className="mt-6 text-base leading-8 text-graphite sm:text-lg">
              We publish attendance and unique children separately. 670 is a single morning&apos;s attendance across both sites. Gosa&apos;s season figure is 450+; Kunyami&apos;s 2026 Summer School averaged 280 children a day. Where a figure is a registration count rather than an attendance count, this site says so.
            </p>
            <div className="mt-8"><ButtonPill href="/about/accountability" variant="dark">Accountability</ButtonPill></div>
          </div>
        </section>

        {/* 8. SUPPORT THE ACADEMY */}
        <section id="support-the-academy" className="bg-dark-azure py-16 text-white sm:py-24" aria-labelledby="support-heading">
          <div className="page-container page-container--narrow-center text-center">
            <p className="eyebrow text-amber-flame">
              Teach, or fund a place
            </p>
            <h2 id="support-heading" className="font-heading text-3xl sm:text-4xl lg:text-5xl lg:leading-[1.12] tracking-tight">
              Six class groups need six teachers every morning
            </h2>
            <p className="font-heading text-xl text-pale-sky sm:text-2xl mt-4">
              Free, and open to every child in the community.
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pale-sky/90 sm:text-lg sm:leading-8">
              Summer School runs six bands at once in Gosa and five in Kunyami. Every one needs a facilitator, every morning, for four weeks.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <ButtonPill href="/give?designation=MedWHOLE+Academy" variant="amber">Fund a child's place</ButtonPill>
              <ButtonPill href="/volunteer" variant="outline">Volunteer to teach</ButtonPill>
              <ButtonPill href="/partner" variant="outline">Partner with the Academy</ButtonPill>
            </div>
            <div className="mt-12 border-t border-white/20 pt-8">
              <h3 className="font-heading text-2xl text-white sm:text-3xl">{"Latest from the Academy"}</h3>
              <div className="mt-6">
                <ButtonPill href="/news" variant="outline">{"All news and events"}</ButtonPill>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
