"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const REVEAL_SELECTOR = [
  "[data-reveal]",
  "[data-reveal-children]",
  "[data-image-reveal]",
  "[data-text-reveal]",
  "[data-words-reveal]",
  "[data-count-to]",
  ".appear-blur-in",
  ".appear-scale-in",
].join(", ")

function formatCount(value: number, comma: boolean) {
  return comma ? Math.round(value).toLocaleString("en-US") : String(Math.round(value))
}

function animateCount(element: HTMLElement) {
  const target = Number.parseFloat(element.dataset.countTo ?? "")
  if (Number.isNaN(target)) return
  const suffix = element.dataset.countSuffix ?? ""
  const comma = element.dataset.countFormat === "comma"
  const duration = 1300
  const start = performance.now()

  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    element.textContent = `${formatCount(target * eased, comma)}${suffix}`
    if (progress < 1) window.requestAnimationFrame(tick)
  }

  window.requestAnimationFrame(tick)
}

export function MotionController() {
  const pathname = usePathname()

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!document.documentElement.classList.contains("brand-intro-active")) {
      document.body.classList.add("no-loader")
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
            if (entry.target instanceof HTMLElement && entry.target.dataset.countTo !== undefined) {
              animateCount(entry.target)
            }
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    )

    const register = (element: HTMLElement) => {
      if (element.classList.contains("revealed")) return
      if (reducedMotion) {
        element.classList.add("revealed")
        return
      }
      const rect = element.getBoundingClientRect()
      const isInitiallyVisible = rect.top < window.innerHeight && rect.bottom > 0

      if (isInitiallyVisible) {
        element.classList.add("revealed")
        if (element.dataset.countTo !== undefined) animateCount(element)
      } else {
        observer.observe(element)
      }
    }

    document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(register)

    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.matches(REVEAL_SELECTOR)) register(node)
          node.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(register)
        })
      })
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [pathname])

  return null
}
