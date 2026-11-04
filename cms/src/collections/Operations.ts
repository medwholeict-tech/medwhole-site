import type { CollectionConfig, Field } from 'payload'
import { canCreateDonations, canCreateSubmissions, canReadDonations, canReadSubmissions, isAdmin } from '../access/roles'

function privateInbox(slug: string, titleField: string, fields: Field[], donation = false, statuses = ['new', 'in_review', 'replied', 'resolved', 'archived']): CollectionConfig {
  const readAccess = donation ? canReadDonations : canReadSubmissions
  const createAccess = donation ? canCreateDonations : canCreateSubmissions
  return {
    slug,
    admin: { useAsTitle: titleField, defaultColumns: [titleField, 'status', 'submittedAt', 'updatedAt'] },
    access: {
      create: createAccess,
      read: readAccess,
      update: readAccess,
      delete: isAdmin,
    },
    fields: [
      ...fields,
      { name: 'status', type: 'select', required: true, defaultValue: statuses[0], options: statuses },
      { name: 'submittedAt', type: 'date', required: true, defaultValue: () => new Date().toISOString() },
      { name: 'sourcePage', type: 'text' },
      { name: 'consent', type: 'checkbox', defaultValue: false },
      { name: 'internalNotes', type: 'textarea', access: { read: readAccess, update: readAccess } },
    ],
  }
}

const nameEmail: Field[] = [
  { name: 'fullName', type: 'text', required: true },
  { name: 'email', type: 'email', required: true },
]

export const ContactSubmissions = privateInbox('contact-submissions', 'subject', [
  ...nameEmail, { name: 'phone', type: 'text' },
  { name: 'subject', type: 'text', required: true }, { name: 'message', type: 'textarea', required: true },
])

export const VolunteerApplications = privateInbox('volunteer-applications', 'fullName', [
  ...nameEmail, { name: 'phone', type: 'text' }, { name: 'location', type: 'json' },
  { name: 'areasOfInterest', type: 'json' }, { name: 'skills', type: 'json' },
  { name: 'motivation', type: 'textarea', required: true },
])

export const PartnershipApplications = privateInbox('partnership-applications', 'organisation', [
  ...nameEmail, { name: 'organisation', type: 'text', required: true }, { name: 'phone', type: 'text' },
  { name: 'partnershipType', type: 'text' }, { name: 'message', type: 'textarea', required: true },
])

export const NewsletterSubscribers = privateInbox('newsletter-subscribers', 'email', [
  { name: 'email', type: 'email', required: true, unique: true }, { name: 'name', type: 'text' },
  { name: 'confirmedAt', type: 'date' }, { name: 'unsubscribedAt', type: 'date' },
])

export const EventRegistrations = privateInbox('event-registrations', 'fullName', [
  ...nameEmail, { name: 'event', type: 'relationship', relationTo: 'events', required: true },
  { name: 'phone', type: 'text' }, { name: 'formData', type: 'json' },
])

export const DonationIntents = privateInbox('donation-intents', 'reference', [
  { name: 'reference', type: 'text', required: true, unique: true }, ...nameEmail,
  { name: 'phone', type: 'text' }, { name: 'amount', type: 'text', required: true },
  { name: 'currency', type: 'select', options: ['NGN', 'USD', 'GBP'], required: true },
  { name: 'frequency', type: 'select', options: ['one-time', 'monthly'], required: true },
  { name: 'programme', type: 'text' },
], true)

export const DonationPayments = privateInbox('donation-payments', 'reference', [
  { name: 'reference', type: 'text', required: true, unique: true },
  { name: 'parentReference', type: 'text' }, { name: 'amountMinor', type: 'number', required: true },
  { name: 'currency', type: 'text', required: true }, { name: 'providerStatus', type: 'text', required: true },
  { name: 'paidAt', type: 'date' }, { name: 'receiptSent', type: 'checkbox', defaultValue: false },
], true)

export const EmailDeliveries = privateInbox('email-deliveries', 'template', [
  { name: 'template', type: 'text', required: true }, { name: 'recordId', type: 'text', required: true },
  { name: 'recipient', type: 'email', required: true }, { name: 'providerId', type: 'text' },
  { name: 'attempts', type: 'number', defaultValue: 0 }, { name: 'lastError', type: 'textarea' },
], false, ['queued', 'sent', 'failed', 'retry'])
