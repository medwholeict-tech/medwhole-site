import { defineField, defineType } from "sanity"

export const communitySchema = defineType({
  name: "community", title: "Communities", type: "document",
  fields: [
    defineField({ name: "name", title: "Community name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (rule) => rule.required() }),
    defineField({ name: "establishedAt", title: "Work began", type: "date", validation: (rule) => rule.required() }),
    defineField({ name: "homepageSummary", title: "Homepage summary", type: "text" }),
    defineField({ name: "description", title: "Community page description", type: "text" }),
    defineField({ name: "subheading", title: "Standfirst", type: "text" }),
    defineField({ name: "sections", title: "Page sections", type: "array", of: [{ type: "object", fields: [{ name: "heading", type: "string", title: "Heading" }, { name: "paragraphs", type: "array", title: "Paragraphs", of: [{ type: "string" }] }] }] }),
    defineField({ name: "image", title: "Homepage photograph", type: "image", fields: [{ name: "alt", type: "string", title: "Alternative text" }, { name: "consentConfirmed", type: "boolean", title: "Written image consent confirmed" }] }),
    defineField({ name: "hasEstablishedWork", title: "Enough established work for an honest community story", type: "boolean", initialValue: false }),
    defineField({ name: "isActive", title: "Published", type: "boolean", initialValue: false }),
  ],
})
