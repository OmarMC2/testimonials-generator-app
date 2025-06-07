import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      unique: true,
      required: true,
      options: [
        {
          label: 'Impreso',
          value: 'Impreso',
        },
        {
          label: 'Digital',
          value: 'digital',
        },
        {
          label: 'RRSS',
          value: 'rrss',
        },
      ],
    },
    {
      name: 'medium',
      type: 'text',
      required: true,
    },
    {
      name: 'reach',
      type: 'number',
      required: true,
    },
    {
      name: 'sentiment',
      type: 'select',
      required: true,
      unique: true,
      options: [
        {
          label: 'Positive +',
          value: 'positive',
        },
        {
          label: 'Negative -',
          value: 'negative',
        },
      ],
    },
    {
      name: 'date of note',
      type: 'date',
      required: true,
    },
    {
      name: 'theme',
      type: 'relationship',
      relationTo: 'themes',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'section',
      type: 'text',
    },
    {
      name: 'original link',
      type: 'text',
    },
    {
      name: 'spokeperson',
      type: 'text',
    },
    {
      name: 'media',
      type: 'text',
    },
    {
      name: 'journalist',
      type: 'text',
    },
    {
      name: 'extract',
      type: 'text',
    },
    {
      name: 'insights',
      type: 'richText',
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'client',
      type: 'text',
    },
    {
      name: 'likes',
      type: 'number',
    },
    {
      name: 'comments',
      type: 'number',
    },
    {
      name: 'shares',
      type: 'number',
    },
  ],
}
