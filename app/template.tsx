import type { ReactNode } from "react"

export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="route-shell">
      <span className="route-curtain" aria-hidden="true" />
      <div className="route-transition">{children}</div>
    </div>
  )
}
