import { defineType, defineField } from 'sanity'

export const faqSchema = defineType({
  name: 'faq',
  title: 'FAQs',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Programs', value: 'programs' },
          { title: 'Donations', value: 'donations' },
          { title: 'Volunteering', value: 'volunteering' },
          { title: 'Events', value: 'events' },
          { title: 'Partnerships', value: 'partnerships' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'question',
      category: 'category',
    },
    prepare({ title, category }) {
      return {
        title,
        subtitle: category || 'General',
      }
    },
  },
})
