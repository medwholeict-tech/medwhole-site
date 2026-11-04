import { NextResponse } from 'next/server'
import { getImpactStories } from '@/lib/sanity-queries'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get('program') || undefined
    const limit = parseInt(searchParams.get('limit') || '10')

    const stories = await getImpactStories(programId, limit)

    return NextResponse.json(stories)
  } catch (error) {
    console.error('Error fetching impact stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch impact stories' },
      { status: 500 }
    )
  }
}
