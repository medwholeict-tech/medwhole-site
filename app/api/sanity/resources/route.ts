import { NextResponse } from 'next/server'
import { getResources } from '@/lib/sanity-queries'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceType = searchParams.get('type') || undefined
    const category = searchParams.get('category') || undefined
    const limit = parseInt(searchParams.get('limit') || '20')

    const resources = await getResources(resourceType, category, limit)

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}
