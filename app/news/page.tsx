import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getPayloadNews } from "@/lib/cms/content"
import { filterNewsCategory, newsCategories, newsCategoryLabels, selectedNewsCategory } from "@/lib/public-page-ux"
import { generateApprovedSEO } from "@/lib/approved-seo"

export const metadata = generateApprovedSEO("/news")

type NewsArticle = { id: string; title: string; slug: string; excerpt?: string; imageUrl?: string; imageAlt?: string; category?: string; publishedAt?: string }

export default async function NewsPage(props: { searchParams?: Promise<{ category?: string | string[] }> }) {
  const searchParams = await props.searchParams;
  const selected = selectedNewsCategory(searchParams?.category)
  const payloadArticles = await getPayloadNews()
  const sourceArticles: NewsArticle[] = payloadArticles
  const articles = filterNewsCategory<NewsArticle>(sourceArticles, selected)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        <section className="bg-dark-azure text-white" aria-labelledby="news-heading">
          <div className="page-container py-16 sm:py-20 lg:py-24">
            <p className="eyebrow text-amber-flame">News and Events</p>
            <h1 id="news-heading" className="font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">News</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-pale-sky sm:text-xl">Updates and reports from the work.</p>
          </div>
        </section>
        <nav className="border-b border-grey-azure/50 bg-parchment py-4" aria-label="News categories">
          <div className="flex page-container flex-wrap gap-x-8 gap-y-3">
            {["All reports", ...newsCategories].map((category) => {
              const active = category === "All reports" ? !selected : selected === category
              return <Link key={category} href={category === "All reports" ? "/news" : `/news?category=${encodeURIComponent(category)}`} aria-current={active ? "page" : undefined} className={`inline-flex min-h-11 items-center border-b-2 text-sm font-semibold text-dark-azure focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pine-teal ${active ? "border-pine-teal" : "border-transparent hover:border-grey-azure"}`}>{category}</Link>
            })}
          </div>
        </nav>
        <section className="py-12 sm:py-16">
          <div className="page-container">
            {articles.length ? (
              <ul className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <li key={article.id} className="group">
                    <Link href={`/news/${article.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-teal">
                      {article.imageUrl ? <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[4px] border border-grey-azure/50 bg-pale-sky"><Image src={article.imageUrl} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" /></div> : null}
                      <p className="meta-label text-pine-teal">{newsCategoryLabels[article.category || ""] || article.category}{article.publishedAt ? ` · ${new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(new Date(article.publishedAt))}` : ""}</p>
                      <h2 className="font-heading text-xl leading-snug text-dark-azure sm:text-2xl">{article.title}</h2>
                      {article.excerpt ? <p className="mt-3 text-sm leading-7 text-graphite sm:text-base">{article.excerpt}</p> : null}
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-pine-teal">Read report <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div role="status" className="max-w-2xl text-base leading-8 text-graphite">{selected ? <><p>No reports in this category yet.</p><Link href="/news" className="mt-4 inline-flex min-h-11 items-center font-semibold text-pine-teal underline underline-offset-4">View all reports</Link></> : <p>There are no news reports to show yet. Visit the events page for dated programme activity.</p>}</div>
            )}
            <div className="mt-12 border-t border-grey-azure/50 pt-6">
              <Link href="/events" className="inline-flex items-center gap-2 font-semibold text-dark-azure hover:text-pine-teal">View Events <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
