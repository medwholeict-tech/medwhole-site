import type { ReactNode } from "react"
import { generateSEO } from "@/lib/seo"

export const metadata = generateSEO({
  title: "Maintenance",
  description: "MedWHOLE website maintenance page.",
  url: "/maintenance",
  noindex: true,
})

export default function MaintenanceLayout({ children }: { children: ReactNode }) {
  return children
}
