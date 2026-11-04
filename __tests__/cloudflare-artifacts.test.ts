import { describe, expect, it } from "vitest"
import { relativizeWorkerImports } from "../scripts/cf-finalize.mjs"

describe("portable Cloudflare build artifacts", () => {
  it("keeps binary modules resolvable after moving a Linux build to Windows", () => {
    const root = "/home/runner/work/site/site/cms/.open-next/server-functions/default/"
    const source = `import yoga from"${root}node_modules/next/yoga.wasm?module";await import("${root}node_modules/next/font.ttf.bin")`
    expect(relativizeWorkerImports(source)).toBe('import yoga from"./node_modules/next/yoga.wasm?module";await import("./node_modules/next/font.ttf.bin")')
  })

  it("handles drive paths and leaves normal imports and application strings intact", () => {
    const source = `import wasm from 'C:/build/cms/.open-next/server-functions/default/runtime.wasm?module';import 'cloudflare:workers';const path="/build/.open-next/server-functions/default/example"`
    expect(relativizeWorkerImports(source)).toBe(`import wasm from './runtime.wasm?module';import 'cloudflare:workers';const path="/build/.open-next/server-functions/default/example"`)
  })
})
