"use client"

import { useEffect, useRef, type RefObject } from "react"

export function useParallax<T extends HTMLElement>(
  ref: RefObject<T | null>,
  speed = 0.15,
): void {
  const raf = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const tick = () => {
      const rect = el.getBoundingClientRect()
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed
      el.style.transform = `translateY(${offset}px)`
      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [ref, speed])
}
