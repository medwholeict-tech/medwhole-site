import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("copy changes preserve the established page designs", () => {
  it("keeps the original homepage video hero and stylesheet", () => {
    const home = readFileSync(resolve("app/page.tsx"), "utf8")
    expect(home).toContain('import styles from "./home.module.css"')
    expect(home).toContain('<video')
    expect(home).toContain('className={styles.heroVideo}')
    expect(home).toContain('https://ik.imagekit.io/hardyonahi/website%20Hero.mp4?updatedAt=1789054113248')
    expect(home).toContain('<CommunityDossier />')
    expect(home).toContain('<FlowingGallery />')
    expect(home.indexOf('<FlowingGallery />')).toBeLessThan(home.indexOf('</main>'))
    expect(home.indexOf('<FlowingGallery />')).toBeGreaterThan(home.indexOf('<HomeUpdates />'))
  })

  it("places community context before the detailed story and shows the full copy", () => {
    const home = readFileSync(resolve("app/page.tsx"), "utf8")
    expect(home.indexOf('className={styles.placesSection}')).toBeLessThan(home.indexOf('className={styles.storySection}'))
    const communities = readFileSync(resolve("components/community-dossier.tsx"), "utf8")
    expect(communities).not.toContain('line-clamp')
    expect(communities).toContain('>{item.name}</h3>')
    expect(communities).toContain('item.headline + " "')
  })

  it("keeps compact-footer essentials and user-controlled gallery motion", () => {
    const footer = readFileSync(resolve("components/site-footer.tsx"), "utf8")
    for (const content of ['info@medwhole.org', '+234 818 980 0001', 'MedWHOLE Resource Centre', 'Charity ID', '/privacy', '/terms', '/safeguarding', '/about/accountability']) expect(footer).toContain(content)
    const gallery = readFileSync(resolve("components/flowing-gallery.tsx"), "utf8")
    expect(gallery).toContain('Pause gallery')
    expect(gallery).toContain('aria-pressed={paused}')
    expect(gallery).not.toContain('href="/gallery"')
    const styles = readFileSync(resolve("app/globals.css"), "utf8")
    expect(styles).toContain('.flowing-marquee-wrapper:focus-within')
    expect(styles).toContain('.flowing-marquee-track > [aria-hidden="true"]')
  })

  it("does not replace the existing templates with the generic copy layout", () => {
    const routes = ["", "about", "about/journey", "about/team", "about/accountability", "academy", "academy/summer-school", "academy/good-news-club", "academy/reading-club", "academy/scholarship", "academy/exam-coaching", "impact", "get-involved", "give", "volunteer", "partner", "contact", "news", "events", "safeguarding"]
    for (const route of routes) {
      const source = readFileSync(resolve("app", route, "page.tsx"), "utf8")
      expect(source, route || "/").not.toContain('<ApprovedCopyPage')
    }
  })
})
