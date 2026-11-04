import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"
import { siteConfig } from "@/lib/seo"
import { socialLinks } from "@/lib/social-links"

const navigation = [
  ["About", "/about"], ["Academy", "/academy"], ["Our Work", "/our-work"],
  ["Impact", "/impact"], ["News", "/news"], ["Events", "/events"],
  ["Give", "/give"], ["Volunteer", "/volunteer"], ["Partner with us", "/partner"],
]
const social = [
  { name: "Facebook", href: socialLinks.facebook, Icon: Facebook },
  { name: "Instagram", href: socialLinks.instagram, Icon: Instagram },
  { name: "LinkedIn", href: socialLinks.linkedin, Icon: Linkedin },
  { name: "YouTube", href: socialLinks.youtube, Icon: Youtube },
]
const linkStyle = "inline-flex min-h-11 items-center text-sm text-pale-sky underline-offset-4 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-flame"

export function SiteFooter() {
  return (
    <footer className="border-t border-grey-azure bg-dark-azure text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <Link href="/" className="inline-flex min-h-11 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-flame"><Image src="/icon/Logo Type Light Orange (With Colours).svg" alt="MedWHOLE Alliance" width={162} height={36} className="h-7 w-auto sm:h-8" /></Link>
          <div className="flex items-center">
            {social.map(({ name, href, Icon }) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={"MedWHOLE on " + name} className="flex size-11 items-center justify-center text-pale-sky hover:text-amber-flame focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-flame"><Icon className="size-4" aria-hidden="true" /></a>)}
          </div>
        </div>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <p className="font-heading text-base text-white sm:text-lg">Whole people. Lasting impact.</p>
            <div className="mt-2 flex flex-wrap gap-x-5">
              <a href="mailto:info@medwhole.org" className={linkStyle}>info@medwhole.org</a>
              <a href="tel:+2348189800001" className={linkStyle}>+234 818 980 0001</a>
            </div>
            <p className="mt-1 max-w-lg text-xs leading-6 text-pale-sky">MedWHOLE Resource Centre, 7 Nissi Drive, Fort Royal, Nnamdi Azikiwe Airport Road, Kyami District, AMAC, FCT Abuja</p>
            <p className="mt-2 text-xs leading-5 text-pale-sky">Registered non-profit, Charity ID {siteConfig.charityId}</p>
          </div>
          <nav aria-label="Footer navigation" className="order-first lg:order-none">
            <ul className="grid grid-cols-3 gap-x-4">
              {navigation.map(([label, href]) => <li key={href}><Link href={href} className={linkStyle}>{label}</Link></li>)}
            </ul>
          </nav>
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t border-pale-sky/30 pt-3 text-xs text-pale-sky lg:flex-row lg:items-center lg:justify-between">
          <p>&copy; 2026 MedWHOLE. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4">
            <Link href="/about/accountability" className={linkStyle}>Accountability</Link>
            <Link href="/safeguarding" className={linkStyle}>Safeguarding</Link>
            <Link href="/privacy" className={linkStyle}>Privacy Policy</Link>
            <Link href="/terms" className={linkStyle}>Terms of Service</Link>
            <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className={linkStyle}>RSS Feed</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
