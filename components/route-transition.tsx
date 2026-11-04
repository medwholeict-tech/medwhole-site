"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

const CURTAIN_MS = 360

/**
 * Plays a branded curtain over the page before an internal navigation.
 * app/template.tsx remounts on the next route and lifts the same curtain
 * away, so every route change reads as one continuous upward motion.
 */
export function RouteTransition() {
  const router = useRouter()
  const pathname = usePathname()
  const [curtainActive, setCurtainActive] = useState(false)
  const pushTimer = useRef<number | null>(null)
  const safetyTimer = useRef<number | null>(null)
  const activeRef = useRef(false)

  const clearTimers = () => {
    if (pushTimer.current !== null) {
      window.clearTimeout(pushTimer.current)
      pushTimer.current = null
    }
    if (safetyTimer.current !== null) {
      window.clearTimeout(safetyTimer.current)
      safetyTimer.current = null
    }
  }

  useEffect(() => {
    // The next page (and its reveal curtain) has mounted; drop the exit curtain.
    clearTimers()
    activeRef.current = false
    setCurtainActive(false)
  }, [pathname])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (activeRef.current) {
        event.preventDefault()
        return
      }
      const anchor = (event.target as HTMLElement | null)?.closest("a")
      if (!anchor) return
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return
      if (anchor.dataset.noTransition !== undefined) return
      const href = anchor.getAttribute("href")
      if (!href || href.startsWith("#")) return
      let url: URL
      try {
        url = new URL(anchor.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

      event.preventDefault()
      activeRef.current = true
      setCurtainActive(true)
      pushTimer.current = window.setTimeout(() => {
        pushTimer.current = null
        router.push(`${url.pathname}${url.search}${url.hash}`)
        // Never trap the user behind the curtain if navigation stalls.
        safetyTimer.current = window.setTimeout(() => {
          safetyTimer.current = null
          activeRef.current = false
          setCurtainActive(false)
        }, 1400)
      }, CURTAIN_MS)
    }

    document.addEventListener("click", onClick, true)
    return () => {
      document.removeEventListener("click", onClick, true)
      clearTimers()
    }
  }, [router])

  if (!curtainActive) return null

  return (
    <div className="route-curtain-exit" aria-hidden="true">
      <div className="route-curtain-exit__mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon/Logo Type Light Orange (With Colours).svg" alt="" />
        <span className="route-curtain-exit__line" />
      </div>
    </div>
  )
}
