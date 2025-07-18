import React from 'react'
import Logo from '../../custom/Logo'

interface PageProps {
  title: string
  medium: string
}
export default function Header({ title, medium }: PageProps) {
  return (
    <header>
      <div className="header-container">
        <div className="title-container">
          <h1 className="testimonial-title">{title}</h1>
          <h2 className="testimonial-media">{medium}</h2>
        </div>
        <Logo />
      </div>
    </header>
  )
}
export { Header }
