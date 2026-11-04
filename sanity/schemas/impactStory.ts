import { defineType, defineField } from 'sanity'

export const impactStorySchema = defineType({
  name: 'impactStory',
  title: 'Impact Stories',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Story Title',
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
      title: 'Full Story',
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
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'beneficiaryName',
      title: 'Beneficiary Name',
      type: 'string',
      description: 'Name of the person/community featured (can be anonymized)',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'relatedProgram',
      title: 'Related Program',
      type: 'reference',
      to: [{ type: 'program' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'impactMetrics',
      title: 'Impact Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'metric', type: 'string', title: 'Metric Name' },
            { name: 'value', type: 'string', title: 'Value' },
            { name: 'description', type: 'text', title: 'Description', rows: 2 },
          ],
          preview: {
            select: {
              metric: 'metric',
              value: 'value',
            },
            prepare({ metric, value }) {
              return {
                title: metric,
                subtitle: value,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'beforeAfter',
      title: 'Before & After',
      type: 'object',
      fields: [
        {
          name: 'before',
          type: 'text',
          title: 'Before',
          rows: 3,
        },
        {
          name: 'after',
          type: 'text',
          title: 'After',
          rows: 3,
        },
        {
          name: 'beforeImage',
          type: 'image',
          title: 'Before Image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        },
        {
          name: 'afterImage',
          type: 'image',
          title: 'After Image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        },
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube, Vimeo, or other video link',
    }),
    defineField({
      name: 'quote',
      title: 'Featured Quote',
      type: 'object',
      fields: [
        { name: 'text', type: 'text', title: 'Quote', rows: 3 },
        { name: 'author', type: 'string', title: 'Author' },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Story',
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
      program: 'relatedProgram.title',
      date: 'publishedAt',
    },
    prepare({ title, media, program, date }) {
      return {
        title,
        media,
        subtitle: `${program || 'No program'} - ${date ? new Date(date).toLocaleDateString() : ''}`,
      }
    },
  },
})
