import { Mail } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ButtonPill } from "@/components/ui/button-pill"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/about/accountability")

export default function AccountabilityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {/* 1. HERO */}
        <section className="bg-dark-azure text-white" aria-labelledby="accountability-hero-heading">
          <div className="page-container py-16 sm:py-20 lg:py-24">
            <div className="max-w-3xl">
              <p className="eyebrow text-amber-flame">Accountability</p>
              <h1 id="accountability-hero-heading" className="font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Accountability
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-pale-sky sm:text-xl">
                How money is managed, how work is reported, and how to raise a concern.
              </p>
            </div>
          </div>
        </section>

        {/* 2. HOW WE COUNT */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="how-we-count-heading">
          <div className="page-container page-container--narrow">
              <p className="eyebrow text-pine-teal">How we count</p>
            <h2 id="how-we-count-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">
              How we count
            </h2>
            <div className="mt-6 space-y-6 text-base leading-8 text-graphite sm:text-lg">
              <p>
                Every event records what it did on the day. Those records add up to programme totals, programme totals to pillar totals, and pillar totals to the figures on our home page. Nothing is estimated upward.
              </p>
              <p>
                We publish three separate measures and never add them together. Unique people counts distinct individuals. Attendances counts every visit, which means the same child on four mornings is four attendances and one person. Services counts what was delivered — a deworming dose, a laboratory test, a pair of glasses.
              </p>
              <p>
                Where our own records disagree, we publish the figure we can reconcile and say so. At Toge in June, our report's column totals did not match its component rows, so this site uses the component sums: 196 pupils screened and 193 dewormed.
              </p>
            </div>
          </div>
        </section>

        {/* 3. FINANCIAL MANAGEMENT */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="financial-mgmt-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">How money is managed</p>
            <h2 id="financial-mgmt-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">
              How money is managed
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg">
              <p>Every programme has a budget before it runs, and spending is recorded against it. The Board of Trustees reviews expenditure every quarter.</p>
              <p>Money given for a named programme is spent on that programme. A gift that is not designated goes where the need is greatest at the time.</p>
            </div>
          </div>
        </section>

        {/* 4. REPORTS AND DOWNLOADS */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="reports-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">Reports and downloads</p>
            <h2 id="reports-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">
              Reports and Downloads
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Quarterly programme reports", "Annual report", "Financial summary", "Organisational profile"].map((report) => (
                <li key={report} className="border-t border-grey-azure py-4 font-heading text-lg text-dark-azure">{report}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. COMPLAINTS AND FEEDBACK */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="feedback-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">
              Direct Communication
            </p>
            <h2 id="feedback-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">
              Complaints and Feedback
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-graphite sm:text-lg">
              <p>
                If something we have done has gone wrong, we want to know. Write to info@medwhole.org and tell us what happened, where and when.
              </p>
              <div className="rounded-[4px] border border-grey-azure/50 bg-white p-6 sm:p-8">
                <p className="font-heading text-xl font-bold text-dark-azure">Raising a concern</p>
                <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-dark-azure">
                  <Mail className="h-4 w-4 text-pine-teal" />
                  <a href="mailto:safeguarding@medwhole.org" className="hover:text-pine-teal hover:underline">
                    safeguarding@medwhole.org
                  </a>
                </p>
                <p className="mt-4 text-sm leading-6 text-graphite">
                  A concern about the safety of a child or a vulnerable adult goes straight to our Safeguarding Lead at safeguarding@medwhole.org.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <ButtonPill href="/contact" variant="dark">Contact us</ButtonPill>
                  <ButtonPill href="/safeguarding" variant="dark">Safeguarding</ButtonPill>
                </div>
              </div>
              <p className="text-base leading-8 text-graphite sm:text-lg">{"We work with hundreds of children every week. Written parental consent comes before any medical procedure, refusals are recorded and respected, every facilitator receives a code of conduct, and no child's photograph is published without a parent's written permission."}</p>
            </div>
          </div>
        </section>

        {/* 6. REGISTRATION */}
        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="registration-heading">
          <div className="page-container page-container--narrow">
            <p className="eyebrow text-pine-teal">Registration</p>
            <h2 id="registration-heading" className="font-heading text-3xl leading-tight text-dark-azure sm:text-4xl">
              Registration
            </h2>
            <div className="mt-6 space-y-2 rounded-[4px] border border-grey-azure/50 bg-parchment p-6 text-sm text-graphite sm:text-base">
              <p>MedWHOLE Alliance for Health and Development is a registered non-profit organisation in Nigeria, Charity ID 169086, based at the MedWHOLE Resource Centre, 7 Nissi Drive, Fort Royal, Nnamdi Azikiwe Airport Road, Kyami District, AMAC, FCT Abuja.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
