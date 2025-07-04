import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'monitorists',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        readOnly: true,
        description: 'Monitorists asignados (gestión desde el perfil de cada monitorist)',
        condition: (_data) => true, // Siempre visible pero no editable
      },
      access: {
        update: () => false, // Nunca permitir edición directa
      },
      hooks: {
        beforeChange: [
          ({ data, req }) => {
            if (req.body?.monitorists) {
              throw new Error(
                'La asignación de monitorists debe hacerse desde el perfil del usuario',
              )
            }
            return data.monitorists // Mantener el valor existente
          },
        ],
      },
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: {
        readOnly: true,
        description: 'Testimonials asignados desde la edición de cada testimonial',
        condition: (_data) => true, // Siempre visible pero no editable
      },
      access: {
        update: () => false, // Nunca permitir edición directa
      },
    },
    {
      name: 'themes',
      type: 'relationship',
      relationTo: 'themes',
      hasMany: true,
      admin: {
        readOnly: true,
        description: 'Themes asignados desde la edición de cada theme',
        condition: (_data) => true, // Siempre visible pero no editable
      },
      access: {
        update: () => false, // Nunca permitir edición directa
      },
    },
  ],
}
