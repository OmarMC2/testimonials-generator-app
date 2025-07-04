import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [new URL('https://assets.example.com/account123/**')],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
