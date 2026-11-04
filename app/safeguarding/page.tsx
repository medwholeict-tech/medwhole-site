import { Mail, Phone } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/safeguarding")

const practices = [
  "Written parental consent before any medical intervention involving a child. Before deworming at Summer School in August 2026, consent forms went to the families of every child across both sites.",
  "Refusals are recorded and respected. At the Toge school health intervention in June, three parents declined deworming for their children. The refusals were logged and the children were not treated.",
  "A code of conduct for facilitators, delivered at the start of every programme. The Community Innovation Challenge covered it on the first day of its bootcamp.",
  "Age- and sex-appropriate teaching. At Toge, older girls were taught personal hygiene and how to identify, resist and report abuse or threats. Older boys were taught hygiene, safe toilet practice and the risks of swimming in the river.",
  "Sex education and health hygiene inside Summer School, taught in separate age bands.",
  "Photography consent. No image of a child is published without written consent from a parent or guardian.",
]

export default function SafeguardingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        <section className="bg-dark-azure text-white" aria-labelledby="safeguarding-heading">
          <div className="page-container py-16 sm:py-20 lg:py-24">
            <div className="max-w-3xl">
              <p className="eyebrow text-amber-flame">Safeguarding</p>
              <h1 id="safeguarding-heading" className="font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">Safeguarding</h1>
              <p className="mt-6 text-lg leading-relaxed text-pale-sky sm:text-xl">We work with hundreds of children every week. This is how we protect them.</p>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="commitment-heading">
          <div className="page-container page-container--narrow">
            <h2 id="commitment-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">Our commitment</h2>
            <p className="mt-6 text-base leading-8 text-graphite sm:text-lg">
              More than seven hundred children and teenagers attended our Summer School programme in August 2026. Protecting them is a condition of running the programmes at all, not an add-on to them.
            </p>
          </div>
        </section>

        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="scope-heading">
          <div className="page-container page-container--narrow">
            <h2 id="scope-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">Who this covers</h2>
            <p className="mt-6 text-base leading-8 text-graphite sm:text-lg">
              Every child and vulnerable adult who takes part in a MedWHOLE programme, and every member of staff, facilitator, volunteer and partner who works with them.
            </p>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="practice-heading">
          <div className="page-container page-container--narrow">
            <h2 id="practice-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">What we do in practice</h2>
            <ul className="mt-8 space-y-5">
              {practices.map((practice) => (
                <li key={practice} className="border-t border-grey-azure/50 pt-5 text-base leading-8 text-graphite sm:text-lg">{practice}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="concern-heading">
          <div className="page-container page-container--narrow">
            <h2 id="concern-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">If you are worried about a child</h2>
            <p className="mt-6 text-base leading-8 text-graphite sm:text-lg">
              Tell us straight away. Anyone can raise a concern — a parent, a child, a volunteer, a teacher or a neighbour. If a child is in immediate danger, contact the police first.
            </p>
            <ul className="mt-6 space-y-4 text-base text-graphite sm:text-lg">
              <li className="flex items-center gap-3"><Mail aria-hidden="true" className="h-5 w-5 flex-none text-pine-teal" /><span>Email our Safeguarding Lead — <a href="mailto:safeguarding@medwhole.org" className="font-semibold text-dark-azure underline underline-offset-4">safeguarding@medwhole.org</a></span></li>
              <li className="flex items-center gap-3"><Phone aria-hidden="true" className="h-5 w-5 flex-none text-pine-teal" /><span>Call — <a href="tel:+2348189800001" className="font-semibold text-dark-azure underline underline-offset-4">+234 818 980 0001</a></span></li>
            </ul>
            <p className="mt-6 text-base leading-8 text-graphite sm:text-lg">
              Every report is acknowledged within two hours. We then make sure the child is safe, refer to medical or statutory services where that is needed, and bring in the board&apos;s safeguarding trustee.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
