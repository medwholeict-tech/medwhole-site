"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ChevronDown, Facebook, Instagram, Linkedin, Menu, X, Youtube } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { socialLinks } from "@/lib/social-links"

type MenuItem = { label: string; href: string; description?: string }
type MenuGroup = { label: string; href?: string; items?: MenuItem[] }

const menuGroups: MenuGroup[] = [
  {
    label: "About",
    href: "/about",
    items: [
      { label: "About Overview", href: "/about", description: "Who we are, how we are governed, and how we account for our work." },
      { label: "The Made Whole Journey", href: "/about/journey", description: "Our method, in four phases." },
      { label: "Team and governance", href: "/about/team", description: "Who does the work and who holds the decisions." },
      { label: "Accountability", href: "/about/accountability", description: "How money is managed, how work is reported, and how to raise a concern." },
    ],
  },
  {
    label: "Academy",
    href: "/academy",
    items: [
      { label: "MedWHOLE Academy", href: "/academy", description: "Free education for children and teenagers in Gosa and Kunyami." },
      { label: "Summer School", href: "/academy/summer-school", description: "Free holiday lessons every August." },
      { label: "Good News Club", href: "/academy/good-news-club", description: "Weekly club for children and teenagers." },
      { label: "Library and Reading Club", href: "/academy/reading-club", description: "Reading support through the year." },
      { label: "Back-to-School Scholarship", href: "/academy/scholarship", description: "Returning children who had left school." },
      { label: "Exam Coaching", href: "/academy/exam-coaching", description: "Free WAEC and JAMB preparation." },
    ],
  },
  {
    label: "Our Work",
    href: "/our-work",
    items: [
      { label: "Our Work Overview", href: "/our-work", description: "Everything we run, and where it is running today." },
      { label: "Health", href: "/our-work/health", description: "Care delivered, and systems built so care keeps coming." },
      { label: "Literacy", href: "/our-work/literacy", description: "Free education for children and teenagers, held mostly within MedWHOLE Academy." },
      { label: "Empowerment", href: "/our-work/empowerment", description: "Skills training, mentorship, and a community innovation challenge with grant funding." },
    ],
  },
  {
    label: "Impact",
    href: "/impact",
    items: [
      { label: "Gosa", href: "/communities/gosa", description: "Our first community, and where everything was built." },
      { label: "Kunyami", href: "/communities/kunyami", description: "Where we found out whether any of this works anywhere else." },
      { label: "Toge", href: "/communities/toge", description: "Our newest community. We are at the beginning here." },
      { label: "Summer School", href: "/academy/summer-school", description: "Four weeks of free lessons every August, in Gosa and Kunyami." },
      { label: "Innovation Challenge", href: "/our-work/empowerment/community-innovation-challenge", description: "Young adults in Gosa identify a problem in their own community and build a solution." },
      { label: "ComPart", href: "/our-work/empowerment/compart", description: "The Community Participation Programme." },
    ],
  },
  {
    label: "Get Involved",
    href: "/get-involved",
    items: [
      { label: "Get Involved Overview", href: "/get-involved", description: "Three ways to take part in the mission." },
      { label: "Give", href: "/give", description: "Fund a child's place, an outreach, or a full programme." },
      { label: "Volunteer", href: "/volunteer", description: "Teach, mentor, or bring a clinical skill." },
      { label: "Partner", href: "/partner", description: "For institutions, companies and funders." },
    ],
  },
  { label: "Contact", href: "/contact" },
]

function isActivePath(pathname: string, href?: string) {
  if (!href) return false
  const route = href.split("#")[0]
  return route === "/" ? pathname === "/" : pathname.startsWith(route)
}

export function SiteHeader() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [isCompact, setIsCompact] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollYRef = useRef(0)
  const headerRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const isTransparent = isHome && !isCompact

  useEffect(() => {
    let frame = 0
    const updateHeader = () => {
      frame = 0
      const currentScrollY = window.scrollY
      const lastScrollY = lastScrollYRef.current

      setIsCompact((current) => {
        const next = currentScrollY > 48
        return current === next ? current : next
      })

      // Hide header when scrolling down past 90px; reveal smoothly when scrolling up
      if (currentScrollY > 90 && currentScrollY > lastScrollY + 6) {
        setIsHidden(true)
      } else if (currentScrollY < lastScrollY - 6 || currentScrollY <= 48) {
        setIsHidden(false)
      }

      lastScrollYRef.current = currentScrollY
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateHeader)
    }

    updateHeader()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenGroup(null)
        setMobileMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (headerRef.current?.contains(target)) return
      if (overlayRef.current?.contains(target)) return
      setOpenGroup(null)
      setMobileMenuOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setOpenGroup(null)
    setIsHidden(false)
  }, [pathname])

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", mobileMenuOpen)
    if (mobileMenuOpen) {
      setIsHidden(false)
      closeButtonRef.current?.focus()
    }
    return () => {
      document.documentElement.classList.remove("menu-open")
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 z-50 w-full transition-[transform,border-color,box-shadow,background-color,backdrop-filter,color] duration-300 ease-out",
          isTransparent
            ? "border-transparent bg-transparent text-white"
            : isCompact
              ? "border-b border-grey-azure bg-parchment text-dark-azure"
              : "border-b border-grey-azure bg-parchment text-dark-azure",
          isHidden && !mobileMenuOpen && "-translate-y-full"
        )}
      >
        <div className={cn("mx-auto flex w-full max-w-7xl items-center justify-between px-5 transition-[min-height] duration-300 sm:px-8 lg:px-10", isCompact ? "min-h-16" : "min-h-20")}>
          {/* Brand Identity / Logo on the left */}
          <Link
            href="/"
            aria-label="MedWHOLE home"
            className={cn(
              "relative flex shrink-0 items-center justify-start focus-visible:outline-offset-4 transition-[width,height] duration-300",
              isCompact ? "h-11 w-11" : isTransparent ? "h-9 w-[138px]" : "h-9 w-[144px]"
            )}
          >
            {/* Brand Mark (appears smoothly as user scrolls) */}
            <Image
              src="/icon/Logo Mark Dark Azure (With Colours).svg"
              alt="MedWHOLE"
              width={58}
              height={58}
              priority
              className={cn(
                "aspect-square transition-all duration-300",
                isCompact ? "h-11 w-11 opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none absolute"
              )}
            />

            {/* Light Orange/White wordmark over dark hero video (remains at top when unscrolled) */}
            <Image
              src="/icon/Logo Type Light Orange (With Colours).svg"
              alt="MedWHOLE"
              width={140}
              height={32}
              priority
              className={cn(
                "h-8 w-auto transition-all duration-300",
                !isCompact && isTransparent
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-90 pointer-events-none absolute"
              )}
            />

            {/* Dark Azure wordmark on light parchment backgrounds (remains at top when unscrolled on non-hero pages) */}
            <Image
              src="/icon/Logo Type Dark Azure (With Colours).svg"
              alt="MedWHOLE"
              width={140}
              height={32}
              priority
              className={cn(
                "h-8 w-auto transition-all duration-300",
                !isCompact && !isTransparent
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-90 pointer-events-none absolute"
              )}
            />
          </Link>

          {/* Intelligently organized, beautifully spaced navigation */}
          <nav aria-label="Primary navigation" className="hidden items-center justify-end gap-1 px-4 lg:flex xl:gap-2">
            {menuGroups.map((group) => (
              <DesktopMenuGroup
                key={group.label}
                group={group}
                pathname={pathname}
                openGroup={openGroup}
                setOpenGroup={setOpenGroup}
                isTransparent={isTransparent}
              />
            ))}
          </nav>

          {/* Right Action: Persistent Give button per client spec */}
          <div className="hidden shrink-0 items-center lg:flex">
            <Link
              href="/give"
              className={cn(
                "inline-flex min-w-[6.5rem] items-center justify-center rounded-md bg-amber-flame px-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-prussian-blue transition-[background-color,color,border-color,transform] duration-200 ease-out hover:-translate-y-px hover:bg-dark-azure hover:text-white active:translate-y-0 sm:text-[13px]",
                isCompact ? "min-h-[34px] py-1" : "min-h-[38px] py-1.5"
              )}
            >
              Give
            </Link>
          </div>

          <button
            type="button"
            ref={menuButtonRef}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors lg:hidden",
              isTransparent
                ? "border-white/30 text-white hover:border-amber-flame hover:text-amber-flame"
                : "border-grey-azure text-prussian-blue hover:border-pine-teal hover:text-pine-teal"
            )}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div
        id="mobile-navigation"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={cn("menu-overlay lg:hidden", mobileMenuOpen && "is-open")}
      >
        <div className="flex min-h-20 items-center justify-between border-b border-white/15 px-5">
          <Link href="/" aria-label="MedWHOLE home" className="rounded-full focus-visible:outline-offset-4" onClick={() => setMobileMenuOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon/Logo Type Light Orange (With Colours).svg" alt="MedWHOLE" className="h-7 w-auto" />
          </Link>
          <button
            type="button"
            ref={closeButtonRef}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[4px] border border-white/30 text-white transition-colors hover:border-amber-flame hover:text-amber-flame"
            aria-label="Close navigation menu"
            onClick={() => {
              setMobileMenuOpen(false)
              menuButtonRef.current?.focus()
            }}
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Mobile navigation" data-menu-reveal className="flex-1 overflow-y-auto px-5 pb-12 pt-2">
          {menuGroups.map((group) => (
            <div key={group.label} className="border-b border-white/10 last:border-b-0">
              {group.items ? (
                <>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-4 text-left font-heading text-2xl text-white transition-colors hover:text-amber-flame"
                    aria-expanded={openGroup === group.label}
                    onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}
                  >
                    {group.label}
                    <ChevronDown aria-hidden="true" className={cn("h-5 w-5 shrink-0 text-pale-sky transition-transform duration-200", openGroup === group.label && "rotate-180")} />
                  </button>
                  <div className={cn("menu-accordion", openGroup === group.label && "is-open")}>
                    <div>
                      <div className="grid gap-1 pb-4 pl-1">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                            "block rounded-[4px] px-3 py-2 text-base transition-colors",
                            isActivePath(pathname, item.href) ? "bg-prussian-blue font-semibold text-white" : "text-pale-sky hover:text-white"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={group.href ?? "/"}
                  className={cn("block py-4 font-heading text-2xl transition-colors hover:text-amber-flame", isActivePath(pathname, group.href) ? "text-amber-flame" : "text-white")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {group.label}
                </Link>
              )}
            </div>
          ))}
          <div className="pt-6">
            <Link href="/give" className="block w-full rounded-md bg-amber-flame py-3 text-center text-xs font-semibold uppercase tracking-[0.08em] text-prussian-blue transition-colors hover:bg-white" onClick={() => setMobileMenuOpen(false)}>Give</Link>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-pale-sky">Follow MedWHOLE</p>
            <div className="mt-3 flex items-center gap-3">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MedWHOLE on Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-transparent text-pale-sky transition-all duration-200 hover:border-amber-flame hover:bg-amber-flame hover:text-prussian-blue"
              >
                <Facebook aria-hidden="true" className="h-4.5 w-4.5" />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MedWHOLE on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-transparent text-pale-sky transition-all duration-200 hover:border-amber-flame hover:bg-amber-flame hover:text-prussian-blue"
              >
                <Instagram aria-hidden="true" className="h-4.5 w-4.5" />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MedWHOLE on LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-transparent text-pale-sky transition-all duration-200 hover:border-amber-flame hover:bg-amber-flame hover:text-prussian-blue"
              >
                <Linkedin aria-hidden="true" className="h-4.5 w-4.5" />
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MedWHOLE on YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-transparent text-pale-sky transition-all duration-200 hover:border-amber-flame hover:bg-amber-flame hover:text-prussian-blue"
              >
                <Youtube aria-hidden="true" className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}

function DesktopMenuGroup({
  group,
  pathname,
  openGroup,
  setOpenGroup,
  isTransparent = false,
}: {
  group: MenuGroup
  pathname: string
  openGroup: string | null
  setOpenGroup: (label: string | null) => void
  isTransparent?: boolean
}) {
  if (!group.items) {
    return (
      <Link
        href={group.href ?? "/"}
        className={cn(
          "inline-flex items-center justify-center rounded-md px-2.5 py-2 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors duration-200 xl:px-3.5",
          isTransparent
            ? "text-white/90 hover:text-amber-flame"
            : "text-prussian-blue hover:text-pine-teal",
          isActivePath(pathname, group.href) && "text-amber-flame"
        )}
      >
        {group.label}
      </Link>
    )
  }
  const isOpen = openGroup === group.label
  const dropdownAlignClass =
    group.label === "About"
      ? "left-0"
      : group.label === "Get Involved" || group.label === "Contact"
        ? "right-0"
        : "left-1/2 -translate-x-1/2"

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md px-2.5 py-2 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors duration-200 xl:px-3.5",
          isTransparent
            ? "text-white/90 hover:text-amber-flame"
            : "text-prussian-blue hover:text-pine-teal",
          isOpen && "text-amber-flame"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setOpenGroup(isOpen ? null : group.label)}
      >
        {group.label}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isTransparent ? "text-white/60" : "text-prussian-blue/50",
            isOpen && "rotate-180 text-amber-flame"
          )}
        />
      </button>
      {isOpen && (
        <div
          className={cn(
            "absolute top-full z-20 mt-1.5 w-72 rounded-[4px] border border-grey-azure/50 bg-white p-1.5 shadow-sm animate-in fade-in-0 zoom-in-95 duration-200",
            dropdownAlignClass
          )}
        >
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-[4px] border-l-2 border-transparent px-3 py-2.5 transition-all duration-200 hover:border-pine-teal hover:bg-parchment"
            >
              <span className="block text-[13px] font-semibold text-prussian-blue">{item.label}</span>
              {item.description && <span className="mt-0.5 block text-[11px] leading-4 text-graphite">{item.description}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
