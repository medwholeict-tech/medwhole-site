import { defineType, defineField } from 'sanity'

export const donationSchema = defineType({
  name: 'donation',
  title: 'Donation Campaigns',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Campaign Title',
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
      name: 'campaignType',
      title: 'Campaign Type',
      type: 'string',
      options: {
        list: [
          { title: 'General Donation', value: 'general' },
          { title: 'Program Specific', value: 'program' },
          { title: 'Emergency Relief', value: 'emergency' },
          { title: 'Monthly Giving', value: 'monthly' },
          { title: 'Corporate Sponsorship', value: 'corporate' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'relatedProgram',
      title: 'Related Program',
      type: 'reference',
      to: [{ type: 'program' }],
      hidden: ({ parent }) => parent?.campaignType !== 'program',
    }),
    defineField({
      name: 'goalAmount',
      title: 'Goal Amount',
      type: 'number',
      description: 'Target amount to raise',
    }),
    defineField({
      name: 'currentAmount',
      title: 'Current Amount Raised',
      type: 'number',
      initialValue: 0,
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
    }),
    defineField({
      name: 'suggestedAmounts',
      title: 'Suggested Donation Amounts',
      type: 'array',
      of: [{ type: 'number' }],
      description: 'Quick select amounts for donors',
    }),
    defineField({
      name: 'startDate',
      title: 'Campaign Start Date',
      type: 'datetime',
    }),
    defineField({
      name: 'endDate',
      title: 'Campaign End Date',
      type: 'datetime',
    }),
    defineField({
      name: 'donationUrl',
      title: 'Donation URL',
      type: 'url',
      description: 'External payment/donation page link',
    }),
    defineField({
      name: 'impactStatements',
      title: 'Impact Statements',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'amount', type: 'number', title: 'Amount' },
            { name: 'impact', type: 'string', title: 'What it provides' },
          ],
          preview: {
            select: {
              amount: 'amount',
              impact: 'impact',
            },
            prepare({ amount, impact }) {
              return {
                title: `${amount}`,
                subtitle: impact,
              }
            },
          },
        },
      ],
      description: 'Show donors what their contribution can achieve',
    }),
    defineField({
      name: 'taxDeductible',
      title: 'Tax Deductible',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Campaign',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Campaign Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Completed', value: 'completed' },
          { title: 'Paused', value: 'paused' },
          { title: 'Upcoming', value: 'upcoming' },
        ],
      },
      initialValue: 'active',
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
      current: 'currentAmount',
      goal: 'goalAmount',
      currency: 'currency',
    },
    prepare({ title, media, current, goal, currency }) {
      const percentage = goal ? Math.round((current / goal) * 100) : 0
      return {
        title,
        media,
        subtitle: goal ? `${percentage}% of ${currency} ${goal.toLocaleString()}` : 'No goal set',
      }
    },
  },
})
