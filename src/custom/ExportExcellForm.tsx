'use client'
import React, { useEffect, useState } from 'react'
import { useConfig, Button, useAuth } from '@payloadcms/ui'
import { redirect } from 'next/navigation'

interface Client {
  id: string
  name: string
}

interface Theme {
  id: string
  name: string
}

function ExportExcellForm() {
  const { config } = useConfig()
  const { serverURL } = config
  const [clients, setClients] = useState<Client[]>([])
  const [excelType, setExcelType] = useState<string>('Regular')
  const [themes, setThemes] = useState<Theme[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientID, setClientID] = useState('')
  const [themeID, setThemeID] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const { user } = useAuth()

  // Obtener opciones de clientes y temas
  useEffect(() => {
    if (!user) {
      return redirect('/admin/login/')
    }
  }, [user])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [resClients, resThemes] = await Promise.all([
          fetch(`${serverURL}/api/clients?limit=100`),
          fetch(`${serverURL}/api/themes?limit=100`),
        ])

        if (!resClients.ok || !resThemes.ok) {
          throw new Error('Error al cargar las opciones')
        }

        const [dataClients, dataThemes] = await Promise.all([resClients.json(), resThemes.json()])

        setClients(dataClients.docs)
        setThemes(dataThemes.docs)
      } catch (err: unknown) {
        console.error('Error loading options:', err)
        setError('No se pudieron cargar las opciones. Intente más tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOptions()
  }, [serverURL])

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (new Date(startDate) > new Date(endDate)) {
      setError('La fecha de inicio no puede ser mayor que la fecha de fin')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch(`${serverURL}/api/export-excel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('payload-token')}`,
        },
        body: JSON.stringify({
          clientID,
          themeID,
          startDate,
          endDate,
          excelType,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Error al generar el Excel')
      }

      const blob = await res.blob()
      const filename =
        res.headers.get('content-disposition')?.split('filename=')[1] || 'testigos.xlsx'

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err: unknown) {
      console.error('Download error:', err)
      setError(err.message || 'Error al generar el archivo Excel')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      {error && (
        <div
          style={{
            color: 'red',
            marginBottom: '1rem',
            padding: '0.5rem',
            border: '1px solid red',
            borderRadius: '4px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleDownload}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Cliente:
          </label>
          <select
            value={clientID}
            onChange={(e) => setClientID(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
            disabled={isLoading}
          >
            <option value="">Seleccione un cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Tema:
          </label>
          <select
            value={themeID}
            onChange={(e) => setThemeID(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
            disabled={isLoading}
          >
            <option value="">Seleccione un tema</option>
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Fecha de inicio:
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
            disabled={isLoading}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Fecha de fin:
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
            disabled={isLoading}
          />
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Tipo de Excel
          </label>
          <select
            value={excelType}
            onChange={(e) => setExcelType(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
            disabled={isLoading}
          >
            <option id="Regular" value="Regular">
              Regular
            </option>
            <option id="Crisis" value="Crisis">
              Crisis
            </option>
          </select>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generando Excel...' : 'Generar Excel'}
        </Button>
      </form>
    </>
  )
}

export { ExportExcellForm }
