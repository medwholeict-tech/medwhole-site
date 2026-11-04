import { defineType, defineField } from 'sanity'

export const eventSchema = defineType({
  name: 'event',
  title: 'Events',
  type: 'document',
  fields: [
    defineField({ name: 'gallery', title: 'Approved event gallery', type: 'array', of: [{ type: 'image', fields: [{ name: 'alt', title: 'Alternative text', type: 'string' }, { name: 'caption', title: 'Caption', type: 'string' }, { name: 'consentConfirmed', title: 'Written image consent confirmed', type: 'boolean', initialValue: false }] }] }),
    defineField({ name: 'programmePath', title: 'Programme page', type: 'string', description: 'Approved programme URL under /academy or /our-work. Required for the public directory.' }),
    defineField({ name: 'community', title: 'Community', type: 'string', options: { list: ['Gosa', 'Kunyami', 'Toge'] } }),
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
      rows: 3,
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
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
          ],
        },
      ],
    }),
    defineField({
      name: 'storyMoments',
      title: 'Photo-led Story Moments',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Photograph',
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  title: 'Alternative Text',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
              ],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Moment Title',
              type: 'string',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'text',
              rows: 2,
            },
          ],
          preview: {
            select: { title: 'title', media: 'image', subtitle: 'caption' },
          },
        },
      ],
    }),
    defineField({
      name: 'impactFigures',
      title: 'Key Outcomes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'label',
              title: 'Outcome',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
    }),
    defineField({
      name: 'communityContext',
      title: 'Community Context',
      type: 'text',
      rows: 4,
      description: 'Explain the local context with dignity and without portraying people as helpless.',
    }),
    defineField({
      name: 'whyItMatters',
      title: 'Why It Matters',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'participation',
      title: 'How to Participate',
      type: 'object',
      description: 'Primarily for ongoing or upcoming events.',
      fields: [
        {
          name: 'description',
          title: 'Participation Details',
          type: 'text',
          rows: 4,
        },
        {
          name: 'steps',
          title: 'What Participants Can Expect',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ],
    }),
    defineField({
      name: 'closingReflection',
      title: 'Closing Reflection',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Academy', value: 'Academy' },
          { title: 'Health', value: 'Health' },
          { title: 'Consulting', value: 'Consulting' },
          { title: 'General', value: 'General' },
        ],
      },
    }),
    defineField({
      name: 'date',
      title: 'Event Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date (Optional)',
      type: 'datetime',
      description: 'For multi-day events',
    }),
    defineField({
      name: 'status',
      title: 'Event Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Ongoing', value: 'ongoing' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      description: 'Use Ongoing for recurring activities that do not have a confirmed end date.',
    }),
    defineField({
      name: 'schedule',
      title: 'Schedule',
      type: 'string',
      description: 'Human-readable recurrence, for example: Every Friday, 4:00 p.m. - 5:00 p.m. (WAT).',
    }),
    defineField({
      name: 'showTime',
      title: 'Display Start Time',
      type: 'boolean',
      initialValue: true,
      description: 'Turn this off when the source confirms the date but does not provide a start time.',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'venue',
      title: 'Venue Details',
      type: 'text',
      rows: 2,
      description: 'Full address or virtual meeting link',
    }),
    defineField({
      name: 'isFree',
      title: 'Free Event',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Leave empty if free',
      hidden: ({ parent }) => parent?.isFree === true,
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          { title: 'Nigerian Naira (₦)', value: 'NGN' },
          { title: 'US Dollar ($)', value: 'USD' },
          { title: 'British Pound (£)', value: 'GBP' },
          { title: 'Euro (€)', value: 'EUR' },
        ],
      },
      initialValue: 'NGN',
      hidden: ({ parent }) => parent?.isFree === true,
    }),
    defineField({
      name: 'capacity',
      title: 'Event Capacity',
      type: 'number',
      description: 'Maximum number of attendees',
    }),
    defineField({
      name: 'requiresRegistration',
      title: 'Requires Registration',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'registrationType',
      title: 'Registration Type',
      type: 'string',
      options: {
        list: [
          { title: 'External Form (URL)', value: 'external' },
          { title: 'Built-in Custom Form', value: 'custom' },
        ],
      },
      initialValue: 'external',
      hidden: ({ parent }) => parent?.requiresRegistration !== true,
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Registration URL',
      type: 'url',
      description: 'External registration form link (Google Forms, Typeform, etc.)',
      hidden: ({ parent }) => parent?.requiresRegistration !== true || parent?.registrationType !== 'external',
    }),
    defineField({
      name: 'registrationForm',
      title: 'Custom Registration Form',
      type: 'object',
      description: 'Build a custom registration form with fields',
      hidden: ({ parent }) => parent?.requiresRegistration !== true || parent?.registrationType !== 'custom',
      fields: [
        {
          name: 'fields',
          title: 'Form Fields',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'fieldId',
                  title: 'Field ID',
                  type: 'string',
                  description: 'Unique identifier (auto-generated)',
                  readOnly: true,
                  initialValue: () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                },
                {
                  name: 'label',
                  title: 'Field Label',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'fieldType',
                  title: 'Field Type',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Short Text', value: 'text' },
                      { title: 'Long Text (Textarea)', value: 'textarea' },
                      { title: 'Email', value: 'email' },
                      { title: 'Phone Number', value: 'phone' },
                      { title: 'Number', value: 'number' },
                      { title: 'Date', value: 'date' },
                      { title: 'Dropdown (Select)', value: 'select' },
                      { title: 'Multiple Choice (Radio)', value: 'radio' },
                      { title: 'Checkboxes', value: 'checkbox' },
                      { title: 'File Upload', value: 'file' },
                    ],
                  },
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'placeholder',
                  title: 'Placeholder Text',
                  type: 'string',
                  description: 'Hint text shown in the field',
                },
                {
                  name: 'options',
                  title: 'Options',
                  type: 'array',
                  of: [{ type: 'string' }],
                  description: 'For dropdown, radio, or checkbox fields',
                  hidden: ({ parent }) => !['select', 'radio', 'checkbox'].includes(parent?.fieldType),
                },
                {
                  name: 'required',
                  title: 'Required Field',
                  type: 'boolean',
                  initialValue: false,
                },
                {
                  name: 'helpText',
                  title: 'Help Text',
                  type: 'text',
                  rows: 2,
                  description: 'Additional instructions for the user',
                },
                {
                  name: 'validation',
                  title: 'Validation Rules',
                  type: 'object',
                  fields: [
                    {
                      name: 'minLength',
                      title: 'Minimum Length',
                      type: 'number',
                    },
                    {
                      name: 'maxLength',
                      title: 'Maximum Length',
                      type: 'number',
                    },
                    {
                      name: 'pattern',
                      title: 'Pattern (Regex)',
                      type: 'string',
                      description: 'Custom validation pattern',
                    },
                  ],
                },
              ],
              preview: {
                select: {
                  label: 'label',
                  fieldType: 'fieldType',
                  required: 'required',
                },
                prepare({ label, fieldType, required }) {
                  return {
                    title: label || 'Untitled Field',
                    subtitle: `${fieldType || 'text'}${required ? ' (Required)' : ''}`,
                  }
                },
              },
            },
          ],
        },
        {
          name: 'submitButtonText',
          title: 'Submit Button Text',
          type: 'string',
          initialValue: 'Register Now',
        },
        {
          name: 'successMessage',
          title: 'Success Message',
          type: 'text',
          rows: 3,
          initialValue: 'Thank you for registering! We will send you a confirmation email shortly.',
        },
        {
          name: 'notificationEmails',
          title: 'Notification Emails',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Receive notifications when someone registers (optional)',
        },
      ],
    }),
    defineField({
      name: 'registrationDeadline',
      title: 'Registration Deadline',
      type: 'datetime',
      hidden: ({ parent }) => parent?.requiresRegistration !== true,
    }),
    defineField({
      name: 'organizer',
      title: 'Organizer',
      type: 'string',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Event',
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
      date: 'date',
      category: 'category',
    },
    prepare(selection) {
      const { title, date, category } = selection
      return {
        title: title,
        subtitle: `${category || 'General'} - ${new Date(date).toLocaleDateString()}`,
      }
    },
  },
})
