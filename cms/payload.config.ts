import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { buildConfig } from 'payload'
import { Administrators } from './src/collections/Administrators'
import { Communities, Events, ImpactStories, Jobs, News, Partners, Programmes, Resources, TeamMembers } from './src/collections/Editorial'
import { Media } from './src/collections/Media'
import { ContactSubmissions, DonationIntents, DonationPayments, EmailDeliveries, EventRegistrations, NewsletterSubscribers, PartnershipApplications, VolunteerApplications } from './src/collections/Operations'
import { Pages } from './src/collections/Pages'
import { Homepage } from './src/globals/Homepage'
import { Navigation } from './src/globals/Navigation'
import { SiteSettings } from './src/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const serverURL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3100'
const isProduction = process.env.NODE_ENV === 'production'

const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({ level, msg: objOrMsg }))
    } else {
      fn(JSON.stringify({ level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg }))
    }
  }

const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'info',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
} as any

async function resolveDatabaseConnectionString() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  try {
    const { env } = await getCloudflareContext({ async: true })
    const hyperdrive = (env as { HYPERDRIVE?: { connectionString?: string } }).HYPERDRIVE
    return hyperdrive?.connectionString || ''
  } catch {
    return ''
  }
}

const databaseConnectionString = await resolveDatabaseConnectionString()

export default buildConfig({
  serverURL,
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Administrators.slug,
    importMap: { baseDir: path.resolve(dirname, 'src') },
    meta: { titleSuffix: ' | MedWHOLE CMS' },
    dateFormat: 'dd/MM/yyyy HH:mm',
  },
  editor: lexicalEditor(),
  collections: [
    Administrators, Media, Pages, Programmes, Events, News, Communities,
    ImpactStories, TeamMembers, Partners, Resources, Jobs,
    ContactSubmissions, VolunteerApplications, PartnershipApplications,
    NewsletterSubscribers, EventRegistrations, DonationIntents, DonationPayments,
    EmailDeliveries,
  ],
  globals: [Homepage, SiteSettings, Navigation],
  db: postgresAdapter({
    pool: { connectionString: databaseConnectionString, maxUses: 1 },
    schemaName: 'medwhole_cms',
    push: process.env.PAYLOAD_DB_PUSH === 'true',
  }),
  logger: isProduction ? cloudflareLogger : undefined,
  plugins: [
    s3Storage({
      alwaysInsertFields: true,
      enabled: Boolean(process.env.S3_BUCKET),
      collections: { media: { prefix: 'medwhole' } },
      bucket: process.env.S3_BUCKET || '',
      config: {
        region: process.env.AWS_REGION || process.env.S3_REGION || 'us-east-1',
        ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
          credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY },
        } : {}),
        ...((process.env.AWS_ENDPOINT_URL_S3 || process.env.S3_ENDPOINT) ? {
          endpoint: process.env.AWS_ENDPOINT_URL_S3 || process.env.S3_ENDPOINT,
        } : {}),
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
      },
    }),
  ],
  typescript: { outputFile: path.resolve(dirname, 'src/payload-types.ts') },
  graphQL: { disable: true },
  maxDepth: 3,
  cors: (process.env.PAYLOAD_CORS_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean),
  csrf: (process.env.PAYLOAD_CSRF_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean),
})
