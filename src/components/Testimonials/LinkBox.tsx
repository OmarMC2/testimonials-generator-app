import React from 'react'
import Link from 'next/link'
function LinkBox({ link }) {
  return (
    <Link href={link} className="link-box-text">
      {link}
    </Link>
  )
}

export { LinkBox }
