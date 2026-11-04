"use client"

import type { MouseEvent } from "react"

export function LegalSectionLink({ id, children }: { id: string; children: string }) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const section = document.getElementById(id)
    if (!section) return

    event.preventDefault()
    window.history.pushState(null, "", `#${id}`)
    section.focus({ preventScroll: true })
    section.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    })
  }

  return (
    <a className="text-graphite transition-colors hover:text-pine-teal" href={`#${id}`} onClick={handleClick}>
      {children}
    </a>
  )
}
