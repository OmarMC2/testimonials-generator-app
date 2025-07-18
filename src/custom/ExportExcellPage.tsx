import React from 'react'
// Para hooks
import { ExportExcellForm } from './ExportExcellForm'

import { DefaultTemplate } from '@payloadcms/next/templates'
import type { AdminViewProps } from 'payload'

// Para componentes UI
import { Gutter } from '@payloadcms/ui'

const ExportExcellPage: React.FC<AdminViewProps> = ({ initPageResult }) => {
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <h1>Exportar Testigos a Excel</h1>
        <ExportExcellForm />
      </Gutter>
    </DefaultTemplate>
  )
}
export default ExportExcellPage
