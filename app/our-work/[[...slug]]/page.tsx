import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { EditorialCopyPage } from "@/components/editorial-copy-page"
import { BreadcrumbSchema } from "@/components/structured-data"
import { generateSEO } from "@/lib/seo"
import { generateApprovedSEO } from "@/lib/approved-seo"
import { websiteCopyPages } from "@/lib/website-copy"
import { getPayloadWebsitePage } from "@/lib/cms/content"

type OurWorkPageProps = {
  params: Promise<{
    slug?: string[]
  }>
}

export const revalidate = 3600

function pageKey(slug?: string[]) {
  return slug?.join("/") ?? ""
}

export function generateStaticParams() {
  return Object.keys(websiteCopyPages).map((key) => ({ slug: key ? key.split("/") : [] }))
}

export async function generateMetadata(props: OurWorkPageProps): Promise<Metadata> {
  const params = await props.params;
  const key = pageKey(params.slug)
  const path = key ? `/our-work/${key}` : "/our-work"
  const page = (await getPayloadWebsitePage(path)) || websiteCopyPages[key]

  if (!page) {
    return generateSEO({ title: "Page not found", url: "/our-work", noindex: true })
  }

  return generateApprovedSEO(page.path)
}

export default async function OurWorkPage(props: OurWorkPageProps) {
  const params = await props.params;
  const key = pageKey(params.slug)
  const path = key ? `/our-work/${key}` : "/our-work"
  const page = (await getPayloadWebsitePage(path)) || websiteCopyPages[key]
  if (!page) notFound()

  const breadcrumbSegments = page.path.split("/").filter(Boolean)
  const breadcrumbItems = breadcrumbSegments.map((segment, index) => {
    const url = `/${breadcrumbSegments.slice(0, index + 1).join("/")}`
    const linkedPage = Object.values(websiteCopyPages).find((candidate) => candidate.path === url)
    return {
      name: linkedPage?.eyebrow ?? segment.replaceAll("-", " "),
      url,
    }
  })

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, ...breadcrumbItems]} />
      <EditorialCopyPage page={page} />
    </>
  )
}
