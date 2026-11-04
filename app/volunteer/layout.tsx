import type { ReactNode } from "react"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/volunteer")

export default function VolunteerLayout({ children }: { children: ReactNode }) {
  return children
}
