import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { access, mkdtemp, readFile, rmdir, unlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'dotenv'

const target = process.argv[2]
if (!['cms', 'website'].includes(target)) throw new Error('Choose cms or website')
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const directory = target === 'cms' ? path.join(root, 'cms') : root
await access(path.join(directory, '.open-next/worker.js'))

const envFile = path.join(directory, '.env.local')
const values = { ...parse(await readFile(envFile)), ...process.env }
const secretNames = target === 'cms' ? [
  'PAYLOAD_SECRET', 'AWS_ENDPOINT_URL_S3', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION', 'S3_BUCKET', 'S3_FORCE_PATH_STYLE',
] : [
  'DATABASE_URL', 'NEXTAUTH_SECRET', 'AUTH_SECRET',
  'RESEND_API_KEY', 'ADMIN_EMAIL', 'IMAGEKIT_PRIVATE_KEY', 'PAYSTACK_SECRET_KEY',
  'PAYLOAD_CMS_READ_API_KEY', 'PAYLOAD_CMS_ADMIN_API_KEY',
  'PAYLOAD_CMS_OPERATIONS_API_KEY', 'PAYLOAD_CMS_FINANCE_API_KEY', 'PAYLOAD_CMS_WEBSITE_API_KEY',
]
const required = target === 'cms' ? secretNames : [
  'DATABASE_URL', 'NEXTAUTH_SECRET', 'PAYLOAD_CMS_READ_API_KEY', 'PAYLOAD_CMS_ADMIN_API_KEY',
  'PAYLOAD_CMS_OPERATIONS_API_KEY', 'PAYLOAD_CMS_FINANCE_API_KEY', 'PAYLOAD_CMS_WEBSITE_API_KEY',
]
for (const name of required) {
  if (!values[name] || /^(build-placeholder|replace-me|replace-with)/.test(values[name])) {
    throw new Error(`Configure ${name} in ${envFile} before deploying`)
  }
}
const secrets = Object.fromEntries(secretNames.filter(name => values[name]).map(name => [name, values[name]]))
const require = createRequire(path.join(directory, 'package.json'))
const cli = require.resolve('wrangler')
const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'medwhole-cf-secrets-'))
const secretsFile = path.join(temporaryDirectory, 'secrets.json')

try {
  await writeFile(secretsFile, JSON.stringify(secrets), { mode: 0o600, flag: 'wx' })
  console.log(`Deploying ${target}; ${Object.keys(secrets).length} secret bindings will be uploaded without printing their values.`)
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, 'deploy', '--secrets-file', secretsFile], {
      cwd: directory,
      stdio: 'inherit',
      // The OpenNext artifact is already built; use Wrangler's deployment path.
      env: { ...process.env, OPEN_NEXT_DEPLOY: 'true' },
    })
    child.once('error', reject)
    child.once('exit', code => resolve(code ?? 1))
  })
  process.exitCode = code
} finally {
  await unlink(secretsFile).catch(() => {})
  await rmdir(temporaryDirectory).catch(() => {})
}
