import { defineType, defineField } from 'sanity'

export const volunteerApplicationSchema = defineType({
  name: 'volunteerApplication',
  title: 'Volunteer Applications',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        { name: 'state', title: 'State', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'city', title: 'City', type: 'string' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'age',
      title: 'Age Range',
      type: 'string',
      options: {
        list: [
          { title: '18-24', value: '18-24' },
          { title: '25-34', value: '25-34' },
          { title: '35-44', value: '35-44' },
          { title: '45-54', value: '45-54' },
          { title: '55+', value: '55+' },
        ],
      },
    }),
    defineField({
      name: 'occupation',
      title: 'Current Occupation',
      type: 'string',
    }),
    defineField({
      name: 'education',
      title: 'Highest Education Level',
      type: 'string',
      options: {
        list: [
          { title: 'Secondary School', value: 'secondary' },
          { title: 'Diploma/Certificate', value: 'diploma' },
          { title: 'Bachelor\'s Degree', value: 'bachelors' },
          { title: 'Master\'s Degree', value: 'masters' },
          { title: 'Doctorate', value: 'doctorate' },
        ],
      },
    }),
    defineField({
      name: 'areasOfInterest',
      title: 'Areas of Interest',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Health Services', value: 'health' },
          { title: 'Education/Teaching', value: 'education' },
          { title: 'Community Outreach', value: 'outreach' },
          { title: 'Administrative Support', value: 'admin' },
          { title: 'Event Planning', value: 'events' },
          { title: 'Communications/Media', value: 'communications' },
          { title: 'Fundraising', value: 'fundraising' },
          { title: 'Research', value: 'research' },
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'skills',
      title: 'Relevant Skills & Experience',
      type: 'text',
      rows: 4,
      description: 'Tell us about your skills, experience, and what you can contribute',
      validation: (Rule) => Rule.required().min(50),
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'object',
      fields: [
        {
          name: 'frequency',
          title: 'How often can you volunteer?',
          type: 'string',
          options: {
            list: [
              { title: 'Once a week', value: 'weekly' },
              { title: 'Twice a month', value: 'biweekly' },
              { title: 'Once a month', value: 'monthly' },
              { title: 'Occasionally', value: 'occasional' },
              { title: 'For specific events', value: 'events' },
            ],
          },
        },
        {
          name: 'duration',
          title: 'Commitment Duration',
          type: 'string',
          options: {
            list: [
              { title: '1-3 months', value: '1-3' },
              { title: '3-6 months', value: '3-6' },
              { title: '6-12 months', value: '6-12' },
              { title: '1+ year', value: '1+' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'motivation',
      title: 'Why do you want to volunteer with MedWHOLE?',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(50),
    }),
    defineField({
      name: 'previousVolunteer',
      title: 'Previous Volunteer Experience',
      type: 'text',
      rows: 3,
      description: 'Have you volunteered before? Tell us about it.',
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
          { title: 'Waitlist', value: 'waitlist' },
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
      title: 'fullName',
      subtitle: 'email',
      status: 'status',
    },
    prepare({ title, subtitle, status }) {
      return {
        title: title || 'Unnamed Applicant',
        subtitle: `${subtitle || 'No email'} - ${status || 'new'}`,
      }
    },
  },
})
