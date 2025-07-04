import type { CollectionConfig } from 'payload'
export const Themes: CollectionConfig = {
  slug: 'themes',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'clients',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: true,
      hooks: {
        afterChange: [
          async ({ value, operation: _operation, previousValue, req, originalDoc }) => {
            const { payload } = req

            // Obtener el ID del usuario actual (monitorist)

            const currentThemeID = originalDoc.id
            // Determinar clientes agregados/eliminados
            const currentClients = value || []
            const previousClients = previousValue || []

            const addedClients = currentClients.filter((id) => !previousClients.includes(id))
            const removedClients = previousClients.filter((id) => !currentClients.includes(id))

            // Agregar este monitorist a los clientes recién asignados
            await Promise.all(
              addedClients.map(async (clientId) => {
                const client = await payload.findByID({
                  collection: 'clients',
                  id: clientId,
                  depth: 0,
                })

                const currentThemes = client.themes || []

                await payload.update({
                  collection: 'clients',
                  id: clientId,
                  data: {
                    themes: [...currentThemes, currentThemeID],
                  },
                  depth: 0,
                })
              }),
            )

            // Remover este monitorist de los clientes desasignados
            await Promise.all(
              removedClients.map(async (clientId) => {
                const client = await payload.findByID({
                  collection: 'clients',
                  id: clientId,
                  depth: 0,
                })

                await payload.update({
                  collection: 'clients',
                  id: clientId,
                  data: {
                    themes: (client.themes || []).filter((id) => id !== currentThemeID),
                  },
                  depth: 0,
                })
              }),
            )
          },
        ],
      },
    },
  ],
}
