import { defineType, defineField } from 'sanity'

export const newsletterSchema = defineType({
  name: 'newsletter',
  title: 'Newsletter Subscribers',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'interests',
      title: 'Interests',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Health Services', value: 'health' },
          { title: 'Education Programs', value: 'education' },
          { title: 'Events', value: 'events' },
          { title: 'Research', value: 'research' },
          { title: 'Volunteering', value: 'volunteering' },
          { title: 'Donations', value: 'donations' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Unsubscribed', value: 'unsubscribed' },
          { title: 'Bounced', value: 'bounced' },
        ],
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'source',
      title: 'Subscription Source',
      type: 'string',
      description: 'Where did they subscribe from?',
    }),
    defineField({
      name: 'unsubscribedAt',
      title: 'Unsubscribed At',
      type: 'datetime',
      hidden: ({ parent }) => parent?.status !== 'unsubscribed',
    }),
  ],
  preview: {
    select: {
      email: 'email',
      name: 'name',
      status: 'status',
    },
    prepare({ email, name, status }) {
      return {
        title: name || email,
        subtitle: `${email} - ${status}`,
      }
    },
  },
})
