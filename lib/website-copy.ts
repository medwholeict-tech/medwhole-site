// Compatibility adapters. The DOCX extraction is the only public copy source.
import { approvedPages, copyLink, type SourcePage, type SourceSection } from "./approved-copy"
import originalLayouts from "./website-copy-layouts.json"
export const faithAccessStatement = "Our work is motivated by Christian faith. Our services are open to everyone, without condition and without regard to faith, background or belief."
export const repeatingAccessCommunity = "Free, and open to everyone in the community."
export const repeatingAccessChildren = "Free, and open to every child in the community."
export type CopyFigure = { value: string; label: string }
export type CopyLink = { label: string; href: string }
export type CopySection = { id?: string; heading?: string; subheading?: string; paragraphs?: string[]; items?: string[]; figures?: CopyFigure[]; quote?: string; buttons?: CopyLink[]; faithStatement?: boolean; accessLine?: string; tone?: "white" | "parchment" | "dark" | "teal" }
export type WebsiteCopyPage = { path: string; pageTitle: string; metaDescription: string; eyebrow: string; heading: string; subheading: string; buttons?: CopyLink[]; sections: CopySection[] }
export type WebsiteCopyEvent = WebsiteCopyPage & { slug: string; standfirst: string; breadcrumb: CopyLink[]; breadcrumbText: string }
function convertSection(section: SourceSection, path: string): CopySection {
 const heading = section.blocks.find((block) => block.kind === "heading")?.text
 const layout = (originalLayouts as Record<string, { sections: CopySection[] }>)[path]?.sections.find((item) => item.heading === section.label || (heading !== undefined && item.heading === heading) || (section.label === "Access" && Boolean(item.accessLine) && !item.heading))
 return {
  ...layout,
  heading: section.blocks.find((b) => b.kind === "heading")?.text || section.label,
  paragraphs: section.blocks.filter((b) => b.kind === "paragraph").map((b) => b.text!),
  items: section.blocks.filter((b) => b.kind === "list").flatMap((b) => b.items!),
  figures: section.blocks.filter((b) => b.kind === "figures").flatMap((b) => b.items!).map((text) => {
   const match = text.match(/^([~₦+]?\d[\d,.+%]*(?:\s*→\s*\d+|m)?)(?:\s+(.*))?$/)
   return { value: match?.[1] || text, label: match?.[2] || "" }
  }),
  quote: section.blocks.find((b) => b.kind === "quote")?.text,
  buttons: section.blocks.filter((b) => b.kind === "buttons").flatMap((b) => b.items!).flatMap((label) => { const href = copyLink(label, path); return href ? [{label,href}] : [] }),
 }
}
function convert(page: SourcePage): WebsiteCopyPage {
 return { path: page.path, pageTitle: page.title, metaDescription: page.description, eyebrow: (originalLayouts as Record<string, { eyebrow: string }>)[page.path]?.eyebrow || page.title,
  heading: page.sections[0].blocks.find((b) => b.kind === "heading")!.text!, subheading: page.sections[0].blocks.filter((block) => ["subheading", "paragraph", "figures"].includes(block.kind)).map((block) => block.text || block.items?.join(" · ")).filter(Boolean).join(" "),
  buttons: page.sections[0].blocks.filter((block) => block.kind === "buttons").flatMap((block) => block.items || []).flatMap((label) => { const href = copyLink(label, page.path); return href ? [{ label, href }] : [] }),
  sections: page.sections.slice(1).map((section) => convertSection(section, page.path)),
 }
}
export { convert as convertSourcePage }

export const websiteCopyPages: Record<string, WebsiteCopyPage> = Object.fromEntries(Object.values(approvedPages).filter((page) => page.path === "/our-work" || page.path.startsWith("/our-work/")).map((page) => [page.path.replace(/^\/our-work\/?/, ""), convert(page)]))
export const websiteCopyEvents: Record<string, WebsiteCopyEvent> = Object.fromEntries(Object.values(approvedPages).filter((page) => page.path.startsWith("/events/")).map((page) => {
 const slug = page.path.split("/").pop()!
 const converted = convert(page)
 return [slug, { ...converted, slug, standfirst: converted.subheading, breadcrumbText: page.breadcrumb, breadcrumb: page.breadcrumb.split(" › ").slice(0,-1).map((label) => ({ label, href: copyLink(label) || "/our-work" })) }]
}))
export const websiteCopyPaths = Object.values(websiteCopyPages).map((page) => page.path)
export const websiteCopyEventPaths = Object.values(websiteCopyEvents).map((page) => page.path)
