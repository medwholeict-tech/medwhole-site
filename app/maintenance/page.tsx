"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink, Linkedin } from "lucide-react"
import Image from "next/image"
import { socialLinks as officialSocialLinks } from "@/lib/social-links"

// Set the maintenance end date (5 days from now)
const MAINTENANCE_END_DATE = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function MaintenancePage() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = MAINTENANCE_END_DATE.getTime() - Date.now()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const socialLinks = [
    {
      name: "YouTube",
      url: officialSocialLinks.youtube,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Facebook",
      url: officialSocialLinks.facebook,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: officialSocialLinks.instagram,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C9.06 2.013 9.414 2 11.843 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: officialSocialLinks.linkedin,
      icon: <Linkedin className="h-5 w-5" aria-hidden="true" />,
    },
    {
      name: "Email",
      url: "mailto:info@medwhole.org",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ]

  const countdownUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      <header className="border-b border-grey-azure bg-parchment">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-center px-5 lg:px-8">
          <Image src="/icon/Logo Type Dark Azure (With Colours).svg" alt="MedWHOLE" width={180} height={40} priority className="h-10 w-auto" />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
        <Card className="w-full max-w-3xl border border-grey-azure bg-white">
          <div className="p-8 text-center md:p-12">
            <div className="flex items-center justify-center gap-3 pb-8">
              <Image src="/icon/Logo Mark Dark Azure (With Colours).svg" alt="MedWHOLE symbol" width={48} height={48} className="h-12 w-12" />
            </div>

            <h1 className="font-heading text-3xl leading-tight text-dark-azure md:text-4xl">
              We&apos;re Under Maintenance
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-graphite">
              We&apos;re working hard to improve your experience. Our website will be back online soon. Thank you for
              your patience.
            </p>

            <div className="mt-12">
              <p className="eyebrow text-pine-teal">
                Estimated time remaining
              </p>
              <div className="mx-auto mt-6 grid max-w-md grid-cols-4 gap-3">
                {countdownUnits.map((item) => (
                  <div key={item.label} className="border border-grey-azure bg-parchment p-4">
                    <div className="font-heading text-3xl text-prussian-blue md:text-4xl">
                      {item.value.toString().padStart(2, "0")}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.16em] text-graphite">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 border-t border-grey-azure pt-8">
              <p className="text-sm text-graphite">Stay connected with us</p>
              <div className="mt-4 flex justify-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center border border-grey-azure text-dark-azure hover:border-amber-flame hover:text-pine-teal"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <p className="mb-4 text-sm text-graphite">Meanwhile, explore our educational resources</p>
              <Button asChild size="lg" className="bg-amber-flame text-prussian-blue hover:bg-white">
                <a href="/programs#education" className="gap-2">
                  Explore Education
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <footer className="border-t border-grey-azure bg-parchment py-6 text-center text-sm text-graphite">
        <p>© {new Date().getFullYear()} MedWHOLE. All rights reserved.</p>
      </footer>
    </div>
  )
}
