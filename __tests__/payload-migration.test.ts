import { describe, expect, it, vi, beforeEach } from "vitest"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { toLexical, publicDetails } from "../scripts/lib/content-mapping.mjs"

describe("content migration", () => {
  it("preserves headings, emphasis, lists and safe links in native rich text", () => {
    const result = toLexical([
      { _type: "block", style: "h2", children: [{ text: "Community", marks: ["strong"] }] },
      { _type: "block", listItem: "bullet", children: [{ text: "First", marks: [] }] },
      { _type: "block", listItem: "bullet", children: [{ text: "Second", marks: ["em"] }] },
      { _type: "block", markDefs: [{ _key: "link", _type: "link", href: "https://www.medwhole.org/" }], children: [{ text: "Visit", marks: ["link"] }] },
    ])
    expect(result!.root.children[0]).toMatchObject({ type: "heading", tag: "h2", children: [{ text: "Community", format: 1 }] })
    expect(result!.root.children[1]).toMatchObject({ type: "list", children: [{ type: "listitem" }, { type: "listitem" }] })
    expect(result!.root.children[2].children[0]).toMatchObject({ type: "link", fields: { url: "https://www.medwhole.org/" } })
  })
  it("does not import an executable link as a clickable URL", () => {
    const result = toLexical([{ _type: "block", markDefs: [{ _key: "link", _type: "link", href: "javascript:alert(1)" }], children: [{ text: "Read", marks: ["link"] }] }])
    expect(result!.root.children[0].children[0]).toMatchObject({ type: "text", text: "Read" })
  })
  it("uses copied public assets for existing story imagery and preserves context", () => {
    const record = { title: "Outreach", status: "completed", communityContext: "A community story", featuredImage: { asset: { _ref: "image-id" }, alt: "Nurse speaking" }, storyMoments: [{ _key: "moment", image: { asset: { _ref: "image-id" } }, caption: "Care" }] }
    const mapped = publicDetails(record, { "image-id": { url: "/images/content/copied.jpg" } })
    expect(mapped).toMatchObject({ status: "completed", communityContext: "A community story", publicImage: { url: "/images/content/copied.jpg", alt: "Nurse speaking" }, storyMoments: [{ caption: "Care", image: { url: "/images/content/copied.jpg" } }] })
  })
})

describe("CMS dependency boundary", () => {
  it("has no live imports, environment variables or endpoints for the retired CMS", () => {
    const files: string[] = []
    function walk(path: string) { for (const entry of readdirSync(path, { withFileTypes: true })) { const target = join(path, entry.name); if (entry.isDirectory()) walk(target); else if (/\.(ts|tsx)$/.test(entry.name)) files.push(target) } }
    for (const directory of ["app", "lib", "components"]) walk(directory)
    const retired = new RegExp("@" + "sanity/|next-" + "sanity|SAN" + "ITY_|api\\." + "sanity\\.io|cdn\\." + "sanity\\.io")
    const offenders = files.filter(file => retired.test(readFileSync(file, "utf8")))
    expect(offenders).toEqual([])
    const pkg = JSON.parse(readFileSync("package.json", "utf8"))
    expect([...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)].filter(name => /sanity|portabletext/.test(name))).toEqual([])
  })
})
