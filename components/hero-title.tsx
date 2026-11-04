"use client"

import { useEffect, useRef, useState } from "react"
import styles from "@/app/home.module.css"

interface HeroTitleProps {
  lines: string[]
}

/**
 * Editorial Hero Title inspired by Tengile MalaMala:
 * - Asymmetric 3-line layout (left, right-flushed, indented)
 * - Letter-by-letter blur reveal with 45ms staggered delay
 * - Synchronized with the curtain/preloader lift (body.no-loader)
 * - Kinetic scroll scrub drift: opposing horizontal movement on scroll
 *   (line 0 moves right, line 1 moves left, line 2 moves right)
 * - Hero bottom container parallax translation and exit fade
 * - Motion safe: respects prefers-reduced-motion
 * - Accessible with full aria-label for screen readers
 */
export function HeroTitle({ lines }: HeroTitleProps) {
  const [isReady, setIsReady] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    // If body already has no-loader, activate; otherwise trigger after brief delay
    const check = () => {
      if (document.body.classList.contains("no-loader")) {
        setIsReady(true)
      }
    }
    check()
    const timer = setTimeout(() => setIsReady(true), 250)
    return () => clearTimeout(timer)
  }, [])

  // Tengile-inspired scroll scrub animation: opposing horizontal line shifts
  useEffect(() => {
    if (typeof window === "undefined") return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    let rafId = 0
    const updateScrollMotion = () => {
      rafId = 0
      const scrollY = window.scrollY
      const heroEl = titleRef.current?.closest("section")
      const heroHeight = heroEl?.offsetHeight || window.innerHeight

      if (scrollY > heroHeight * 1.5) return

      const progress = Math.min(1, Math.max(0, scrollY / heroHeight))
      const isMobile = window.innerWidth <= 759

      if (isMobile) {
        if (lineRefs.current[0]) lineRefs.current[0].style.transform = "none"
        if (lineRefs.current[1]) lineRefs.current[1].style.transform = "none"
        if (lineRefs.current[2]) lineRefs.current[2].style.transform = "none"
      } else {
        // Map progress 0 -> 1 to drift 0 -> 5.5% (opposing line shifts)
        const drift = progress * 5.5
        if (lineRefs.current[0]) {
          lineRefs.current[0].style.transform = `translate3d(${drift}%, 0, 0)`
        }
        if (lineRefs.current[1]) {
          lineRefs.current[1].style.transform = `translate3d(-${drift}%, 0, 0)`
        }
        if (lineRefs.current[2]) {
          lineRefs.current[2].style.transform = `translate3d(${drift}%, 0, 0)`
        }
      }

      // Parallax & subtle fade for the hero bottom description & buttons
      const bottomEl = titleRef.current?.nextElementSibling as HTMLElement | null
      if (bottomEl) {
        bottomEl.style.transform = `translate3d(0, ${progress * 36}px, 0)`
        bottomEl.style.opacity = `${Math.max(0, 1 - progress * 1.4)}`
      }
    }

    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(updateScrollMotion)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  let charOffset = 0

  return (
    <h1 ref={titleRef} id="home-heading" className={styles.heroTitle} aria-label={lines.join(" ")}>
      <span className={styles.heroTitleText} aria-hidden="true">
        {lines.map((line, lineIdx) => {
          const words = line.split(" ")
          const lineClass =
            lineIdx === 0
              ? styles.heroLine1
              : lineIdx === 1
                ? styles.heroLine2
                : styles.heroLine3

          return (
            <span
              key={lineIdx}
              ref={(el) => {
                lineRefs.current[lineIdx] = el
              }}
              className={`${styles.heroLine} ${lineClass}`}
            >
              {words.map((word, wordIdx) => {
                const chars = word.split("")
                return (
                  <span key={wordIdx} className={styles.heroWord}>
                    {chars.map((char, charIdx) => {
                      const currentIdx = charOffset++
                      return (
                        <span
                          key={charIdx}
                          className={`${styles.heroChar} ${isReady ? styles.heroCharIn : ""}`}
                          style={{
                            transitionDelay: `${currentIdx * 45}ms`,
                          }}
                        >
                          {char}
                        </span>
                      )
                    })}
                    {wordIdx < words.length - 1 && <span className={styles.heroSpace}>&nbsp;</span>}
                  </span>
                )
              })}
            </span>
          )
        })}
      </span>
    </h1>
  )
}
