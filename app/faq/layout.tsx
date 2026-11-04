import type { ReactNode } from "react"
import { generateSEO } from "@/lib/seo"

export const metadata = generateSEO({
  title: "Frequently Asked Questions",
  description: "Find answers about MedWHOLE’s mission, programmes, partnerships, volunteering, donations, safeguarding, and community work.",
  url: "/faq",
})

export default function FaqLayout({ children }: { children: ReactNode }) {
  return children
}
