import type { GlobalConfig } from 'payload'
import { canEditContent } from '../access/roles'

const linkFields = [
  { name: 'label', type: 'text' as const, required: true },
  { name: 'href', type: 'text' as const, required: true },
  { name: 'description', type: 'text' as const },
]

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  access: { read: () => true, update: canEditContent },
  fields: [
    {
      name: 'headerGroups',
      type: 'array',
      required: true,
      fields: [
        ...linkFields,
        { name: 'items', type: 'array', fields: linkFields },
      ],
    },
    {
      name: 'headerCta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Give' },
        { name: 'href', type: 'text', defaultValue: '/give' },
      ],
    },
    {
      name: 'footerNavigation',
      type: 'array',
      fields: linkFields,
    },
    {
      name: 'legalNavigation',
      type: 'array',
      fields: linkFields,
    },
  ],
}
