import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['jose', 'pg-cloudflare'],
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
