import { legacyProgramRoutes } from './lib/legacy-program-routes.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep local production builds isolated from Antigravity's continuously
  // running `next dev` process, which writes to the default `.next` directory.
  // Cloudflare/OpenNext and Hostinger's Next.js pipeline expect the standard
  // `.next` output directory, so they override it via NEXT_DIST_DIR=.next.
  distDir:
    process.env.NEXT_DIST_DIR ||
    (process.env.NODE_ENV === 'production' && process.env.CF_BUILD !== '1'
      ? '.next-build'
      : '.next'),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
  },
  async rewrites() {
    // Both legacy favicon locations exist; use the approved public raster asset.
    return { beforeFiles: [{ source: '/favicon.ico', destination: '/favicon.png' }] }
  },
  async headers() {
    // Baseline security headers applied to every route. A strict Content-Security-Policy
    // needs a dedicated testing pass (inline next scripts, Sanity/ImageKit assets),
    // so it is intentionally not added here yet.
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/what-we-do', destination: '/our-work', permanent: true },
      { source: '/programs', destination: '/our-work', permanent: true },
      ...Object.entries(legacyProgramRoutes).map(([slug, destination]) => ({ source: `/programs/${slug}`, destination, permanent: true })),
      { source: '/programs/:slug', destination: '/our-work', permanent: true },
      { source: '/resources', destination: '/impact', permanent: true },
      { source: '/gallery', destination: '/impact', permanent: true },
      { source: '/faq', destination: '/contact', permanent: true },
      { source: '/our-journey', destination: '/about/journey', permanent: true },
      { source: '/donate', destination: '/give', permanent: true },
      { source: '/events/kunyami-health-outreach-2026', destination: '/events/kunyami-health-outreach-feb-2026', permanent: true },
      { source: '/events/community-participation-programme-compart-2026', destination: '/events/compart-graduation-jun-2026', permanent: true },
      { source: '/news/compart-community-participation-programme', destination: '/events/compart-graduation-jun-2026', permanent: true },
      { source: '/health-services', destination: '/our-work/health', permanent: true },
      { source: '/health-services/events/:slug', destination: '/our-work/health', permanent: true },
      { source: '/nutrition', destination: '/our-work/health/nutrition', permanent: true },
      { source: '/empowerment', destination: '/our-work/empowerment', permanent: true },
      { source: '/our-work/literacy/academy', destination: '/academy', permanent: true },
      { source: '/our-work/literacy/summer-school', destination: '/academy/summer-school', permanent: true },
      { source: '/our-work/literacy/good-news-club', destination: '/academy/good-news-club', permanent: true },
      { source: '/careers', destination: '/get-involved', permanent: true },
      { source: '/careers/:slug', destination: '/get-involved', permanent: true },
    ]
  },
}

export default nextConfig
