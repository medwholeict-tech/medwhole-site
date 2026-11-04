import { absoluteUrl, siteConfig } from "@/lib/seo"
import { socialProfileUrls } from "@/lib/social-links"
import { serializeJsonLd } from "@/lib/json-ld"

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "NGO"],
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/icon/Logo System Dark Azure (With Colours).png"),
        },
        image: absoluteUrl(siteConfig.ogImage),
        description: siteConfig.description,
        slogan: "Whole People. Lasting Impact.",
        identifier: {
          "@type": "PropertyValue",
          propertyID: "Charity ID",
          value: siteConfig.charityId,
        },
        email: "info@medwhole.org",
        telephone: "+2348189800001",
        address: {
          "@type": "PostalAddress",
          streetAddress: "7 Nissi Drive, Fort Royal Airport Road",
          addressLocality: "Abuja",
          addressRegion: "FCT",
          addressCountry: "NG",
        },
        areaServed: { "@type": "Country", name: "Nigeria" },
        sameAs: socialProfileUrls,
        contactPoint: {
          "@type": "ContactPoint",
          email: "info@medwhole.org",
          telephone: "+2348189800001",
          contactType: "general enquiries",
          areaServed: "NG",
          availableLanguage: ["English"],
        },
        knowsAbout: ["Health", "Literacy", "Empowerment", "Whole-person development"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        description: siteConfig.description,
        publisher: { "@id": `${siteConfig.url}/#organization` },
        inLanguage: "en-NG",
      },
    ],
  }

  return <JsonLd data={schema} />
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url.startsWith("http") ? item.url : absoluteUrl(item.url),
        })),
      }}
    />
  )
}

export function ArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
}: {
  title: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author: string
  url: string
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        image: image.startsWith("http") ? image : absoluteUrl(image),
        datePublished,
        dateModified: dateModified || datePublished,
        author: { "@type": "Organization", name: author || siteConfig.name, url: siteConfig.url },
        publisher: { "@id": `${siteConfig.url}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": url.startsWith("http") ? url : absoluteUrl(url) },
        inLanguage: "en-NG",
      }}
    />
  )
}

export function EventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  image,
  url,
  status,
}: {
  name: string
  description: string
  startDate: string
  endDate?: string
  location: string
  image?: string
  url: string
  status?: "upcoming" | "ongoing" | "completed" | "cancelled"
}) {
  const statusMap = {
    upcoming: "https://schema.org/EventScheduled",
    ongoing: "https://schema.org/EventScheduled",
    completed: "https://schema.org/EventCompleted",
    cancelled: "https://schema.org/EventCancelled",
  }

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Event",
        name,
        description,
        startDate,
        endDate: endDate || startDate,
        eventStatus: status ? statusMap[status] : statusMap.upcoming,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: location,
          address: { "@type": "PostalAddress", addressCountry: "NG" },
        },
        image: image ? (image.startsWith("http") ? image : absoluteUrl(image)) : absoluteUrl(siteConfig.ogImage),
        organizer: { "@id": `${siteConfig.url}/#organization` },
        url: url.startsWith("http") ? url : absoluteUrl(url),
        inLanguage: "en-NG",
      }}
    />
  )
}
