import Image from "next/image"
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HomeUpdates, HomeUpdatesSkeleton } from "@/components/home-updates"
import { ButtonPill } from "@/components/ui/button-pill"
import { ParallaxImage } from "@/components/parallax-image"
import { HeroTitle } from "@/components/hero-title"
import { CommunityDossier } from "@/components/community-dossier"
import { FlowingGallery } from "@/components/flowing-gallery"
import styles from "./home.module.css"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/")

const impactFigures = [
  { value: "700+", label: "children in free summer school program this August" },
  { value: "506", label: "people seen at one outreach in a community with no clinic" },
  { value: "16", label: "young adults completed skills training" },
  { value: "5", label: "years working in Gosa" },
]
const academyFigures = [
  { value: "450", label: "children at Summer School Gosa, August 2026" },
  { value: "280", label: "a day at Kunyami, in its first year" },
  { value: "200", label: "at the weekly club" },
  { value: "50+", label: "children returned to school since 2021" },
]

function Photo({ src, alt, priority = false, sizes = "(min-width: 760px) 50vw, 100vw" }: { src: string; alt: string; priority?: boolean; sizes?: string }) {
  return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={styles.photo} />
}
function Figures({ figures, className = "" }: { figures: { value: string; label: string }[]; className?: string }) {
  return <dl className={`${styles.figures} ${className}`}>{figures.map(figure => <div key={figure.value}><dt>{figure.value}</dt><dd>{figure.label}</dd></div>)}</dl>
}

const HERO_VIDEO_URL = "https://ik.imagekit.io/hardyonahi/website%20Hero.mp4?updatedAt=1789054113248"
const HERO_POSTER_URL = "https://ik.imagekit.io/hardyonahi/website%20Hero.mp4/ik-thumbnail.jpg"

export default function HomePage() {
  return (
    <div className={styles.home}>
      <SiteHeader />
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="home-heading">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_POSTER_URL}
            className={styles.heroVideo}
            aria-hidden="true"
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
          <div className={styles.heroShade} aria-hidden="true" />
          <div className={styles.heroContent}>
            <HeroTitle lines={["Whole people.", "Lasting impact."]} />
            <div className={`${styles.heroBottom} appear-blur-in`}>
              <p className={styles.heroDescription}>
                MedWHOLE Alliance for Health and Development is a Nigerian non-profit working to restore people and communities through free education, free healthcare and skills training. Our work began in 2021 in Gosa, on the Nnamdi Azikiwe Airport Road in Kyami District, AMAC, FCT Abuja.
              </p>
              <div className={styles.actions}>
                <ButtonPill href="/our-work" variant="outline">See our work</ButtonPill>
                <ButtonPill href="/give" variant="amber">Give</ButtonPill>
              </div>
            </div>
          </div>
        </section>

        {/* 2. EDITORIAL MANIFESTO STATEMENT */}
        <section className={styles.manifesto} aria-labelledby="manifesto-heading">
          <div className={`${styles.manifestoInner} appear-blur-in`}>
            <p className={`${styles.eyebrow} eyebrow text-pine-teal`}>Three pillars, pursued together</p>
            <h2 id="manifesto-heading" className={styles.manifestoTitle}>
              Health, literacy and empowerment are not separate problems, so we do not treat them separately. A child who cannot see the board does not need a better teacher. A mother who cannot read a prescription has not really been treated.
            </h2>
          </div>
        </section>

        {/* 3. 2026 IN NUMBERS */}
        <section className={styles.impact} aria-label="2026 in numbers">
          <Figures figures={impactFigures} className={styles.impactFigures} />
        </section>

        {/* 4. MEDWHOLE ACADEMY */}
        <section className={styles.academy} aria-labelledby="academy-heading">
          <div className={styles.academyShowcase}>
            <div className={`${styles.academyCopy} appear-blur-in`}>
              <p className={`${styles.eyebrow} eyebrow text-pine-teal`}>Featured Work</p>
              <h2 id="academy-heading" className={`${styles.sectionHeading} section-heading`}>MedWHOLE Academy</h2>
              <p className={styles.statement}>Whole child. Whole family. Whole community.</p>
              <p className={styles.academyDescription}>
                The Academy is our largest and longest-running work. It provides free education for children and teenagers in Gosa and Kunyami: holiday lessons every August, a capacity building club that meets weekly through the year, scholarships for out of school children, and coaching for the exams that decide what comes next.
              </p>
              <p className={styles.academyDescription}>
                It began in 2021 with twenty-one children. This August it taught more than seven hundred across two communities.
              </p>
              <div className={styles.ctaWrapper}>
                <ButtonPill href="/academy" variant="dark">Explore the Academy</ButtonPill>
              </div>
            </div>
            <div className={`${styles.academyPhotoWrapper} appear-scale-in`}>
              <ParallaxImage
                src="/images/library/img-5318.webp"
                alt="A facilitator with children gathered in a classroom"
                fill
                sizes="(min-width: 760px) 55vw, 100vw"
                className={styles.photo}
                style={{ position: "absolute", inset: 0 }}
              />
            </div>
          </div>
          <div className={styles.academyFiguresStrip}>
            <Figures figures={academyFigures} className={styles.academyFigures} />
          </div>
        </section>

        {/* 5. HEALTH AND EMPOWERMENT: CLASSY EDITORIAL ROWS */}
        <section className={styles.editorialSection} aria-labelledby="other-work-heading">
          <div className={`${styles.editorialSectionHeading} appear-blur-in`}>
            <p className={`${styles.eyebrow} eyebrow text-pine-teal`}>Pillars in Action</p>
            <h2 id="other-work-heading" className={`${styles.sectionHeading} section-heading`}>Our other work</h2>
            <p>
              Alongside the Academy, we run free medical outreaches in communities without health facilities, and we train young adults who have volunteered with us. The two connect. The volunteers who staffed our February outreach in Kunyami became the first cohort of our skills programme, and twelve of them completed it in June.
            </p>
          </div>

          {/* Row 1: Health */}
          <div className={styles.editorialRow}>
            <div className={`${styles.editorialPhoto} appear-scale-in`}>
              <ParallaxImage
                src="/images/library/mg-9074-copy.webp"
                alt="A MedWHOLE health worker examining a child's upper arm"
                fill
                sizes="(min-width: 760px) 50vw, 100vw"
                className={styles.photo}
                style={{ position: "absolute", inset: 0 }}
              />
            </div>
            <div className={`${styles.editorialCopy} appear-blur-in`}>
              <p className={`${styles.eyebrow} eyebrow text-pine-teal`}>Health</p>
              <h3>Health</h3>
              <p>
                medical outreaches, school health screening, nutrition, and follow-up care after referral
              </p>
              <div className={styles.ctaWrapper}>
                <ButtonPill href="/our-work/health" variant="dark">Health</ButtonPill>
              </div>
            </div>
          </div>

          {/* Row 2: Empowerment */}
          <div className={styles.editorialRow}>
            <div className={`${styles.editorialCopy} appear-blur-in`}>
              <p className={`${styles.eyebrow} eyebrow text-pine-teal`}>Empowerment</p>
              <h3>Empowerment</h3>
              <p>
                skills training, mentorship, and a community innovation challenge with grant funding
              </p>
              <div className={`${styles.ctaWrapper} flex flex-wrap gap-2.5`}>
                <ButtonPill href="/our-work/empowerment" variant="dark">Empowerment</ButtonPill>
                <ButtonPill href="/our-work" variant="dark">All our work</ButtonPill>
              </div>
            </div>
            <div className={`${styles.editorialPhoto} appear-scale-in`}>
              <ParallaxImage
                src="/images/library/dsc08737.webp"
                alt="Participants working at sewing machines during a practical training session"
                fill
                sizes="(min-width: 760px) 50vw, 100vw"
                className={styles.photo}
                style={{ position: "absolute", inset: 0 }}
              />
            </div>
          </div>
        </section>

        <section className={styles.placesSection} aria-labelledby="places-heading">
          <div className={styles.placesInner}>
            <CommunityDossier />
          </div>
        </section>

        {/* 6. A STORY FROM THIS YEAR */}
        <section className={styles.storySection} aria-labelledby="story-heading">
          <div className={styles.storyGrid}>
            <div className={`${styles.storyPhoto} appear-scale-in`}>
              <ParallaxImage
                src="/images/library/mg-9161.webp"
                alt="Illustrative consultation photograph: a MedWHOLE team member speaking with a seated visitor"
                fill
                sizes="(min-width: 760px) 50vw, 100vw"
                className={styles.photo}
                style={{ position: "absolute", inset: 0 }}
              />
            </div>
            <div className={`${styles.storyCopy} appear-blur-in`}>
              <p className={`${styles.eyebrow} eyebrow text-pine-teal`}>A Story from this Year</p>
              <h2 id="story-heading" className={`${styles.sectionHeading} section-heading`}>Seven referrals, seven recoveries</h2>
              <p>
                At a free outreach in Kunyami in February, seven people were found to need surgery. Each was referred to Gibonna Women&apos;s Hospital in Garki, where all seven operations were carried out. All seven recovered without complications.
              </p>
              <p>
                Identifying a case takes a morning. Following it through to recovery takes months, and it is the part that decides whether an outreach mattered.
              </p>
              <div className={styles.ctaWrapper}>
                <ButtonPill href="/our-work/health/continuity-of-care" variant="dark">How we follow up</ButtonPill>
              </div>
            </div>
          </div>
        </section>

        {/* 7. HOW WE WORK: THE MADE WHOLE JOURNEY 4-STAGE PATHWAY */}
        <section className={styles.journeySection} aria-labelledby="how-we-work-heading">
          <div className={`${styles.journeyHeader} appear-blur-in`}>
            <p className={`${styles.eyebrow} eyebrow text-pine-teal`}>Three pillars, pursued together</p>
            <h2 id="how-we-work-heading" className={`${styles.journeyTitle} ${styles.sectionHeading} section-heading`}>The Made Whole Journey</h2>
            <p className={styles.journeyStatement}>
              Health, literacy and empowerment are not separate problems, so we do not treat them separately. A child who cannot see the board does not need a better teacher. A mother who cannot read a prescription has not really been treated. We call our method the Made Whole Journey. Every programme is built to move through four phases — engaged, equipped, deployed, supported — and we judge each one by how far it actually gets.
            </p>
          </div>
          <div className={styles.journeyGrid}>
            {[
              { num: "01", title: "Engaged", text: "We establish presence and meet a real need, free and open to everyone." },
              { num: "02", title: "Equipped", text: "We build skill and character in the same room, over months rather than in a single workshop." },
              { num: "03", title: "Deployed", text: "People put what they have gained to work in their own community, with us alongside them." },
              { num: "04", title: "Supported", text: "We stay after the training ends. Grants, mentoring, follow-up, and the next cycle." },
            ].map((stage, idx) => (
              <div key={stage.num} className={`${styles.journeyCard} appear-blur-in appear-delay-${idx + 1}`}>
                <span className={styles.journeyNumber}>{stage.num}</span>
                <h3>{stage.title}</h3>
                <p>{stage.text}</p>
              </div>
            ))}
          </div>
          <div className={`${styles.journeyCta} appear-blur-in`}>
            <ButtonPill href="/about/journey" variant="dark">The Made Whole journey</ButtonPill>
          </div>
        </section>

        {/* 9. GET INVOLVED */}
        <section className={styles.involvedSection} aria-labelledby="involved-heading">
          <div className={`${styles.involvedHeader} appear-blur-in`}>
            <p className={`${styles.eyebrow} eyebrow text-pine-teal`}>Get Involved</p>
            <h2 id="involved-heading" className={`${styles.sectionHeading} section-heading`}>Three ways to take part</h2>
          </div>
          <div className={styles.involvedCardsGrid}>
            <div className={`${styles.involvedCardOpen} appear-blur-in appear-delay-1`}>
              <div className={`${styles.involvedCardPhoto} appear-scale-in`}>
                <Image src="/IMG-20260805-WA0005.jpg" alt="" fill sizes="(min-width: 760px) 33vw, 100vw" className={styles.photo} />
              </div>
              <div className={styles.involvedCardBody}>
                <div>
                  <h3>Give</h3>
                  <p style={{ marginTop: "8px" }}>Fund a child&apos;s place, an outreach, or a full programme.</p>
                </div>
                <div className="pt-3">
                  <ButtonPill href="/give" variant="amber">Give</ButtonPill>
                </div>
              </div>
            </div>

            <div className={`${styles.involvedCardOpen} appear-blur-in appear-delay-2`}>
              <div className={`${styles.involvedCardPhoto} appear-scale-in`}>
                <Image src="/IMG-20260805-WA0011.jpg" alt="" fill sizes="(min-width: 760px) 33vw, 100vw" className={styles.photo} />
              </div>
              <div className={styles.involvedCardBody}>
                <div>
                  <h3>Volunteer</h3>
                  <p style={{ marginTop: "8px" }}>Teach, mentor, or bring a clinical skill.</p>
                </div>
                <div className="pt-3">
                  <ButtonPill href="/volunteer" variant="dark">Volunteer</ButtonPill>
                </div>
              </div>
            </div>

            <div className={`${styles.involvedCardOpen} appear-blur-in appear-delay-3`}>
              <div className={`${styles.involvedCardPhoto} appear-scale-in`}>
                <Image src="/images/field-notes/empowerment-outcomes.jpg" alt="" fill sizes="(min-width: 760px) 33vw, 100vw" className={styles.photo} />
              </div>
              <div className={styles.involvedCardBody}>
                <div>
                  <h3>Partner</h3>
                  <p style={{ marginTop: "8px" }}>For institutions, companies and funders.</p>
                </div>
                <div className="pt-3">
                  <ButtonPill href="/partner" variant="dark">Partner</ButtonPill>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. LATEST: News and events */}
        <Suspense fallback={<HomeUpdatesSkeleton />}><HomeUpdates /></Suspense>

        <FlowingGallery />
      </main>
      <SiteFooter />
    </div>
  )
}
