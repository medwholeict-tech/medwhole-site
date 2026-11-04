import { approvedPages } from "@/lib/approved-copy"
import { generateSEO, type SEOProps } from "@/lib/seo"

type ApprovedSEOOptions = Omit<SEOProps, "title" | "description" | "url" | "titleIsAbsolute">

/** Build standard page metadata from the approved website-copy source of truth. */
export function generateApprovedSEO(path: string, options: ApprovedSEOOptions = {}) {
  const page = approvedPages[path]
  if (!page) return generateSEO({ ...options, url: path })

  return generateSEO({
    ...options,
    title: page.title,
    titleIsAbsolute: true,
    description: page.description,
    url: page.path,
  })
}
