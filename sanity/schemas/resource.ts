import { defineType, defineField } from 'sanity'

export const resourceSchema = defineType({
  name: 'resource',
  title: 'Resources',
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
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'resourceType',
      title: 'Resource Type',
      type: 'string',
      options: {
        list: [
          { title: 'Report', value: 'report' },
          { title: 'Research Paper', value: 'research' },
          { title: 'Policy Brief', value: 'policy' },
          { title: 'Training Material', value: 'training' },
          { title: 'Guideline', value: 'guideline' },
          { title: 'Infographic', value: 'infographic' },
          { title: 'Video', value: 'video' },
          { title: 'Presentation', value: 'presentation' },
          { title: 'Case Study', value: 'case-study' },
          { title: 'Toolkit', value: 'toolkit' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Health Services', value: 'health' },
          { title: 'Education', value: 'education' },
          { title: 'Nutrition', value: 'nutrition' },
          { title: 'Research', value: 'research' },
          { title: 'Advocacy', value: 'advocacy' },
          { title: 'Capacity Building', value: 'capacity' },
        ],
      },
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
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
      name: 'file',
      title: 'File',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip',
      },
      description: 'Upload the resource file (PDF, DOC, PPT, etc.)',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Or provide an external link instead of uploading a file',
    }),
    defineField({
      name: 'fileSize',
      title: 'File Size',
      type: 'string',
      description: 'e.g., 2.5 MB',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'French', value: 'fr' },
          { title: 'Hausa', value: 'ha' },
          { title: 'Yoruba', value: 'yo' },
          { title: 'Igbo', value: 'ig' },
        ],
      },
      initialValue: 'en',
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'relatedProgram',
      title: 'Related Program',
      type: 'reference',
      to: [{ type: 'program' }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'downloadCount',
      title: 'Download Count',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Resource',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'requiresRegistration',
      title: 'Requires Registration to Download',
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
      media: 'thumbnail',
      type: 'resourceType',
      date: 'publishedDate',
    },
    prepare({ title, media, type, date }) {
      return {
        title,
        media,
        subtitle: `${type || 'Resource'} - ${date ? new Date(date).getFullYear() : ''}`,
      }
    },
  },
})
