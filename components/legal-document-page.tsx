import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { LegalSectionLink } from "@/components/legal-section-link"
import type { LegalBlock, LegalDocument } from "@/lib/legal-document"

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  return (
    <div className="flex min-h-screen flex-col bg-parchment">
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        <header className="bg-dark-azure text-white">
          <div className="page-container py-16 sm:py-20 lg:py-24">
            <p className="eyebrow text-amber-flame">{document.eyebrow}</p>
            <h1 className="max-w-3xl font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">{document.title}</h1>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-pale-sky/40 pt-5 text-sm text-pale-sky">
              <p><span className="font-semibold text-white">{document.effectiveLabel}:</span> {document.effectiveDate}</p>
              <p>MedWHOLE Alliance for Health and Development</p>
            </div>
          </div>
        </header>

        <div className="grid page-container gap-10 py-12 sm:py-16 lg:grid-cols-[16rem_minmax(0,1fr)] lg:py-20">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <details className="rounded-[4px] border border-grey-azure/50 bg-white p-4 lg:hidden">
              <summary className="cursor-pointer font-semibold text-dark-azure">View document contents</summary>
              <nav aria-label={`${document.title} mobile contents`} className="mt-4 border-l border-grey-azure/50 pl-5">
                <ol className="flex flex-col gap-2.5 text-sm leading-5">
                  {document.sections.map((section) => (
                    <li key={section.id}>
                      <LegalSectionLink id={section.id}>{section.title}</LegalSectionLink>
                    </li>
                  ))}
                </ol>
              </nav>
            </details>
            <nav aria-label={`${document.title} contents`} className="hidden max-h-[calc(100vh-8rem)] overflow-y-auto border-l border-grey-azure/50 pl-5 pr-3 lg:block">
              <p className="mb-4 eyebrow text-pine-teal">On this page</p>
              <ol className="flex flex-col gap-2.5 text-sm leading-5">
                {document.sections.map((section) => (
                  <li key={section.id}>
                    <LegalSectionLink id={section.id}>{section.title}</LegalSectionLink>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="min-w-0 rounded-[4px] border border-grey-azure/50 bg-white px-5 py-8 sm:px-8 lg:py-12">
            <p className="border-l-4 border-amber-flame pl-5 text-lg leading-8 text-dark-azure">{document.introduction}</p>
            <div className="mt-12 flex flex-col gap-12">
              {document.sections.map((section) => (
                <section key={section.id} id={section.id} tabIndex={-1} className="scroll-mt-28 outline-none" aria-labelledby={`${section.id}-heading`}>
                  <h2 id={`${section.id}-heading`} className="font-heading text-2xl leading-tight text-dark-azure sm:text-3xl">{section.title}</h2>
                  <div className="mt-5 flex flex-col gap-4 text-base leading-7 text-graphite">
                    {section.blocks.map((block, index) => <LegalBlockView key={`${section.id}-${index}`} block={block} />)}
                  </div>
                </section>
              ))}
            </div>
            {document.closing ? (
              <p className="mt-14 border-t border-grey-azure/50 pt-8 font-heading text-xl leading-8 text-pine-teal">{document.closing}</p>
            ) : null}
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function LegalBlockView({ block }: { block: LegalBlock }) {
  if (block.type === "subheading") {
    return <h3 className="pt-2 font-heading text-xl text-dark-azure">{block.text}</h3>
  }

  if (block.type === "list") {
    return (
      <ul className="flex list-disc flex-col gap-2 pl-6 marker:text-pine-teal">
        {block.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    )
  }

  if (block.type === "callout") {
    return (
      <div className="rounded-[4px] border border-grey-azure/50 bg-parchment p-5">
        <p className="eyebrow text-pine-teal">{block.label}</p>
        <p className="mt-2 text-dark-azure">{block.text}</p>
      </div>
    )
  }

  return <p className="whitespace-pre-line">{block.text}</p>
}
