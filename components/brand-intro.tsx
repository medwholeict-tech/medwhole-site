"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

const INTRO_STORAGE_KEY = "medwhole-brand-intro-seen"

export function BrandIntro() {
  const [isVisible, setIsVisible] = useState(true)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    try {
      if (process.env.NODE_ENV !== "development" && window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "1") {
        setIsVisible(false)
        document.body.classList.add("no-loader")
        return
      }
      window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1")
    } catch {
      // The introduction still works when session storage is unavailable.
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(false)
      document.body.classList.add("no-loader")
      return
    }

    document.documentElement.classList.add("brand-intro-active")
    const leaveTimer = window.setTimeout(() => {
      setIsLeaving(true)
      document.body.classList.add("no-loader")
    }, 2000)
    const hideTimer = window.setTimeout(() => {
      setIsVisible(false)
      document.documentElement.classList.remove("brand-intro-active")
    }, 2550)

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(hideTimer)
      document.documentElement.classList.remove("brand-intro-active")
      document.body.classList.add("no-loader")
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className={`brand-intro${isLeaving ? " is-leaving" : ""}`} aria-hidden="true">
      <div className="brand-intro__content">
        <div className="brand-intro__mark-frame">
          <Image
            src="/icon/Logo Mark Dark Azure (With Colours).svg"
            alt=""
            fill
            priority
            sizes="72px"
            className="brand-intro__logo"
          />
        </div>
        <div className="brand-intro__logo-frame">
          <Image
            src="/icon/Logo Type Dark Azure (With Colours).svg"
            alt=""
            fill
            priority
            sizes="(max-width: 375px) 64vw, 240px"
            className="brand-intro__logo"
          />
        </div>
        <span className="brand-intro__line" />
        <p>Whole People. Lasting Impact.</p>
      </div>
      <span className="brand-intro__progress" />
    </div>
  )
}
