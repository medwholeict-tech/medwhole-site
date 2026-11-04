import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export async function finalizeWorker(directory) {
  const handlerPath = path.join(directory, '.open-next/server-functions/default/handler.mjs')
  const source = await readFile(handlerPath, 'utf8')
  const dynamicManifest = 'require(this.middlewareManifestPath)'
  if (!source.includes(dynamicManifest)) return
  const packagedManifest = path.join(directory, '.open-next/server-functions/default/.next/server/middleware-manifest.json')
  const manifestSource = await readFile(packagedManifest, 'utf8').catch(error => {
    if (error.code !== 'ENOENT') throw error
    return readFile(path.join(directory, '.next/server/middleware-manifest.json'), 'utf8')
  })
  const manifest = JSON.parse(manifestSource)
  // Workers cannot dynamically require files. Embed the exact build manifest.
  await writeFile(handlerPath, source.replaceAll(dynamicManifest, `(${JSON.stringify(manifest)})`))
  console.log('Inlined the built middleware manifest for the Worker runtime.')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  await finalizeWorker(process.argv[2] === 'cms' ? path.join(root, 'cms') : root)
}
