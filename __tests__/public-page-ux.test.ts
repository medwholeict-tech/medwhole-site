import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { filterNewsCategory, groupPublishedEvents, selectedNewsCategory } from "../lib/public-page-ux"
import type { DirectoryItem } from "../components/copy-directory"

describe("public page navigation and consistency", () => {
  it("validates news filters and groups the published category values", () => {
    const articles = ["program-update", "impact-story", "research", "quarterly-report", "partnership", "announcement"].map(category => ({ category }))
    expect(filterNewsCategory(articles, "Programme reports")).toHaveLength(3)
    expect(filterNewsCategory(articles, "Quarterly reports")).toEqual([{ category: "quarterly-report" }])
    expect(filterNewsCategory(articles, "Partnerships")).toEqual([{ category: "partnership" }])
    expect(filterNewsCategory(articles, "Announcements")).toEqual([{ category: "announcement" }])
    expect(filterNewsCategory(articles)).toEqual(articles)
    expect(selectedNewsCategory("Partnerships")).toBe("Partnerships")
    expect(selectedNewsCategory("not-a-category")).toBeUndefined()
    expect(selectedNewsCategory(["Partnerships"])).toBeUndefined()
  })

  it("separates running/upcoming activity from the archive using Lagos dates", () => {
    const event = (date: string, end = date): DirectoryItem => ({ path: `/events/${date}`, title: date, date, end, pillar: "Health", communities: ["Gosa"], status: "Completed" })
    const original = [event("2026-10-22"), event("2026-10-18"), event("2026-10-19", "2026-10-21"), event("2026-10-17")]
    const groups = groupPublishedEvents(original, new Date("2026-10-20T12:00:00Z"))
    expect(groups.current.map(item => item.status)).toEqual(["Running", "Upcoming"])
    expect(groups.past.map(item => item.date)).toEqual(["2026-10-18", "2026-10-17"])
    expect(original[0].status).toBe("Completed")
    expect(groupPublishedEvents([event("2026-10-21")], new Date("2026-10-20T23:30:00Z")).current[0].status).toBe("Running")
    expect(groupPublishedEvents([], new Date())).toEqual({ current: [], past: [] })
  })

  it("keeps homepage layout separate from inner page fixes", () => {
    const home = readFileSync(resolve("app/page.tsx"), "utf8")
    expect(home).not.toContain("inner-page")
    expect(home).toContain("<video")
    const css = readFileSync(resolve("app/globals.css"), "utf8")
    expect(css).toContain(".inner-page .page-container")
    expect(css).toContain("padding-top: 5.0625rem")
    for (const route of ["about", "academy", "impact", "give", "volunteer", "partner", "contact", "news", "events"]) {
      const source = readFileSync(resolve("app", route, "page.tsx"), "utf8")
      expect(source, route).toContain('className="inner-page flex-1"')
      expect(source, route).toContain("page-container")
    }
  })

  it("connects the existing directory and renders the architecture across the grid", () => {
    const source = readFileSync(resolve("components/editorial-copy-page.tsx"), "utf8")
    expect(source).toContain("CopyDirectory items={programmeDirectory.filter")
    expect(source).toContain("No upcoming events are currently listed.")
    expect(source).toContain('className="lg:col-span-12" data-architecture')
    expect(source).toContain("showIntroduction={false}")
    const partner = readFileSync(resolve("app/partner/page.tsx"), "utf8")
    expect(partner).toContain('item.title !== "What we can show you"')
    const contact = readFileSync(resolve("app/contact/page.tsx"), "utf8")
    expect(contact).not.toContain('border-grey-azure/50 bg-parchment/40 p-6 sm:p-10')
  })
})
