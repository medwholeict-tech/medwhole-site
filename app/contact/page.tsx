import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, ShieldAlert, Youtube } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ButtonPill } from "@/components/ui/button-pill"
import { socialLinks } from "@/lib/social-links"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/contact")

const getInTouch = [
  { label: "Email", value: "info@medwhole.org", href: "mailto:info@medwhole.org" },
  { label: "Phone", value: "+234 818 980 0001", href: "tel:+2348189800001" },
]

const findUs = [
  {
    label: "MedWHOLE Resource Centre",
    details: "7 Nissi Drive, Fort Royal, Nnamdi Azikiwe Airport Road, Kyami District, AMAC, FCT Abuja",
  },
  {
    label: "Gosa liaison office",
    details: "Shop 6, Gosa Shopping Complex, Nnamdi Azikiwe Airport Road, Kyami District, AMAC, FCT Abuja",
  },
]

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        {/* 1. HERO */}
        <section className="bg-dark-azure text-white" aria-labelledby="contact-hero-heading">
          <div className="page-container py-16 sm:py-20 lg:py-24">
            <div className="max-w-3xl">
              <p className="eyebrow text-amber-flame">Contact</p>
              <h1 id="contact-hero-heading" className="font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Contact
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-pale-sky sm:text-xl">
                By phone, by email, or in person at the Gosa office.
              </p>
            </div>
          </div>
        </section>

        {/* 2. GET IN TOUCH & 3. FIND US */}
        <section className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="grid page-container gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-12 lg:col-span-5">
              {/* Get in touch */}
              <div>
                <p className="eyebrow text-pine-teal">
                Reach us
                </p>
                <h2 className="font-heading text-2xl text-dark-azure sm:text-3xl">
                  Get in touch
                </h2>
                <p className="mt-6 text-base leading-8 text-graphite sm:text-lg">{"In person — the Gosa liaison office, Shop 6, Gosa Shopping Complex — or the MedWHOLE Resource Centre, 7 Nissi Drive, Fort Royal. Both on Nnamdi Azikiwe Airport Road, Kyami District, AMAC, FCT Abuja"}</p><ul className="mt-6 space-y-4 text-base text-graphite">
                  {getInTouch.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-pine-teal" />
                      <div>
                        <strong className="text-dark-azure">{item.label}</strong> —{" "}
                        <a href={item.href} className="text-pine-teal hover:underline font-medium">
                          {item.value}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-7 text-graphite">Our work today is in Gosa, Kunyami and Toge — all three in Kyami District, AMAC, FCT Abuja, along the Nnamdi Azikiwe Airport Road corridor.</p>
              </div>

              {/* Find us */}
              <div className="border-t border-grey-azure/50 pt-8">
                <p className="eyebrow text-pine-teal">
                  Locations
                </p>
                <h2 className="font-heading text-2xl text-dark-azure sm:text-3xl">
                  Find us
                </h2>
                <ul className="mt-6 space-y-4 text-base text-graphite">
                  {findUs.map((loc) => (
                    <li key={loc.label} className="flex items-start gap-3">
                      <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-pine-teal" />
                      <div>
                        <strong className="text-dark-azure">{loc.label}</strong> — {loc.details}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. Safeguarding concerns callout */}
              <div className="rounded-[4px] border border-amber-flame/80 bg-parchment p-6">
                <div className="flex items-center gap-2 font-heading text-lg text-dark-azure">
                  <ShieldAlert className="h-5 w-5 text-amber-flame" />
                  <h3>Specific routes</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-graphite">{"A safeguarding concern — see Safeguarding"}</p>
                <div className="mt-4">
                  <ul className="mb-4 space-y-3 text-sm leading-6">
                    <li><a href="/partner" className="text-pine-teal underline underline-offset-4">Partnership and funding enquiries — see Partner</a></li>
                    <li><a href="/volunteer" className="text-pine-teal underline underline-offset-4">Volunteering — see Volunteer</a></li>
                    <li><a href="mailto:info@medwhole.org?subject=Media%20enquiry" className="text-pine-teal underline underline-offset-4">Press</a></li>
                  </ul>
                  <ButtonPill href="/safeguarding" variant="amber">
                    Safeguarding
                  </ButtonPill>
                </div>
              </div>

              {/* 6. Follow us */}
              <div className="border-t border-grey-azure/50 pt-8">
                <p className="eyebrow text-pine-teal">
                  Social Channels
                </p>
                <h2 className="font-heading text-2xl text-dark-azure">
                  Follow us
                </h2>
                <p className="mt-2 text-sm text-graphite">Facebook, Instagram, LinkedIn and YouTube.</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[4px] border border-grey-azure/50 bg-parchment px-3.5 py-1.5 text-xs font-semibold text-dark-azure transition-colors hover:border-pine-teal hover:bg-pine-teal hover:text-white"
                  >
                    <Facebook className="h-3.5 w-3.5" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[4px] border border-grey-azure/50 bg-parchment px-3.5 py-1.5 text-xs font-semibold text-dark-azure transition-colors hover:border-pine-teal hover:bg-pine-teal hover:text-white"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[4px] border border-grey-azure/50 bg-parchment px-3.5 py-1.5 text-xs font-semibold text-dark-azure transition-colors hover:border-pine-teal hover:bg-pine-teal hover:text-white"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[4px] border border-grey-azure/50 bg-parchment px-3.5 py-1.5 text-xs font-semibold text-dark-azure transition-colors hover:border-pine-teal hover:bg-pine-teal hover:text-white"
                  >
                    <Youtube className="h-3.5 w-3.5" />
                    <span>YouTube</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 4. ENQUIRY FORM */}
            <div className="lg:col-span-7">
              <div>
                <p className="eyebrow text-pine-teal">
                  Send a Message
                </p>
                <h2 className="font-heading text-2xl text-dark-azure sm:text-3xl">
                  Enquiry form
                </h2>
                <p className="mt-2 text-sm text-graphite sm:text-base">
                  Name, email address, telephone number, subject — giving, volunteering, partnership, media, a safeguarding concern, or other — and your message.
                </p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
