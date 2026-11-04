import type { ReactNode } from "react"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/about")

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children
}
