import { defineType, defineField } from 'sanity'

export const partnerSchema = defineType({
  name: 'partner',
  title: 'Partners',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Partner Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'partnerType',
      title: 'Partner Type',
      type: 'string',
      options: {
        list: [
          { title: 'Strategic Partner', value: 'strategic' },
          { title: 'Funding Partner', value: 'funding' },
          { title: 'Implementation Partner', value: 'implementation' },
          { title: 'Academic Partner', value: 'academic' },
          { title: 'Corporate Partner', value: 'corporate' },
          { title: 'NGO Partner', value: 'ngo' },
          { title: 'Government Partner', value: 'government' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
    }),
    defineField({
      name: 'partnershipStartDate',
      title: 'Partnership Start Date',
      type: 'date',
    }),
    defineField({
      name: 'partnershipStatus',
      title: 'Partnership Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Inactive', value: 'inactive' },
          { title: 'Pending', value: 'pending' },
        ],
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'collaborationAreas',
      title: 'Collaboration Areas',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Health Services', value: 'health' },
          { title: 'Education & Training', value: 'education' },
          { title: 'Research', value: 'research' },
          { title: 'Funding', value: 'funding' },
          { title: 'Technology', value: 'technology' },
          { title: 'Advocacy', value: 'advocacy' },
        ],
      },
    }),
    defineField({
      name: 'contactPerson',
      title: 'Contact Person',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', title: 'Name' },
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'phone', type: 'string', title: 'Phone' },
        { name: 'position', type: 'string', title: 'Position' },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Partner',
      type: 'boolean',
      initialValue: false,
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
      title: 'name',
      media: 'logo',
      type: 'partnerType',
      status: 'partnershipStatus',
    },
    prepare({ title, media, type, status }) {
      return {
        title,
        media,
        subtitle: `${type || 'Partner'} - ${status || 'active'}`,
      }
    },
  },
})
