'use client'
import React, { useEffect, useState } from 'react'
import ErrorPage from 'next/error'

import { Header } from '../components/Testimonials/Header'
import { DigitalBody } from '../components/Testimonials/DigitalBody'
import { RRSSBody } from '@/components/Testimonials/RRSSBody'

interface PageProps {
  id: string
}

export default function TestimonialPageComp({ id }: PageProps) {
  const [testimonial, setTestimonial] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    if (!id) return

    const fetchTestimonial = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/testimonials/${id}`)

        if (!response.ok) {
          throw new Error('Testimonial not found')
        }

        const data = await response.json()
        setTestimonial(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonial()
  }, [id])

  if (error) {
    return <ErrorPage statusCode={404} />
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
  const bodySwitch = (testimonial) => {
    let body
    switch (testimonial.type) {
      case 'digital':
        body = <DigitalBody testimonial={testimonial} />
        break
      case 'impreso':
        body = <DigitalBody testimonial={testimonial} />
      default:
        body = <RRSSBody testimonial={testimonial} />
        break
    }
    return body
  }
  return (
    <>
      <div>
        <Header title={testimonial.title} medium={testimonial.medium}></Header>
        {bodySwitch(testimonial)}
      </div>
    </>
  )
}
