import { permanentRedirect } from "next/navigation"
import { generateSEO } from "@/lib/seo"

export const metadata = generateSEO({ title: "Careers", url: "/get-involved", noindex: true })

export default function CareersPage() {
  permanentRedirect("/get-involved")
}
