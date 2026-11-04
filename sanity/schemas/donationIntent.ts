import { defineField, defineType } from "sanity"

export const donationIntentSchema = defineType({
  name: "donationIntent",
  title: "Donation Intents",
  type: "document",
  fields: [
    defineField({
      name: "reference",
      title: "Reference",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fullName",
      title: "Donor name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone / WhatsApp", type: "string" }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      options: {
        list: [
          { title: "Nigerian naira (NGN)", value: "NGN" },
          { title: "US dollar (USD)", value: "USD" },
          { title: "British pound (GBP)", value: "GBP" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amount",
      title: "Intended amount",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "frequency",
      title: "Frequency",
      type: "string",
      options: {
        list: [
          { title: "One-time", value: "one-time" },
          { title: "Monthly", value: "monthly" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "programme",
      title: "Preferred use",
      type: "string",
      options: {
        list: [
          { title: "Where needed most", value: "where-needed" },
          { title: "Health", value: "health" },
          { title: "Literacy", value: "literacy" },
          { title: "Empowerment", value: "empowerment" },
        ],
      },
    }),
    defineField({
      name: "designation",
      title: "Specific event or story",
      type: "string",
      readOnly: true,
      description: "The event or story selected when the donor began this intent.",
    }),
    defineField({
      name: "sourcePath",
      title: "Source page",
      type: "string",
      readOnly: true,
      description: "The website page that led to this donation intent.",
    }),
    defineField({
      name: "expectedTransferDate",
      title: "Expected transfer date",
      type: "date",
    }),
    defineField({
      name: "status",
      title: "Follow-up status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Instructions sent", value: "instructions-sent" },
          { title: "Contacted", value: "contacted" },
          { title: "Transfer reported", value: "transfer-reported" },
          { title: "Donation confirmed", value: "confirmed" },
          { title: "Closed", value: "closed" },
        ],
      },
      initialValue: "new",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "emailStatus",
      title: "Donor email status",
      type: "string",
      options: {
        list: [
          { title: "Not requested", value: "not-requested" },
          { title: "Sent", value: "sent" },
          { title: "Failed", value: "failed" },
        ],
      },
    }),
    defineField({
      name: "consent",
      title: "Follow-up consent",
      type: "boolean",
      readOnly: true,
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "notes",
      title: "Internal notes",
      type: "text",
      rows: 4,
      description: "Follow-up notes for the MedWHOLE team.",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "fullName",
      reference: "reference",
      amount: "amount",
      currency: "currency",
      status: "status",
    },
    prepare({ title, reference, amount, currency, status }) {
      const formattedAmount = amount && currency ? `${currency} ${Number(amount).toLocaleString()}` : "Amount not set"
      return {
        title: title || "Unnamed donor",
        subtitle: `${reference || "No reference"} - ${formattedAmount} - ${status || "new"}`,
      }
    },
  },
})
