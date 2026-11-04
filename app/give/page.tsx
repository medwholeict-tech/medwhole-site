import Link from "next/link"
import { CheckCircle2, Building2, ShieldCheck, Mail, ArrowRight, HeartHandshake } from "lucide-react"
import { DonationIntentForm } from "@/components/donation-intent-form"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { ButtonPill } from "@/components/ui/button-pill"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/give")

const designations = [
  {
    "title": "Summer School",
    "desc": "A child's place at Summer School for four weeks"
  },
  {
    "title": "Medical Outreaches",
    "desc": "A free medical outreach day in a community with no clinic"
  },
  {
    "title": "Continuity of Care",
    "desc": "A surgical referral followed through to recovery"
  },
  {
    "title": "Back-to-School Scholarship",
    "desc": "A child's return to school through the scholarship"
  }
]

const bankAccounts = [
  { currency: "NGN", name: "Fidelity Bank", number: "4011482641", type: "Naira Account" },
  { currency: "USD", name: "Fidelity Bank", number: "5250381250", type: "US Dollar Domiciliary" },
  { currency: "GBP", name: "Fidelity Bank", number: "5250381346", type: "British Pound Domiciliary" },
]

const afterYouGive = [
  "You receive a receipt",
  "Your gift goes to the programme you designated",
  "We will not add you to a marketing list",
  "Programme reporting is published on the Impact page",
]

const otherWaysToGive = [
  "Bank transfer, including US dollar and pound sterling accounts",
  "In-kind — books, materials, medical supplies, equipment",
  "Corporate and CSR giving"
]

export default async function GivePage(
  props: {
    searchParams?: Promise<{ amount?: string; designation?: string; source?: string; community?: string }>
  }
) {
  const searchParams = await props.searchParams;
  const requestedAmount = searchParams?.amount
  const initialAmount = requestedAmount && /^\d+(?:\.\d{1,2})?$/.test(requestedAmount) ? requestedAmount : undefined
  const requestedDesignation = searchParams?.designation?.trim()
  const initialDesignation = requestedDesignation && requestedDesignation.length <= 160 ? requestedDesignation : undefined
  const requestedSourcePath = searchParams?.source?.trim()
  const sourcePath =
    requestedSourcePath && /^\/[a-zA-Z0-9/_-]*$/.test(requestedSourcePath) && requestedSourcePath.length <= 240
      ? requestedSourcePath
      : undefined

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {/* 1. EDITORIAL HERO - EXACT CONTENT */}
        <PageHero
          eyebrow="Give"
          title="Give"
          description="A gift here pays for a specific thing in a specific community. Choose what it funds."
          actions={
            <>
              <ButtonPill href="#giving-form" variant="amber">Give now</ButtonPill>
              <ButtonPill href="/impact" variant="outline">See what the money did</ButtonPill>
            </>
          }
        />

        {/* 2. WHAT YOUR GIFT FUNDS - EXACT CONTENT */}
        <section id="what-your-gift-funds" className="border-b border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="funds-heading">
          <div className="page-container">
            <div className="max-w-3xl">
              <p className="eyebrow text-pine-teal">
                Accountable Stewardship
              </p>
              <h2 id="funds-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
                What your gift does
              </h2>
              <p className="mt-4 text-base leading-relaxed text-graphite sm:text-lg">
                {"One Community Innovation Challenge edition — ₦2,000,000"}
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {designations.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[4px] border border-grey-azure/50 bg-white p-6 transition-all duration-300 hover:border-pine-teal hover:shadow-sm"
                >
                  <h3 className="font-heading text-xl text-dark-azure">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-graphite/85">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <ul className="mt-10 grid gap-4 border-t border-grey-azure/50 pt-8 text-base leading-8 text-graphite sm:grid-cols-2 sm:text-lg">
              <li className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-pine-teal shrink-0" aria-hidden="true" />
                <span>One ComPart cohort, start to graduation</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-pine-teal shrink-0" aria-hidden="true" />
                <span>One Community Innovation Challenge edition — ₦2,000,000</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 3. GIVING FORM & 4. PAYMENT */}
        <section id="giving-form" className="py-16 sm:py-20 lg:py-24" aria-labelledby="donation-form-heading">
          <div className="grid page-container gap-12 lg:grid-cols-[1.3fr_0.7fr]">
            {/* Form Column */}
            <div>
              <div className="mb-8">
                <p className="eyebrow text-pine-teal">
                  Make Your Contribution
                </p>
                <h2 id="donation-form-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
                  Giving form
                </h2>
                <p className="mt-3 text-sm text-graphite sm:text-base">
                  Choose your currency, amount, and designation. Submit your intent to receive precise transfer instructions.
                </p>
              </div>

              <DonationIntentForm
                onlineGivingEnabled={Boolean(process.env.PAYSTACK_SECRET_KEY)}
                community={["gosa", "kunyami", "toge"].includes(searchParams?.community || "") ? searchParams!.community : ""}
                initialAmount={initialAmount}
                initialDesignation={initialDesignation}
                sourcePath={sourcePath}
              />
              <p className="mt-6 text-base leading-8 text-graphite sm:text-lg">{"Use your name as the transfer reference, then write to info@medwhole.org so we can match your gift and send your receipt."}</p>
            </div>

            {/* Direct Bank Accounts & Payment Details Sidebar */}
            <div className="self-start lg:sticky lg:top-28">
              <div className="rounded-[4px] border border-grey-azure/50 bg-parchment p-6 sm:p-8">
                <p className="eyebrow text-pine-teal">
                  Direct Bank Details
                </p>
                <h3 className="font-heading text-2xl text-dark-azure">{"Give by bank transfer"}</h3>
                <p className="mt-3 text-sm leading-relaxed text-graphite">{"Account name: MedWHOLE Alliance for Health and Development · Fidelity Bank"}</p>

                <div className="mt-6 space-y-4">
                  {bankAccounts.map((account) => (
                    <div
                      key={account.currency}
                      className="rounded-[4px] border border-grey-azure/50 bg-white p-4"
                    >
                      <div className="flex items-center justify-between meta-label text-pine-teal">
                        <span>{account.currency === "NGN" ? "Naira —" : account.currency === "USD" ? "US dollar —" : "Pound sterling —"}</span>
                      </div>
                      <p className="mt-1 font-mono text-xl font-medium tracking-wide text-dark-azure">
                        {account.number}
                      </p>
                      <p className="mt-1 text-xs text-graphite/80">
                        {account.name} · MedWHOLE Alliance for Health and Development
                      </p>
                    </div>
                  ))}
                </div>

                {/* 5. AFTER YOU GIVE */}
                <div className="mt-8 border-t border-grey-azure/50 pt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-dark-azure">
                    After you give
                  </h4>
                  <ul className="mt-3 space-y-2.5">
                    {afterYouGive.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-xs text-graphite/90 sm:text-sm">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-pine-teal" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. OTHER WAYS TO GIVE */}
        <section className="border-t border-grey-azure/50 bg-parchment py-16 sm:py-20 lg:py-24" aria-labelledby="other-ways-heading">
          <div className="page-container">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="eyebrow text-pine-teal">
                  Flexibility &amp; Partnership
                </p>
                <h2 id="other-ways-heading" className="font-heading text-3xl text-dark-azure sm:text-4xl lg:text-5xl tracking-tight">
                  Other ways to give
                </h2>
                <ul className="mt-6 space-y-3">
                  {otherWaysToGive.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base text-graphite">
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-pine-teal" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <ButtonPill href="/partner" variant="dark">Partner with us</ButtonPill>
                </div>
              </div>

              <div className="rounded-[4px] border border-grey-azure/50 bg-white p-8">
                <h3 className="font-heading text-2xl text-dark-azure">
                  Institutional &amp; International Gifts
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-graphite">{"Corporate and CSR giving"}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href="mailto:info@medwhole.org"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-pine-teal hover:underline"
                  >
                    <Mail className="size-4" />
                    <span>info@medwhole.org</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. GET STARTED */}
        <section className="bg-dark-azure py-16 text-white sm:py-20 lg:py-24" aria-labelledby="get-started-heading">
          <div className="page-container page-container--narrow-center text-center">
            <h2 id="get-started-heading" className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Whole people create lasting impact.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-pale-sky sm:text-lg">{"A gift here pays for a specific thing in a specific community. Choose what it funds."}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ButtonPill href="#giving-form" variant="amber">Give now</ButtonPill>
              <ButtonPill href="/impact" variant="outline">{"See what the money did"}</ButtonPill>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
