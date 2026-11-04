import { describe, expect, it } from "vitest"
import { approvedPages } from "../lib/approved-copy"
import {
  faithAccessStatement,
  websiteCopyEventPaths,
  websiteCopyEvents,
  websiteCopyPages,
  websiteCopyPaths,
} from "../lib/website-copy"

describe("developer-approved website copy", () => {
  it("contains the complete 11 our-work and programme pages plus 5 events", () => {
    expect(Object.keys(websiteCopyPages)).toHaveLength(11)
    expect(Object.keys(websiteCopyEvents)).toHaveLength(5)
  })

  it("uses unique final paths", () => {
    const paths = [...websiteCopyPaths, ...websiteCopyEventPaths]
    expect(new Set(paths).size).toBe(paths.length)
    expect(paths.every((path) => path.startsWith("/"))).toBe(true)
  })

  it("keeps the approved reusable faith and access statement exact", () => {
    expect(faithAccessStatement).toBe(
      "Our work is motivated by Christian faith. Our services are open to everyone, without condition and without regard to faith, background or belief.",
    )
  })

  it("stores figures as data records", () => {
    const figures = [
      ...Object.values(websiteCopyPages),
      ...Object.values(websiteCopyEvents),
    ].flatMap((page) => page.sections.flatMap((section) => section.figures ?? []))

    expect(figures.length).toBeGreaterThan(40)
    const sourceFigures = new Set(Object.values(approvedPages).flatMap((page) => page.sections.flatMap((section) => section.blocks.filter((block) => block.kind === "figures").flatMap((block) => block.items || []))))
    expect(figures.every((figure) => figure.value && (figure.label || sourceFigures.has(figure.value)))).toBe(true)
  })

  it("keeps compound figures and hero body copy without changing the page layout", () => {
    const challenge = websiteCopyPages["empowerment/community-innovation-challenge"]
    const source = approvedPages[challenge.path].sections[0].blocks.find((block) => block.kind === "paragraph")!.text!
    expect(challenge.subheading).toContain(source)
    const figures = Object.values(websiteCopyPages).flatMap((page) => page.sections.flatMap((section) => section.figures || []))
    expect(figures).toContainEqual({ value: "₦2m", label: "pilot budget" })
    const eventFigures = Object.values(websiteCopyEvents).flatMap((page) => page.sections.flatMap((section) => section.figures || []))
    expect(eventFigures).toContainEqual({ value: "Primary 1 to SS 3", label: "" })
  })

  it("does not introduce the rejected phrase", () => {
    const copy = JSON.stringify({ websiteCopyPages, websiteCopyEvents }).toLowerCase()
    expect(copy).not.toContain("bible study")
  })
})
