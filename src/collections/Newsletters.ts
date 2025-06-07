import type { CollectionConfig } from 'payload'

export const Newsletters: CollectionConfig = {
  slug: 'newsletters',
  admin: {
    useAsTitle: 'frecuency',
  },

  fields: [
    {
      name: 'frecuency',
      type: 'select',
      options: [
        {
          label: 'Diario',
          value: 'diario',
        },
        {
          label: 'Semanal',
          value: 'semanal',
        },
        {
          label: 'Quincenal',
          value: 'quincenal',
        },
        {
          label: 'Mensual',
          value: 'mensual',
        },
        {
          label: 'Bimestral',
          value: 'bimestral',
        },
        {
          label: 'Trimestral',
          value: 'trimestral',
        },
        {
          label: 'Semestral',
          value: 'semestral',
        },
        {
          label: 'Anual',
          value: 'anual',
        },
      ],
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
    },
    {
      name: 'obervations',
      type: 'richText',
    },
    {
      name: 'resume',
      type: 'richText',
    },
  ],
}
