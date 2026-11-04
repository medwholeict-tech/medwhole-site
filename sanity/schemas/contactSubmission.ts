import { defineField, defineType } from "sanity"

export const contactSubmissionSchema = defineType({
  name: "contactSubmission",
  title: "Contact Submissions",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "subject",
      title: "Area of interest",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Follow-up status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In progress", value: "in-progress" },
          { title: "Resolved", value: "resolved" },
          { title: "Spam", value: "spam" },
        ],
      },
      initialValue: "new",
      validation: (Rule) => Rule.required(),
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
    select: { title: "name", email: "email", subject: "subject", status: "status" },
    prepare({ title, email, subject, status }) {
      return {
        title: title || email || "Contact submission",
        subtitle: `${subject || "General enquiry"} - ${status || "new"}`,
      }
    },
  },
})
