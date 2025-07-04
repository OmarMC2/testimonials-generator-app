import React, { useEffect, useState } from 'react'
import Logo from '../../custom/Logo'

export default function Header({ frecuency, client, }) {
  const [title, setTitle] = useState('');
  useEffect(()=>{
      setTitle(`Monitoreo ${frecuency} |`)
  },[frecuency])
    return (
    <header>
      <div className="header-container">
        <div className="newsletter-title-container">
          <h1 className="newsletter-title">{title}</h1>
          <h2 className="newsletter-client">{client}</h2>
        </div>
        <Logo />
      </div>
    </header>
  )
}