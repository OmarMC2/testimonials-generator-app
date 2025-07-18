'use client'
import React, { useEffect, useState } from 'react'
import ErrorPage from 'next/error'
import Header from '../components/newsletters/Header';
import TableElement from '../components/newsletters/TableElement';
import RichText from '../components/richText/index';

interface PageProps {
  id: string
}

export default function NewsletterPageComp({ id }: PageProps) {
  const [newsletter, setNewsletter] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchNewsletter = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/newsletters/${id}?depth=2`)

        if (!response.ok) throw new Error('Newsletter not found')

        const data = await response.json()
        setNewsletter(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNewsletter()
  }, [id])

  if (error) return <ErrorPage statusCode={404} />
  if (isLoading || !newsletter) return <div>Loading...</div>

  // Genera la URL base automáticamente
  const getBaseURL = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin // Usa la URL actual del navegador
    }
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' // Fallback para SSR
  }

  return (
    <>
      <Header frecuency={newsletter.frecuency} client={newsletter.client.name} />
      <main className="newsletter-body">
        <section className="newsletter-sec">
          <h3 className="newsletter-subtitle">Resumen</h3>
          <RichText data={newsletter.resume} />
        </section>
        <section className="newsletter-sec">
          <h3 className="newsletter-subtitle">Observaciones</h3>
          <RichText data={newsletter.obervations} />
        </section>
        <section className="newsletter-sec">
          <h3 className="newsletter-subtitle">Testigos destacados</h3>
          <div className="newsletter-testimonials-table">
            {newsletter.testimonials?.map((testimonial, idx) => (
              <TableElement
                key={idx}
                url={`${getBaseURL()}/testimonials/${testimonial.id}`}
                extract={testimonial.extract}
                image={testimonial.images?.[0]?.image?.url}
                alt={testimonial.images?.[0]?.image?.alt}
                title={testimonial.title}
                extraClass={idx !== newsletter.testimonials.length - 1 ? 'subrayed' : ''}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
