import React from 'react'

import TestimonialPageComp from '../../../../custom/TestimonialPageComp'
interface PageProps {
  params: {
    id: string
  }
}
export default function TestimonialPage({ params }: PageProps) {
  const { id } = params

  return (
    <>
      <TestimonialPageComp id={id} />
    </>
  )
}
