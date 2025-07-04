import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    // Solo admins pueden crear usuarios
    create: ({ req: { user } }) => user?.role === 'admin',

    // Solo admins pueden leer todos los usuarios

    // Solo admins pueden actualizar cualquier usuario
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      // Monitorist solo puede actualizarse a sí mismo
      if (user?.role === 'monitorist') return { id: { equals: user.id } }
      return false
    },

    // Solo admins pueden borrar usuarios
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'clients',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: true,
      hooks: {
        afterChange: [
          async ({ value, operation, previousValue, req, originalDoc }) => {
            const { payload } = req

            // Obtener el ID del usuario actual (monitorist)

            const currentUID = originalDoc.id
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

                const currentMonitorists = client.monitorists || []

                await payload.update({
                  collection: 'clients',
                  id: clientId,
                  data: {
                    monitorists: [...currentMonitorists, currentUID],
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
                    monitorists: (client.monitorists || []).filter((id) => id !== currentUID),
                  },
                  depth: 0,
                })
              }),
            )
          },
        ],
      },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Monitorist', value: 'monitorist' },
        // Otros roles que tengas...
      ],
      required: true,
      defaultValue: 'monitorist', // Opcional: valor por defecto
      access: {
        // Solo admins pueden ver y modificar el campo role
        read: ({ req: { user } }) => user?.role === 'admin',
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}
