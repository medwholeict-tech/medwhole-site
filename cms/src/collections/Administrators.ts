import type { CollectionConfig } from 'payload'
import { bootstrapAdministrator, canAccessAdmin, canReadAdministrator, isAdmin } from '../access/roles'

export const Administrators: CollectionConfig = {
  slug: 'administrators',
  auth: {
    useAPIKey: true,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 60 * 60,
  },
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'name', 'roles', 'updatedAt'] },
  access: {
    admin: canAccessAdmin,
    create: bootstrapAdministrator,
    read: canReadAdministrator,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'roles', type: 'select', hasMany: true, required: true,
      options: [
        { label: 'Administrator', value: 'administrator' },
        { label: 'Editor', value: 'editor' },
        { label: 'Contributor', value: 'contributor' },
        { label: 'Content read only', value: 'content_read' },
        { label: 'Operations', value: 'operations' },
        { label: 'Finance', value: 'finance' },
        { label: 'Website integration', value: 'website_service' },
      ],
      saveToJWT: true,
    },
  ],
}
