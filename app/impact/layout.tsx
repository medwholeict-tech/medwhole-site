import type { ReactNode } from "react"
import { generateSEO } from "@/lib/seo"

export const metadata = generateSEO({
  title: "Our Impact",
  description: "See how MedWHOLE strengthens health, learning, practical agency, and community leadership in FCT Abuja and beyond.",
  url: "/impact",
})

export default function ImpactLayout({ children }: { children: ReactNode }) {
  return children
}
