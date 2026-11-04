import type { ReactNode } from "react"
import { generateSEO } from "@/lib/seo"

export const metadata = generateSEO({
  title: "Health, Literacy and Empowerment Programmes",
  description: "Explore MedWHOLE’s integrated work in health service delivery, education, nutrition, and empowerment across communities in Nigeria.",
  url: "/programs",
})

export default function ProgramsLayout({ children }: { children: ReactNode }) {
  return children
}
