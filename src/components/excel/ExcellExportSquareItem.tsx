'use client'
import {Link} from '@payloadcms/ui'

export default function ExcellExportSquareItem() {
  return (
    <>
    <h2 className='dashboard__label'>
    Functions

    </h2>
    <style jsx>
        {`
            .undecored{
                text-decoration:none;
            }   
        `}

    </style>
    <div className="dashboard__card-list">
    <Link className="card card-media undecored" href="/admin/export-excel" style={{textDecoration:'none'}}>
      <h3 className='card__title undecored' >
        Excell export
      </h3>
    </Link>

    </div>
    
    </>
  )
}
