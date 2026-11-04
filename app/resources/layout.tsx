import type { ReactNode } from "react"
import { generateSEO } from "@/lib/seo"

export const metadata = generateSEO({
  title: "Resources",
  description: "Explore MedWHOLE resources supporting practical learning, health, leadership, and whole-person development.",
  url: "/resources",
})

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return children
}
