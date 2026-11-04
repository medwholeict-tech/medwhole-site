import type { ReactNode } from "react"
import { generateSEO } from "@/lib/seo"

export const metadata = generateSEO({
  title: "The Made Whole Journey",
  description: "MedWHOLE's method, in four phases — engaged, equipped, deployed, supported. How every programme is designed and judged.",
  url: "/about/journey",
})

export default function JourneyLayout({ children }: { children: ReactNode }) {
  return children
}
