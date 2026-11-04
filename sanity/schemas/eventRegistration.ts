import { defineType, defineField } from 'sanity'

export const eventRegistrationSchema = defineType({
  name: 'eventRegistration',
  title: 'Event Registrations',
  type: 'document',
  fields: [
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{ type: 'event' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'formData',
      title: 'Form Data',
      type: 'object',
      fields: [
        {
          name: 'data',
          title: 'Submission Data',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'fieldId',
                  title: 'Field ID',
                  type: 'string',
                },
                {
                  name: 'label',
                  title: 'Field Label',
                  type: 'string',
                },
                {
                  name: 'value',
                  title: 'Value',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Extracted from form data for easy reference',
    }),
    defineField({
      name: 'contactName',
      title: 'Contact Name',
      type: 'string',
      description: 'Extracted from form data for easy reference',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'notes',
      title: 'Admin Notes',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      name: 'contactName',
      email: 'contactEmail',
      event: 'event.title',
      date: 'submittedAt',
    },
    prepare({ name, email, event, date }) {
      return {
        title: name || email || 'Anonymous',
        subtitle: `${event} - ${new Date(date).toLocaleDateString()}`,
      }
    },
  },
})
