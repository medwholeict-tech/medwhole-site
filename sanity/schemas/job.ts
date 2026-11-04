import { defineType, defineField } from 'sanity'

export const jobSchema = defineType({
  name: 'job',
  title: 'Job Postings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Job Title',
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
      name: 'department',
      title: 'Department',
      type: 'string',
      options: {
        list: [
          { title: 'Health Services', value: 'health' },
          { title: 'Education & Training', value: 'education' },
          { title: 'Administration', value: 'admin' },
          { title: 'Finance', value: 'finance' },
          { title: 'Programs', value: 'programs' },
          { title: 'Communications', value: 'communications' },
          { title: 'Research', value: 'research' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'employmentType',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'full-time' },
          { title: 'Part-time', value: 'part-time' },
          { title: 'Contract', value: 'contract' },
          { title: 'Internship', value: 'internship' },
          { title: 'Volunteer', value: 'volunteer' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'experienceLevel',
      title: 'Experience Level',
      type: 'string',
      options: {
        list: [
          { title: 'Entry Level', value: 'entry' },
          { title: 'Mid Level', value: 'mid' },
          { title: 'Senior Level', value: 'senior' },
          { title: 'Executive', value: 'executive' },
        ],
      },
    }),
    defineField({
      name: 'summary',
      title: 'Job Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'responsibilities',
      title: 'Key Responsibilities',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: 'qualifications',
      title: 'Qualifications',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: 'skills',
      title: 'Required Skills',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'salaryRange',
      title: 'Salary Range',
      type: 'object',
      fields: [
        { name: 'min', type: 'number', title: 'Minimum' },
        { name: 'max', type: 'number', title: 'Maximum' },
        {
          name: 'currency',
          type: 'string',
          title: 'Currency',
          options: {
            list: [
              { title: 'NGN', value: 'NGN' },
              { title: 'USD', value: 'USD' },
              { title: 'GBP', value: 'GBP' },
              { title: 'EUR', value: 'EUR' },
            ],
          },
          initialValue: 'NGN',
        },
        {
          name: 'period',
          type: 'string',
          title: 'Period',
          options: {
            list: [
              { title: 'Per Hour', value: 'hour' },
              { title: 'Per Month', value: 'month' },
              { title: 'Per Year', value: 'year' },
            ],
          },
          initialValue: 'month',
        },
      ],
    }),
    defineField({
      name: 'applicationDeadline',
      title: 'Application Deadline',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'applicationMethod',
      title: 'Application Method',
      type: 'string',
      options: {
        list: [
          { title: 'Email', value: 'email' },
          { title: 'External Form', value: 'external' },
          { title: 'Built-in Form', value: 'internal' },
        ],
      },
      initialValue: 'email',
    }),
    defineField({
      name: 'applicationEmail',
      title: 'Application Email',
      type: 'string',
      hidden: ({ parent }) => parent?.applicationMethod !== 'email',
    }),
    defineField({
      name: 'applicationUrl',
      title: 'Application URL',
      type: 'url',
      hidden: ({ parent }) => parent?.applicationMethod !== 'external',
    }),
    defineField({
      name: 'contactPerson',
      title: 'Contact Person',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', title: 'Name' },
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'phone', type: 'string', title: 'Phone' },
      ],
    }),
    defineField({
      name: 'postedDate',
      title: 'Posted Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Open', value: 'open' },
          { title: 'Closed', value: 'closed' },
          { title: 'On Hold', value: 'on-hold' },
          { title: 'Filled', value: 'filled' },
        ],
      },
      initialValue: 'open',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Job',
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
      location: 'location',
      type: 'employmentType',
      status: 'status',
    },
    prepare({ title, location, type, status }) {
      return {
        title,
        subtitle: `${location} - ${type} (${status})`,
      }
    },
  },
})
