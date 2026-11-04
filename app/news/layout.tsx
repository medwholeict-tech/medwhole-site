import type { ReactNode } from "react"
import { generateSEO } from "@/lib/seo"

export const metadata = generateSEO({
  title: "News, Events and Stories",
  description: "Read MedWHOLE news, ongoing programme updates, event stories, community context, and accountable outcomes from our work.",
  url: "/news",
})

export default function NewsLayout({ children }: { children: ReactNode }) {
  return children
}
