import type { ReactNode } from "react"
import { generateSEO } from "@/lib/seo"

export const metadata = generateSEO({
  title: "Get Involved",
  description: "Partner, volunteer, mentor, or give to support MedWHOLE's health, literacy, and empowerment work in Nigeria.",
  url: "/get-involved",
})

export default function GetInvolvedLayout({ children }: { children: ReactNode }) {
  return children
}
