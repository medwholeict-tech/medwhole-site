import { defineType, defineField } from 'sanity'

export const newsSchema = defineType({
  name: 'news',
  title: 'News Articles',
  type: 'document',
  fields: [
    defineField({ name: 'relatedPath', title: 'Related programme or event page', type: 'string', description: 'Link the report to its canonical programme or event URL.' }),
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'content',
      title: 'Content',
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
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
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
          { title: 'Announcements', value: 'announcement' },
          { title: 'Quarterly reports', value: 'quarterly-report' },
          { title: 'Research', value: 'research' },
          { title: 'Impact Story', value: 'impact-story' },
          { title: 'Partnership', value: 'partnership' },
          { title: 'Program Update', value: 'program-update' },
        ],
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Article',
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
      date: 'publishedAt',
    },
    prepare(selection) {
      const { title, media, category, date } = selection
      return {
        title: title,
        media: media,
        subtitle: `${category || 'General'} - ${new Date(date).toLocaleDateString()}`,
      }
    },
  },
})
