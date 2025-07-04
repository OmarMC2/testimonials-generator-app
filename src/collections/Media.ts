import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: ({ req: { user } }) => ['admin', 'monitorist'].includes(user?.role),
    read: () => true, // Todos pueden leer (ajusta según necesidades)
    update: ({ req: { user } }) => ['admin', 'monitorist'].includes(user?.role),
    delete: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'monitorist',
    // Permisos adicionales para operaciones específicas
    readVersions: ({ req: { user } }) => ['admin', 'monitorist'].includes(user?.role),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
