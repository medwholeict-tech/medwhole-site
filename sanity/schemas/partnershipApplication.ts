import { defineType, defineField } from 'sanity'

export const partnershipApplicationSchema = defineType({
  name: 'partnershipApplication',
  title: 'Partnership Applications',
  type: 'document',
  fields: [
    defineField({
      name: 'organizationName',
      title: 'Organization Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'organizationType',
      title: 'Organization Type',
      type: 'string',
      options: {
        list: [
          { title: 'NGO/Non-Profit', value: 'ngo' },
          { title: 'Corporate/Business', value: 'corporate' },
          { title: 'Government Agency', value: 'government' },
          { title: 'Academic Institution', value: 'academic' },
          { title: 'Healthcare Facility', value: 'healthcare' },
          { title: 'Faith-Based Organization', value: 'faith-based' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactPerson',
      title: 'Contact Person',
      type: 'object',
      fields: [
        { name: 'name', title: 'Full Name', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'title', title: 'Job Title', type: 'string' },
        { name: 'email', title: 'Email', type: 'string', validation: (Rule) => Rule.required().email() },
        { name: 'phone', title: 'Phone Number', type: 'string', validation: (Rule) => Rule.required() },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'organizationWebsite',
      title: 'Organization Website',
      type: 'url',
    }),
    defineField({
      name: 'partnershipInterest',
      title: 'Partnership Interest',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Health Services', value: 'health' },
          { title: 'Education/Academy', value: 'education' },
          { title: 'Research Collaboration', value: 'research' },
          { title: 'Funding/Sponsorship', value: 'funding' },
          { title: 'Technical Support', value: 'technical' },
          { title: 'Community Programs', value: 'community' },
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'proposedCollaboration',
      title: 'Proposed Collaboration',
      type: 'text',
      rows: 5,
      description: 'Describe how you envision partnering with MedWHOLE Alliance',
      validation: (Rule) => Rule.required().min(50),
    }),
    defineField({
      name: 'organizationCapacity',
      title: 'Organization Capacity',
      type: 'text',
      rows: 4,
      description: 'What resources, expertise, or support can your organization provide?',
    }),
    defineField({
      name: 'geographicFocus',
      title: 'Geographic Focus',
      type: 'string',
      description: 'Which regions/states in Nigeria are you focused on?',
    }),
    defineField({
      name: 'status',
      title: 'Application Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Under Review', value: 'reviewing' },
          { title: 'Approved', value: 'approved' },
          { title: 'Declined', value: 'declined' },
          { title: 'On Hold', value: 'on-hold' },
        ],
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
      description: 'Internal notes for review team',
    }),
  ],
  preview: {
    select: {
      title: 'organizationName',
      subtitle: 'contactPerson.name',
      status: 'status',
    },
    prepare({ title, subtitle, status }) {
      return {
        title: title || 'Unnamed Organization',
        subtitle: `${subtitle || 'No contact'} - ${status || 'new'}`,
      }
    },
  },
})
