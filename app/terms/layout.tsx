import type { ReactNode } from "react"
import { generateSEO } from "@/lib/seo"

export const metadata = generateSEO({
  title: "Terms of Service and Website Use",
  description: "Read the terms governing use of MedWHOLE’s website, forms, programmes, donations, event registration, and digital services.",
  url: "/terms",
})

export default function TermsLayout({ children }: { children: ReactNode }) {
  return children
}
