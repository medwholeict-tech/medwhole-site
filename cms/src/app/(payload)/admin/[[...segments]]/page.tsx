import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({ config, params, searchParams })

export default async function AdminPage({ params, searchParams }: Args) {
  const routeParams = await params
  return RootPage({ config, params: Promise.resolve({ ...routeParams, segments: routeParams.segments || [] }), searchParams, importMap })
}
