import React from 'react'

import NewsletterPageComp from '../../../../custom/NewsletterPageComp'

interface PageProps {
  params: {
    id: string
  }
}
export default async function NewsletterPage({ params }: PageProps) {
  const { id } = await params

  return (
    <>
      <NewsletterPageComp id={id} />
    </>
  )
}
