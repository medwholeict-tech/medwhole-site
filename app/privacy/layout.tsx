import type { ReactNode } from "react"
import { generateSEO } from "@/lib/seo"

export const metadata = generateSEO({
  title: "Privacy and Data Protection Policy",
  description: "Read how MedWHOLE collects, uses, protects, retains, and manages personal information across its website and programmes.",
  url: "/privacy",
})

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return children
}
