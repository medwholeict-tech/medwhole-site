import { existsSync, readFileSync, statSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { libraryPhotos, libraryPhotoHref, libraryPhotoSrc } from "../lib/photo-library"
import { getPageVisualSystem } from "../lib/page-visuals"
import { defaultCommunityStories } from "../lib/community-stories"

describe("user-supplied photo library", () => {
  it("uses distinct representative community photos and the selected Academy and story photos", () => {
    expect(new Set(defaultCommunityStories.map(item => item.imageSrc)).size).toBe(4)
    for (const item of defaultCommunityStories) {
      expect(item.imageSrc).toContain("/images/library/")
      expect(existsSync(resolve("public", item.imageSrc.slice(1)))).toBe(true)
      expect(item.imageAlt).toContain("Illustrative")
      expect(item.imageAlt).not.toMatch(/Gosa|Kunyami|Toge|2026/)
    }
    const home = readFileSync(resolve("app/page.tsx"), "utf8")
    expect(home).toContain('src="/images/library/img-5318.webp"')
    expect(home).toContain('src="/images/library/mg-9161.webp"')
    expect(home).toContain("Seven referrals, seven recoveries")
    expect(home).toContain("Whole child. Whole family. Whole community.")
  })

  it("includes all 32 unique originals and their optimised gallery copies", () => {
    expect(libraryPhotos).toHaveLength(32)
    expect(new Set(libraryPhotos.map(photo => photo.name)).size).toBe(32)
    for (const photo of libraryPhotos) {
      const src = libraryPhotoSrc(photo.name)
      for (const file of [src, src.replace(".webp", "-gallery.webp")]) {
        const local = resolve("public", file.slice(1))
        expect(existsSync(local), file).toBe(true)
        expect(statSync(local).size, file).toBeLessThan(600_000)
      }
      expect(photo.alt.length).toBeGreaterThan(25)
      expect(photo.alt).not.toMatch(/Gosa|Kunyami|Toge|2026|Summer School/)
      expect(libraryPhotoHref(photo.category)).toMatch(/^\/(our-work|impact|get-involved)/)
    }
  })

  it("uses the library in the flowing gallery without replacing the video hero", () => {
    const gallery = readFileSync(resolve("components/flowing-gallery.tsx"), "utf8")
    expect(gallery).toContain("...libraryPhotos.map")
    expect(gallery).toContain('"-gallery.webp"')
    expect(gallery).toContain('loading="lazy"')
    expect(gallery).toContain('aria-pressed={paused}')
    const home = readFileSync(resolve("app/page.tsx"), "utf8")
    expect(home).toContain("<video")
    expect(home).toContain("website%20Hero.mp4")
    expect(home).toContain('/images/library/mg-9074-copy.webp')
    expect(home).toContain('/images/library/dsc08737.webp')
  })

  it("matches generic health and empowerment pages but preserves dated event imagery", () => {
    expect(getPageVisualSystem("/our-work/health").hero.src).toContain("/images/library/")
    expect(getPageVisualSystem("/our-work/empowerment").hero.src).toContain("/images/library/")
    expect(getPageVisualSystem("/events/kunyami-health-outreach-feb-2026").hero.src).not.toContain("/images/library/")
    expect(getPageVisualSystem("/events/compart-graduation-jun-2026").hero.src).not.toContain("/images/library/")
  })
})
