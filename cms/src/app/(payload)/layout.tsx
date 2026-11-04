import '@payloadcms/next/css'
import config from '@payload-config'
import { RootLayout } from '@payloadcms/next/layouts'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async (args) => {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function PayloadLayout({ children }: Args) {
  return <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>{children}</RootLayout>
}
