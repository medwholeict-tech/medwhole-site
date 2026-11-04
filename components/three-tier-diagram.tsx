import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"

export function ThreeTierDiagram({ showIntroduction = true }: { showIntroduction?: boolean }) {
  return (
    <div className="mt-8 rounded-[4px] border border-grey-azure/50 bg-parchment p-6 sm:p-8 lg:p-10">
      {showIntroduction ? <div className="text-left">
        <p className="eyebrow text-pine-teal">Organizational Architecture</p>
        <h3 className="font-heading text-xl text-dark-azure sm:text-2xl">How the work is organised</h3>
        <p className="mt-2 text-sm text-graphite sm:text-base">
          Three pillars hold the work: health, literacy and empowerment. Under each pillar sit programmes, and under each programme sit dated events that carry their own numbers.
        </p>
      </div> : null}

      <div className="mt-8 space-y-6">
        {/* TIER 1: PILLARS */}
        <div className="rounded-[4px] border border-dark-azure bg-dark-azure p-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/20 pb-3">
            <span className="eyebrow text-amber-flame">Tier 1 · Three Fixed Pillars</span>
            <span className="text-xs text-pale-sky">One per leaf in the logo</span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 text-center sm:text-left">
            <Link href="/our-work/literacy" className="rounded-[4px] bg-dark-azure p-4 transition-colors hover:bg-white/20">
              <span className="text-xs font-bold uppercase text-amber-flame">01. Literacy</span>
              <p className="font-heading text-lg font-bold">MedWHOLE Academy</p>
              <p className="mt-1 text-xs text-pale-sky">700+ children in free Summer School this August</p>
            </Link>
            <Link href="/our-work/health" className="rounded-[4px] bg-dark-azure p-4 transition-colors hover:bg-white/20">
              <span className="text-xs font-bold uppercase text-amber-flame">02. Health</span>
              <p className="font-heading text-lg font-bold">Clinical Care &amp; Systems</p>
              <p className="mt-1 text-xs text-pale-sky">506 people seen · 697 clinical services delivered</p>
            </Link>
            <Link href="/our-work/empowerment" className="rounded-[4px] bg-dark-azure p-4 transition-colors hover:bg-white/20">
              <span className="text-xs font-bold uppercase text-amber-flame">03. Empowerment</span>
              <p className="font-heading text-lg font-bold">Skills &amp; Innovation</p>
              <p className="mt-1 text-xs text-pale-sky">ComPart &amp; Community Innovation Challenge</p>
            </Link>
          </div>
        </div>

        <div className="flex justify-center text-pine-teal">
            <ArrowDown className="h-6 w-6" />
        </div>

        {/* TIER 2: PROGRAMMES */}
        <div className="rounded-[4px] border border-pine-teal/40 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-grey-azure/50 pb-3">
            <span className="eyebrow text-pine-teal">Tier 2 · Programmes</span>
            <span className="text-xs text-graphite">Programmes put the three pillars into practice</span>
          </div>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="font-heading text-sm font-bold text-dark-azure">Literacy Programmes</p>
              <ul className="mt-2 space-y-1.5 text-xs text-graphite">
                <li>• Summer School (holiday lessons)</li>
                <li>• Good News Club (weekly)</li>
                <li>• Library and Reading Club</li>
                <li>• Back-to-School Scholarship</li>
                <li>• Exam Coaching (WAEC &amp; JAMB)</li>
              </ul>
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-dark-azure">Health Programmes</p>
              <ul className="mt-2 space-y-1.5 text-xs text-graphite">
                <li>• Medical Outreaches (free clinics)</li>
                <li>• Nutrition (screening &amp; feeding)</li>
                <li>• School Health (deworming &amp; triage)</li>
                <li>• Continuity of Care (referrals)</li>
                <li>• Health Systems (permanent health post)</li>
              </ul>
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-dark-azure">Empowerment Programmes</p>
              <ul className="mt-2 space-y-1.5 text-xs text-graphite">
                <li>• ComPart (volunteer formation)</li>
                <li>• Community Innovation Challenge (₦2M)</li>
                <li>• Prototyping &amp; Mentorship</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center text-pine-teal">
            <ArrowDown className="h-6 w-6" />
        </div>

        {/* TIER 3: EVENTS */}
        <div className="rounded-[4px] border border-grey-azure/50 bg-parchment p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-grey-azure/50 pb-3">
            <span className="eyebrow text-dark-azure">Tier 3 · Dated &amp; Located Events</span>
            <span className="text-xs text-graphite">Carries the actual numbers and verified field outcomes</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/events/kunyami-health-outreach-feb-2026" className="rounded-[4px] border border-grey-azure/50 bg-white p-3 hover:border-pine-teal transition-colors">
              <p className="text-[11px] font-bold uppercase text-pine-teal">14 Feb 2026 · Kunyami</p>
              <p className="font-heading text-sm font-bold text-dark-azure">Kunyami Health Outreach</p>
              <p className="text-xs text-graphite">506 people seen · 7 surgical referrals</p>
            </Link>
            <Link href="/events/summer-school-gosa-2026" className="rounded-[4px] border border-grey-azure/50 bg-white p-3 hover:border-pine-teal transition-colors">
              <p className="text-[11px] font-bold uppercase text-pine-teal">August 2026 · Gosa</p>
              <p className="font-heading text-sm font-bold text-dark-azure">Summer School Gosa</p>
              <p className="text-xs text-graphite">450+ attendance-days · fifth year</p>
            </Link>
            <Link href="/events/summer-school-kunyami-2026" className="rounded-[4px] border border-grey-azure/50 bg-white p-3 hover:border-pine-teal transition-colors">
              <p className="text-[11px] font-bold uppercase text-pine-teal">August 2026 · Kunyami</p>
              <p className="font-heading text-sm font-bold text-dark-azure">Summer School Kunyami</p>
              <p className="text-xs text-graphite">280 average daily attendance · first edition</p>
            </Link>
            <Link href="/events/toge-school-health-jun-2026" className="rounded-[4px] border border-grey-azure/50 bg-white p-3 hover:border-pine-teal transition-colors">
              <p className="text-[11px] font-bold uppercase text-pine-teal">30 Jun 2026 · Toge</p>
              <p className="font-heading text-sm font-bold text-dark-azure">Toge School Health</p>
              <p className="text-xs text-graphite">196 pupils screened · 193 dewormed</p>
            </Link>
            <Link href="/events/compart-graduation-jun-2026" className="rounded-[4px] border border-grey-azure/50 bg-white p-3 hover:border-pine-teal transition-colors">
              <p className="text-[11px] font-bold uppercase text-pine-teal">June 2026 · Kunyami</p>
              <p className="font-heading text-sm font-bold text-dark-azure">ComPart Graduation</p>
              <p className="text-xs text-graphite">First cohort completed its programme</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
