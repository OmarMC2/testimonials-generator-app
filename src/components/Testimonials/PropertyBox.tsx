'use client'
import React from 'react'

function PropertyBox({ properties }) {
  return (
    <div className="property-box general-box">
      {Object.entries(properties).map(([key, value]) => {
        if (key === 'dateOfNote') {
          const preDate = new Date(value)
          const date =
            preDate.getDate() + '/' + (preDate.getMonth() + 1) + '/' + preDate.getFullYear()
          return (
            <div className="row-text" key={key}>
              <strong>Fecha:</strong>
              <span>{date}</span>
            </div>
          )
        } else if (key === 'page' && value === undefined) {
          return ''
        } else {
          return (
            <div className="row-text" key={key}>
              <strong>{key}:</strong>
              <span>{value}</span>
            </div>
          )
        }
      })}
    </div>
  )
}

export { PropertyBox }
