import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'title',
  },
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
      name: 'type',
      type: 'select',

      required: true,
      options: [
        {
          label: 'Impreso',
          value: 'impreso',
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
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      hooks: {
        afterChange: [
          async ({ value, operation: _operation, previousValue, req, originalDoc }) => {
            const { payload } = req
            const currentClientId = value
            const pastClientId = previousValue || ''
            const currentTestimonialId = originalDoc.id

            Promise.all(
              [currentClientId].map(async (currentClientId) => {
                const client = await payload.findByID({
                  collection: 'clients',
                  id: currentClientId,
                  depth: 0,
                })
                const allClientTestimonials = client.testimonials || []
                if (!allClientTestimonials.includes(currentTestimonialId)) {
                  await payload.update({
                    collection: 'clients',
                    id: currentClientId,
                    data: {
                      testimonials: [...allClientTestimonials, currentTestimonialId],
                    },
                    depth: 0,
                  })
                }
              }),
            )
            if (pastClientId !== '') {
              Promise.all(
                [pastClientId].map(async (pastClientId) => {
                  const client = await payload.findByID({
                    collection: 'clients',
                    id: pastClientId,
                    depth: 0,
                  })
                  const allClientTestimonials = client.testimonials || []

                  await payload.update({
                    collection: 'clients',
                    id: pastClientId,
                    data: {
                      testimonials: allClientTestimonials.filter(
                        (id) => id !== currentTestimonialId,
                      ),
                    },
                    depth: 0,
                  })
                }),
              )
            }
          },
        ],
      },
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
      name: 'dateOfNote',
      type: 'date',
      label: 'Date of Note',
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
      name: 'mention',
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
      name: 'page',
      type: 'number',
    },
    {
      name: 'originalLink',
      type: 'text',
    },
    {
      name: 'spokesperson',
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
