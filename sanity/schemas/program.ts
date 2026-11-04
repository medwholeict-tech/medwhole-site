import { defineType, defineField } from 'sanity'

export const programSchema = defineType({
  name: 'program',
  title: 'Programs',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Full Content',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Health Services', value: 'health' },
          { title: 'Education', value: 'education' },
          { title: 'Nutrition', value: 'nutrition' },
          { title: 'Empowerment', value: 'capacity' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'objectives',
      title: 'Key Objectives',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'impact',
      title: 'Impact Metrics',
      type: 'object',
      fields: [
        { name: 'beneficiaries', type: 'number', title: 'Number of Beneficiaries' },
        { name: 'locations', type: 'number', title: 'Number of Locations' },
        { name: 'yearStarted', type: 'number', title: 'Year Started' },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Program',
      type: 'boolean',
      initialValue: false,
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
      title: 'title',
      media: 'featuredImage',
      category: 'category',
    },
    prepare(selection) {
      const { title, media, category } = selection
      return {
        title: title,
        media: media,
        subtitle: category || 'Uncategorized',
      }
    },
  },
})
