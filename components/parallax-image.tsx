"use client"

import Image from "next/image"
import { useEffect, useRef, type ComponentProps } from "react"

type ImageProps = ComponentProps<typeof Image>

interface ParallaxImageProps extends Omit<ImageProps, "ref"> {
  /** Total parallax shift in pixels. Default 32. */
  shift?: number
}

/**
 * A subtle scroll-driven parallax wrapper for Next.js Image.
 * An inner target container translates vertically by ±shift/2 based on scroll
 * position relative to viewport, while the Image inside is free to animate its own
 * scale-in entrance.
 * Disabled for prefers-reduced-motion.
 */
export function ParallaxImage({ shift = 32, style, className, ...props }: ParallaxImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) return

    const wrapper = wrapperRef.current
    const target = targetRef.current
    if (!wrapper || !target) return

    let isInView = false

    const update = () => {
      rafRef.current = 0
      if (!isInView || !target) return

      const rect = wrapper.getBoundingClientRect()
      const windowH = window.innerHeight
      // progress: 0 when element enters bottom, 1 when it leaves top
      const progress = 1 - rect.bottom / (windowH + rect.height)
      // Clamp translate to [-shift/2, +shift/2]
      const translate = (progress - 0.5) * shift

      target.style.transform = `translate3d(0, ${translate.toFixed(2)}px, 0)`
    }

    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting
        if (isInView) onScroll()
      },
      { rootMargin: "120px 0px" }
    )

    observer.observe(wrapper)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [shift])

  const wrapperStyle: React.CSSProperties = {
    overflow: "hidden",
    position: "relative",
    ...style,
  }

  // Extend the inner target vertically so translation doesn't reveal empty edges
  const pad = Math.ceil(shift / 2) + 4

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      <div
        ref={targetRef}
        style={{
          position: props.fill ? "absolute" : "relative",
          top: props.fill ? `-${pad}px` : undefined,
          left: 0,
          right: 0,
          height: props.fill ? `calc(100% + ${pad * 2}px)` : undefined,
          width: "100%",
          willChange: "transform",
          transform: "translate3d(0, 0, 0)",
        }}
      >
        <Image {...props} className={className} />
      </div>
    </div>
  )
}
