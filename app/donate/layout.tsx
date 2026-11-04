import type { ReactNode } from "react"
import { generateSEO } from "@/lib/seo"

export const metadata = generateSEO({
  title: "Donate",
  description: "Record a donation intent for MedWHOLE and receive the correct Nigerian or international bank-transfer instructions for responsible follow-up.",
  url: "/donate",
})

export default function DonateLayout({ children }: { children: ReactNode }) {
  return children
}
