import { CollectionAfterChangeHook } from 'payload'

const updateClientTestimonials: CollectionAfterChangeHook = async ({
  operation, // 'create' o 'update'
  doc, // Documento actual (testimonio)
  previousDoc, // Documento anterior (solo en 'update')
  req, // Payload request
}) => {
  const { payload } = req
  const clientId = doc.client // ID del cliente relacionado

  // 1. Si el testimonio ya estaba asignado a otro cliente, lo quitamos de ese cliente
  if (operation === 'update' && previousDoc.client) {
    await payload.update({
      collection: 'clients',
      id: previousDoc.client,
      data: {
        testimonials: previousDoc.testimonials.filter((id) => id !== doc.id), // Elimina el testimonio del cliente anterior
      },
    })
  }

  // 2. Añade el testimonio al cliente actual
  if (clientId) {
    const client = await payload.findByID({
      collection: 'clients',
      id: clientId,
    })

    await payload.update({
      collection: 'clients',
      id: clientId,
      data: {
        testimonials: [...(client.testimonials || []), doc.id], // Añade el nuevo testimonio
      },
    })
  }
}

export default updateClientTestimonials
