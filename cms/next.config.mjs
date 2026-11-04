import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['jose', 'pg-cloudflare'],
  async redirects() {
    const origin = process.env.PAYLOAD_PUBLIC_SERVER_URL
    const previousHost = process.env.PAYLOAD_PREVIOUS_HOST
    if (!origin || !previousHost) return []
    const canonical = new URL(origin)
    if (canonical.hostname === previousHost) return []
    return [{
      source: '/:path*',
      has: [{ type: 'host', value: previousHost }],
      destination: `${canonical.origin}/:path*`,
      permanent: true,
    }]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
