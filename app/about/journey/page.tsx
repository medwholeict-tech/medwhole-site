import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ButtonPill } from "@/components/ui/button-pill"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/about/journey")

const stages = [
  {
    number: "01",
    stage: "Phase One",
    heading: "Engaged",
    lead: "we establish presence and meet a real need, free and open to everyone. A medical outreach, a summer school programme, a weekly club.",
    body: "",
    image: "/images/library/mg-9074-copy.webp",
    imageAlt: "A MedWHOLE health worker examining a child's upper arm",
  },
  {
    number: "02",
    stage: "Phase Two",
    heading: "Equipped",
    lead: "we build skill and character in the same room, over months rather than in a single workshop.",
    body: "That group became the first cohort of ComPart, our community participation programme. They met fortnightly from February to June, learning graphics and photography, printing and branding, or public health. Every meeting opened with a thirty-minute teaching session.",
    image: "/images/library/dsc09287.webp",
    imageAlt: "A participant writing in a notebook during a group training session",
  },
  {
    number: "03",
    stage: "Phase Three",
    heading: "Deployed",
    lead: "people put what they have gained to work in their own community, with us alongside them.",
    body: "On 7 June they presented their work — designs, media projects and community advocacy plans. The public health stream then ran Operation Keep Kunyami Clean, a sanitation activity they planned and delivered themselves.",
    image: "/images/library/dsc09359.webp",
    imageAlt: "Participants watching a hands-on screen-printing demonstration",
  },
  {
    number: "04",
    stage: "Phase Four",
    heading: "Supported",
    lead: "we stay after the training ends. Grants, mentoring, follow-up, and the next cycle.",
    body: "",
    image: "/images/library/dsc08053.webp",
    imageAlt: "Two MedWHOLE team members carrying a box of supplies between vehicles",
  },
]

export default function MadeWholeJourneyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {/* 1. HERO */}
        <section className="bg-dark-azure text-white" aria-labelledby="journey-hero-heading">
          <div className="page-container py-16 sm:py-20 lg:py-24">
            <div className="max-w-3xl">
              <p className="eyebrow text-amber-flame">Our method</p>
              <h1 id="journey-hero-heading" className="font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
                The Made Whole Journey
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-pale-sky sm:text-xl">
                Our method, in four phases. How every MedWHOLE programme is designed, and what we hold each one to.
              </p>
            </div>
          </div>
        </section>

        {/* 2. WHAT THE JOURNEY IS */}
        <section className="border-b border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="what-is-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              What the method is
            </p>
            <h2 id="what-is-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl">
              How the journey works
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-graphite sm:text-lg sm:leading-8">
              <p>
                The Made Whole Journey is how we design and run our work. It is not a path one person walks. It is the sequence every programme is built to follow, and the test we hold each one to.
              </p>
              <p>
                A programme that engages a community but equips nobody has stopped at the first phase. One that trains people and then leaves them with nowhere to use it has stopped at the second. Naming the four phases lets us say plainly how far a programme has got, and what is still missing.
              </p>
            </div>
          </div>
        </section>

        {/* 3, 4, 5, 6: THE FOUR STAGES */}
        <div className="divide-y divide-grey-azure/50">
          {stages.map((stage, idx) => {
            const isAlternate = idx % 2 !== 0
            return (
              <section
                key={stage.number}
                id={`stage-${stage.number}`}
                className={isAlternate ? "bg-parchment py-16 sm:py-20 lg:py-24" : "bg-white py-16 sm:py-20 lg:py-24"}
                aria-labelledby={`stage-${stage.number}-heading`}
              >
                <div className="grid page-container items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <div className={isAlternate ? "lg:order-2" : "lg:order-1"}>
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-2xl font-bold text-pine-teal sm:text-3xl">
                        {stage.number}
                      </span>
                      <span className="eyebrow text-graphite/70">
                        {stage.stage}
                      </span>
                    </div>
                    <h2
                      id={`stage-${stage.number}-heading`}
                      className="font-heading text-3xl text-dark-azure sm:text-4xl"
                    >
                      {stage.heading}
                    </h2>
                    <p className="mt-5 text-base font-semibold leading-relaxed text-prussian-blue sm:text-lg">
                      {stage.lead}
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-graphite sm:text-lg sm:leading-8">
                      {stage.body}
                    </p>
                  </div>

                  <div className={isAlternate ? "lg:order-1" : "lg:order-2"}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-grey-azure/50 bg-pale-sky">
                      <Image
                        src={stage.image}
                        alt={stage.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )
          })}
        </div>

        {/* 7. THE OUTCOME */}
        <section className="border-t border-grey-azure/50 bg-dark-azure py-16 text-white sm:py-24" aria-labelledby="outcome-heading">
          <div className="page-container page-container--narrow-center text-center">
            <p className="eyebrow text-amber-flame">
              The Outcome
            </p>
            <h2 id="outcome-heading" className="font-heading text-3xl sm:text-4xl lg:text-5xl">{"Kunyami, February to June 2026"}</h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pale-sky sm:text-lg sm:leading-8">{"On 14 February 2026 we ran a free medical outreach in Kunyami, a community with no health facility. Five hundred and six people were seen. Among those who helped run it were young people from the community itself, working the registration desk and the service units."}</p>

            <blockquote className="mt-12 rounded-[4px] border-y border-pale-sky/40 py-8">
              <p className="font-heading text-xl italic text-white sm:text-2xl lg:text-3xl">
                &ldquo;They came as helpers on February 14th. They are now being equipped as leaders.&rdquo;
              </p>
            </blockquote>

            {/* 8. RELATED */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <ButtonPill href="/our-work" variant="outline">Our work</ButtonPill>
              <ButtonPill href="/volunteer" variant="outline">Volunteer</ButtonPill>
              <ButtonPill href="/give" variant="amber">Give</ButtonPill>
            </div>
            <div className="mx-auto mt-12 max-w-2xl border-t border-white/20 pt-8 text-left">
              <ul className="space-y-3">
                <li className="text-base leading-8">{"506 people seen at the outreach"}</li>
                <li className="text-base leading-8">{"8 public health sessions delivered"}</li>
                <li className="text-base leading-8">{"12 completed the cohort"}</li>
              </ul>
              <h3 className="mt-10 font-heading text-2xl text-white sm:text-3xl">{"The Community Innovation Challenge"}</h3>
              <p className="mt-6 text-base leading-8 text-pale-sky sm:text-lg">{"The Challenge runs all four phases inside a single programme. Young adults from Gosa are recruited, trained for two days, mentored for several weeks, pitch solutions to problems they chose themselves, and the strongest proposals receive grants and continued guidance."}</p>
              <p className="mt-6 text-base leading-8 text-pale-sky sm:text-lg">{"Its curriculum pairs a technical skill with a human one every single day. Prototyping with resourcefulness. Costing with financial literacy. Pitching with public speaking. Deadline pressure with managing stress."}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <ButtonPill href="/our-work/empowerment/community-innovation-challenge" variant="dark">{"Community Innovation Challenge"}</ButtonPill>
                <ButtonPill href="/about" variant="dark">{"About"}</ButtonPill>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
