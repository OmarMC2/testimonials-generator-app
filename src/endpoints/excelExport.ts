import type { Payload } from 'payload'
import ExcelJS from 'exceljs'
import capitalizer from '@/assets/capitalizer'
export const excelExport = async (req: Request & { payload: Payload }) => {
  try {
    // Obtener datos del body
    //const payload = await getPayload({config})
    const { clientID, themeID, startDate, endDate, excelType } = await req.json()
    const todayDate = `Reporte ${excelType}` + new Date().getDate().toString()

    // Verificar autenticación (el token viene en los headers)
    const token = req.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      return new Response(JSON.stringify({ error: 'Token no proporcionado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Validación de fechas
    if (new Date(startDate) > new Date(endDate)) {
      return new Response(JSON.stringify({ error: 'Rango de fechas inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Obtener payload del request extendido (necesitas acceso a Payload)
    const payload = req.payload
    const serverURL = payload.config.serverURL
    console.log('🚀 ~ excelExport ~ serverURL:', serverURL)
    if (!payload) {
      return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Consultar datos
    const results = await payload.find({
      collection: 'testimonials',
      where: {
        client: clientID,
        theme: themeID,
        createdAt: {
          greater_than_equal: startDate,
          less_than_equal: endDate,
        },
      },
      limit: 10000,
      depth: 2, // Para incluir relaciones básicas
    })

    // Crear Excel
    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet('reporte')

    if (excelType === 'Regular') {
      worksheet.columns = [
        { header: 'Date', key: 'dateOfNote', width: 20 },
        { header: 'Headline', key: 'title', width: 25 },
        { header: 'URL', key: 'id', width: 50 },
        { header: 'Tier', key: 'tier', width: 25 },
        { header: 'Media Outlet', key: 'medium', width: 35 },
        { header: 'Reach', key: 'reach', width: 20 },
        { header: 'Sentiment', key: 'sentiment', width: 30 },
        { header: 'Spokesperson', key: 'spokesperson', width: 20 },
        { header: 'Media Aproach', key: 'media', width: 20 },
      ]

      results.docs.forEach((doc) => {
        const preDate = new Date(doc.dateOfNote)
        const date = preDate.getDay() + '/' + preDate.getMonth() + '/' + preDate.getFullYear()
        worksheet.addRow({
          dateOfNote: date || 'N/A',
          title: doc.title || 'N/A',
          id: `${serverURL}/testimonials/${doc.id}`,
          tier: doc.tier || 'N/A',
          medium: capitalizer(doc.medium) || 'N/A',
          reach: doc.reach || 'N/A',
          sentiment: capitalizer(doc.sentiment) || 'N/A',
          spokesperson: doc.spokesperson || 'N/A',
          media: capitalizer(doc.media) || 'N/A',
        })
        // Obtén la última fila añadida (la que acabamos de crear)
        const lastRow = worksheet.lastRow || ''

        // Agrega el hipervínculo a la celda del ID
        lastRow.getCell('id').value = {
          text: `${serverURL}/testimonials/${doc.id}`, // Texto que se mostrará en la celda
          hyperlink: `${serverURL}/testimonials/${doc.id}`, // URL del enlace
        }

        // Opcional: formatear la celda para que parezca un enlace
        lastRow.getCell('id').font = {
          color: { argb: 'FF0000FF' }, // Color azul
          underline: true,
        }
      })
    } else {
      worksheet.columns = [
        { header: 'Date', key: 'dateOfNote', width: 20 },
        { header: 'Headline', key: 'title', width: 25 },
        { header: 'URL', key: 'id', width: 50 },
        { header: 'Media Aproach', key: 'media', width: 20 },
        { header: 'Reach', key: 'reach', width: 20 },
      ]

      results.docs.forEach((doc) => {
        const preDate = new Date(doc.dateOfNote)
        const date = preDate.getDay() + '/' + preDate.getMonth() + '/' + preDate.getFullYear()
        worksheet.addRow({
          dateOfNote: date || 'N/A',
          title: doc.title || 'N/A',
          id: `${serverURL}/testimonials/${doc.id}` || 'N/A',
          media: capitalizer(doc.media) || 'N/A',
          reach: doc.reach || 'N/A',
        })
        // Obtén la última fila añadida (la que acabamos de crear)
        const lastRow = worksheet.lastRow

        // Agrega el hipervínculo a la celda del ID
        lastRow.getCell('id').value = {
          text: `${serverURL}/testimonials/${doc.id}`, // Texto que se mostrará en la celda
          hyperlink: `${serverURL}/testimonials/${doc.id}`, // URL del enlace
        }

        // Opcional: formatear la celda para que parezca un enlace
        lastRow.getCell('id').font = {
          color: { argb: 'FF0000FF' }, // Color azul
          underline: true,
        }
      })
    }

    // Generar buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Crear respuesta
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=${todayDate}.xlsx`,
      },
    })
  } catch (error: unknown) {
    console.error('Error en exportExcel:', error)
    return new Response(JSON.stringify({ error: 'Error al generar el reporte' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
