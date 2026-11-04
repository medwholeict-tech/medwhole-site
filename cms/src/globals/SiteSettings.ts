import type { GlobalConfig } from 'payload'
import { isAdmin, canEditContent } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true, update: canEditContent },
  fields: [
    { name: 'organisationName', type: 'text', required: true, defaultValue: 'MedWHOLE Alliance for Health and Development' },
    { name: 'siteTitle', type: 'text', required: true, defaultValue: 'MedWHOLE | Whole People. Lasting Impact.' },
    { name: 'siteDescription', type: 'textarea', required: true, defaultValue: 'A Christ-centred development organisation advancing Health, Literacy, and Empowerment.' },
    { name: 'tagline', type: 'text', defaultValue: 'Whole People. Lasting Impact.' },
    { name: 'publicEmail', type: 'email', required: true, defaultValue: 'info@medwhole.org' },
    { name: 'publicPhone', type: 'text' },
    { name: 'publicAddress', type: 'textarea' },
    { name: 'socialLinks', type: 'array', fields: [
      { name: 'label', type: 'text', required: true }, { name: 'url', type: 'text', required: true },
    ] },
    { name: 'internalEmailRecipients', type: 'text', access: { read: isAdmin, update: isAdmin }, admin: { description: 'Comma-separated operational notification addresses. Never exposed through public reads.' } },
  ],
}
