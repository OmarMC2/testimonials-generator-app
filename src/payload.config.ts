// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Testimonials } from './collections/Testimonials'

import { Themes } from './collections/Themes'
import { Clients } from './collections/Clients'

import { excelExport } from './endpoints/excelExport'
import { Newsletters } from './collections/Newsletters'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

interface Envs {
  bucket: string
  secretAccessKey: string
  accessKeyId: string
  region: string
  dbURI: string
  payloadSecret: string
  serverUrl: string
}
const envs: Envs = {
  bucket: process.env.AWS_S3_BUCKET_NAME || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  region: process.env.AWS_REGION || '',
  dbURI: process.env.DATABASE_URI || '',
  payloadSecret: process.env.PAYLOAD_SECRET || '',
  serverUrl: process.env.SERVER_URL || '',
}
const { bucket, secretAccessKey, accessKeyId, region, dbURI, payloadSecret, serverUrl } = envs

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      views: {
        'export-excel-page': {
          path: '/export-excel',
          Component: './custom/ExportExcellPage.tsx',
        },
      },
      graphics: {
        Logo: './components/Login',
      },
      afterNavLinks: ['./components/excel/ExcellExportNavItem.tsx'],
      afterDashboard: ['./components/excel/ExcellExportSquareItem.tsx'],
    },
  },
  serverURL: serverUrl,
  collections: [Users, Media, Testimonials, Newsletters, Themes, Clients],
  editor: lexicalEditor(),
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: dbURI,
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    s3Storage({
      collections: {
        media: true,
      },
      bucket: bucket,
      config: {
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        },
        region: region,
        // ... Other S3 configuration
      },
    }),

    // storage-adapter-placeholder
  ],
  endpoints: [
    {
      path: '/export-excel',
      method: 'post',
      handler: excelExport,
    },
  ],
})
