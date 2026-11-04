import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/partner")

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return children
}
