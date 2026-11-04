"use client"

import { useEffect, useRef, type RefObject } from "react"

export function useScrollReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options?: { threshold?: number; rootMargin?: string },
): void {
  const hasRevealed = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealed.current) {
          hasRevealed.current = true
          el.classList.add("revealed")
          observer.unobserve(el)
        }
      },
      { threshold: options?.threshold ?? 0.15, rootMargin: options?.rootMargin ?? "0px 0px -40px 0px" },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, options?.threshold, options?.rootMargin])
}
