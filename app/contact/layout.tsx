import type { ReactNode } from "react"
import { generateSEO } from "@/lib/seo"

export const metadata = generateSEO({
  title: "Contact",
  description: "Contact MedWHOLE in Abuja about programmes, partnerships, volunteering, donations, or general enquiries.",
  url: "/contact",
})

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}
