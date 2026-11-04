"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/**
 * Smooth momentum scrolling wrapper using Lenis.
 * Gives the page a silky, editorial scroll feel similar to Tengile MalaMala.
 * Automatically disabled when the user prefers reduced motion.
 */
export function SmoothScroll() {
  const lenisRef = useRef<import("lenis").default | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) return

    let raf: number
    let instance: import("lenis").default | null = null

    import("lenis").then(({ default: Lenis }) => {
      instance = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
      })
      lenisRef.current = instance

      const tick = (time: number) => {
        instance?.raf(time)
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    })

    return () => {
      if (raf) cancelAnimationFrame(raf)
      instance?.destroy()
      lenisRef.current = null
    }
  }, [])

  // Scroll to top on route change
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
  }, [pathname])

  // Pause Lenis when mobile menu is open
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const menuOpen = document.documentElement.classList.contains("menu-open")
      if (menuOpen) {
        lenisRef.current?.stop()
      } else {
        lenisRef.current?.start()
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  return null
}
