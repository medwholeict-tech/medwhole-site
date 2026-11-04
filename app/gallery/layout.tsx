import type { ReactNode } from "react"
import { generateSEO } from "@/lib/seo"

export const metadata = generateSEO({
  title: "Gallery",
  description: "View photographs from MedWHOLE health, education, empowerment, service, and community activities in Nigeria.",
  url: "/gallery",
})

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return children
}
