import { SiteHeader } from "@/components/site-header"
import type { Metadata } from "next"
import { cache } from "react"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, ArrowRight, User } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"
import { CmsRichText } from "@/components/cms-rich-text"
import Image from "next/image"
import { NewsletterForm } from "@/components/newsletter-form"
import { StorySupportCta } from "@/components/story-support-cta"
import { ArticleSchema, BreadcrumbSchema } from "@/components/structured-data"
import { generateSEO, metaDescription, siteConfig } from "@/lib/seo"
import { getPayloadNews, getPayloadNewsBySlug } from "@/lib/cms/content"

type ArticleView = {
  id: string
  title: string
  slug: string
  excerpt: string
  author?: string
  category?: string
  publishedAt: string
  updatedAt?: string
  imageUrl?: string
  imageAlt: string
  content?: unknown
  body?: string
}

const getArticle = cache(async (slug: string): Promise<ArticleView | null> => {
  return await getPayloadNewsBySlug(slug)
})

async function getRelatedArticles(category: string | undefined, slug: string): Promise<ArticleView[]> {
  return (await getPayloadNews()).filter(article => article.slug !== slug && (!category || article.category === category)).slice(0, 3)
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const article = await getArticle(params.slug)
  if (!article) {
    return generateSEO({ title: "Story not found", url: `/news/${params.slug}`, noindex: true })
  }

  return generateSEO({
    title: article.title,
    description: metaDescription(article.excerpt),
    image: article.imageUrl,
    imageAlt: article.imageAlt,
    url: `/news/${params.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    author: article.author || siteConfig.name,
    tags: article.category ? [article.category] : undefined,
  })
}

export default async function NewsArticlePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  const filteredRelated = await getRelatedArticles(article.category, article.slug)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "News, Events and Stories", url: "/news" }, { name: article.title, url: `/news/${params.slug}` }]} />
        <ArticleSchema
          title={article.title}
          description={metaDescription(article.excerpt)}
          image={article.imageUrl || siteConfig.ogImage}
          datePublished={article.publishedAt}
          dateModified={article.updatedAt}
          author={article.author || siteConfig.name}
          url={`/news/${params.slug}`}
        />
        {/* Hero Section */}
        <section className="bg-dark-azure text-white">
          <div className="page-container py-16 sm:py-20 lg:py-24">
            <div className="max-w-3xl">
              <Link
                href="/news"
                className="mb-6 inline-flex items-center gap-2 text-sm text-pale-sky transition-colors hover:text-white"
              >
                <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
                Back to News
              </Link>
              {article.category && <span className="meta-label mb-4 block text-pale-sky">{article.category}</span>}
              <h1 className="mb-6 font-heading text-4xl leading-tight text-balance sm:text-5xl lg:text-6xl">{article.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-pale-sky">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {new Date(article.publishedAt).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {article.author && (
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" aria-hidden="true" />
                    {article.author}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Featured Image */}
                {article.imageUrl && (
                  <div className="relative aspect-video rounded-[4px] overflow-hidden mb-12 border border-grey-azure/50 shadow-none">
                    <Image
                      src={article.imageUrl}
                      alt={article.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                  </div>
                )}

                {/* Article Excerpt */}
                {article.excerpt && (
                  <div className="text-xl text-graphite mb-8 leading-relaxed font-medium">
                    {article.excerpt}
                  </div>
                )}

                {/* Article Body */}
                {article.content ? (
                  <div className="article-prose max-w-none">
                    <CmsRichText value={article.content} />
                  </div>
                ) : article.body ? (
                  <div className="article-prose max-w-none">
                    {article.body.split(/\n{2,}/).map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}

                {/* Tags */}
                {article.category && (
                  <div className="mt-12 border-t border-grey-azure/50 pt-8">
                    <h3 className="meta-label mb-4 text-graphite">CATEGORY</h3>
                    <span className="inline-flex border border-grey-azure/50 bg-parchment px-3 py-1 text-sm text-dark-azure">
                      {article.category}
                    </span>
                  </div>
                )}

                {/* Share */}
                <div className="mt-8 border-t border-grey-azure/50 pt-8">
                  <h3 className="meta-label mb-4 text-graphite">SHARE THIS ARTICLE</h3>
                  <ShareButtons url={`${siteConfig.url}/news/${params.slug}`} title={article.title} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                  {/* Author Card */}
                  <Card className="rounded-[4px] border-grey-azure/50 bg-white shadow-none">
                    <CardContent className="p-6">
                      <h3 className="mb-4 font-heading text-xl text-dark-azure">About the Author</h3>
                      <div className="flex items-start gap-4">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[4px] border border-grey-azure/50 bg-pale-sky">
                          <User className="h-8 w-8 text-pine-teal" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-semibold mb-1">{article.author || "MedWHOLE Team"}</p>
                          <p className="text-sm text-graphite">
                            Contributing writer for MedWHOLE Alliance communications
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Newsletter Signup */}
                  <Card className="rounded-[4px] border-dark-azure bg-dark-azure text-white shadow-none">
                    <CardContent className="p-6">
                      <h3 className="mb-3 font-heading text-xl">Stay Updated</h3>
                      <p className="mb-4 text-sm text-pale-sky">
                        Subscribe to our newsletter for the latest news and updates.
                      </p>
                      <NewsletterForm source="news-article" compact inverted />
                    </CardContent>
                  </Card>

                  {/* Related Articles */}
                  {filteredRelated.length > 0 && (
                    <Card className="rounded-[4px] border-grey-azure/50 bg-white shadow-none">
                      <CardContent className="p-6">
                        <h3 className="mb-4 font-heading text-xl text-dark-azure">Related Articles</h3>
                        <div className="space-y-4">
                          {filteredRelated.map((related) => (
                            <Link
                              key={related.id}
                              href={`/news/${related.slug}`}
                              className="group -mx-3 block rounded-[4px] p-3 transition-colors hover:bg-parchment"
                            >
                              {related.category && (
                                <span className="meta-label mb-2 block text-pine-teal">
                                  {related.category}
                                </span>
                              )}
                              <h4 className="mb-2 line-clamp-2 font-heading text-base text-dark-azure transition-colors group-hover:text-pine-teal">
                                {related.title}
                              </h4>
                              <p className="text-xs text-graphite">
                                {related.publishedAt ? new Date(related.publishedAt).toLocaleDateString("en-GB", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }) : ""}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <StorySupportCta title={article.title} sourcePath={`/news/${params.slug}`} eyebrow="Stand with this story" />
      </main>
      <SiteFooter />
    </div>
  );
}
