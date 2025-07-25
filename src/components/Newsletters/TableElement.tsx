import React from 'react'

function TableElement({ url, title, extract, image, alt, extraClass = '' }) {
  return (
    <div className={`newsletter-testimonial-table-element ${extraClass}`}>
      <div className="newsletter-testimonial-img-container">
        <img
          src={image}
          alt={alt}
          className="newsletter-testimonial-img"
          width={500}
          height={300}
        />
      </div>
      <div className="newsletter-testimonial-text">
        <h3 className="newsletter-testimonial-title">{title}</h3>
        <p className="newsletter-testimonial-extract">{extract}</p>
        <a href={url} className="newsletter-testimonial-link">
          {url}
        </a>
      </div>
    </div>
  )
}

export { TableElement }
