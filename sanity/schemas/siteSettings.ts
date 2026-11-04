import { defineType, defineField } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'Used for SEO meta description',
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
        },
      ],
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: '32x32 or 64x64 pixels',
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'phone', type: 'string', title: 'Phone' },
        { name: 'address', type: 'text', title: 'Address', rows: 3 },
      ],
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        { name: 'facebook', type: 'url', title: 'Facebook' },
        { name: 'twitter', type: 'url', title: 'Twitter/X' },
        { name: 'instagram', type: 'url', title: 'Instagram' },
        { name: 'linkedin', type: 'url', title: 'LinkedIn' },
        { name: 'youtube', type: 'url', title: 'YouTube' },
      ],
    }),
    defineField({
      name: 'maintenanceMode',
      title: 'Maintenance Mode',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          type: 'boolean',
          title: 'Enable Maintenance Mode',
          initialValue: false,
        },
        {
          name: 'message',
          type: 'text',
          title: 'Maintenance Message',
          rows: 3,
        },
      ],
    }),
    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          type: 'boolean',
          title: 'Show Announcement Bar',
          initialValue: false,
        },
        {
          name: 'message',
          type: 'string',
          title: 'Message',
        },
        {
          name: 'link',
          type: 'url',
          title: 'Link (optional)',
        },
        {
          name: 'type',
          type: 'string',
          title: 'Type',
          options: {
            list: [
              { title: 'Info', value: 'info' },
              { title: 'Warning', value: 'warning' },
              { title: 'Success', value: 'success' },
              { title: 'Error', value: 'error' },
            ],
          },
          initialValue: 'info',
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          type: 'string',
          title: 'Default Meta Title',
        },
        {
          name: 'metaDescription',
          type: 'text',
          title: 'Default Meta Description',
          rows: 3,
        },
        {
          name: 'ogImage',
          type: 'image',
          title: 'Default OG Image',
          description: 'Used for social media sharing',
        },
        {
          name: 'keywords',
          type: 'array',
          title: 'Keywords',
          of: [{ type: 'string' }],
        },
      ],
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      fields: [
        {
          name: 'googleAnalyticsId',
          type: 'string',
          title: 'Google Analytics ID',
          description: 'e.g., G-XXXXXXXXXX',
        },
        {
          name: 'facebookPixelId',
          type: 'string',
          title: 'Facebook Pixel ID',
        },
      ],
    }),
    defineField({
      name: 'donationSettings',
      title: 'Donation Settings',
      type: 'object',
      fields: [
        {
          name: 'defaultDonationUrl',
          type: 'url',
          title: 'Default Donation URL',
        },
        {
          name: 'showDonationButton',
          type: 'boolean',
          title: 'Show Donation Button in Header',
          initialValue: true,
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'siteName',
    },
    prepare({ title }) {
      return {
        title: title || 'Site Settings',
      }
    },
  },
})
