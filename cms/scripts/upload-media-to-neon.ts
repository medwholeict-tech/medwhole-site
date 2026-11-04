import { config } from 'dotenv'
import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(scriptDirectory, '../.env.local'), override: true, quiet: true })
config({ quiet: true })

const bucket = process.env.S3_BUCKET
const endpoint = process.env.AWS_ENDPOINT_URL_S3
const region = process.env.AWS_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

if (!bucket || !endpoint || !region || !accessKeyId || !secretAccessKey) {
  throw new Error('Set S3_BUCKET and the AWS S3-compatible endpoint, region, and credentials before running.')
}

const mediaDirectory = path.resolve(scriptDirectory, '../media')
const filenames = (await readdir(mediaDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .sort()

if (filenames.length === 0) throw new Error(`No files found in ${mediaDirectory}`)

const client = new S3Client({
  endpoint,
  region,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  credentials: { accessKeyId, secretAccessKey },
})

const contentTypeByExtension: Record<string, string> = {
  '.avif': 'image/avif', '.gif': 'image/gif', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp',
}

for (const filename of filenames) {
  const filePath = path.join(mediaDirectory, filename)
  const key = `medwhole/${filename}`
  const body = await readFile(filePath)
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentLength: body.byteLength,
    ContentType: contentTypeByExtension[path.extname(filename).toLowerCase()] || 'application/octet-stream',
  }))
  const stored = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
  if (stored.ContentLength !== body.byteLength) {
    throw new Error(`Uploaded file failed size verification: ${filename}`)
  }
}

console.log(JSON.stringify({ uploadedAndVerified: filenames.length, bucket, prefix: 'medwhole/' }))
