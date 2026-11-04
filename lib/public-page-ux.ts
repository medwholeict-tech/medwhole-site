import { eventStatus } from "./approved-copy"
import type { DirectoryItem } from "../components/copy-directory"

export const newsCategories = ["Programme reports", "Quarterly reports", "Partnerships", "Announcements"] as const
export const newsCategoryLabels: Record<string, string> = {
  "program-update": "Programme reports",
  "impact-story": "Programme reports",
  research: "Programme reports",
  "quarterly-report": "Quarterly reports",
  partnership: "Partnerships",
  announcement: "Announcements",
}

export function selectedNewsCategory(value?: string | string[]) {
  return typeof value === "string" && newsCategories.some(category => category === value) ? value : undefined
}

export function filterNewsCategory<T extends { category?: string }>(articles: T[], category?: string) {
  return category ? articles.filter(article => newsCategoryLabels[article.category || ""] === category) : articles
}

export function groupPublishedEvents(items: DirectoryItem[], now = new Date()) {
  const dated = items.map(item => ({
    ...item,
    status: item.date ? eventStatus({ start: item.date, end: item.end || item.date }, now) : item.status,
  }))
  return {
    current: dated.filter(item => item.status !== "Completed").sort((a, b) => (a.date || "").localeCompare(b.date || "")),
    past: dated.filter(item => item.status === "Completed").sort((a, b) => (b.date || "").localeCompare(a.date || "")),
  }
}
