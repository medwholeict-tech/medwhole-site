import { NextResponse } from 'next/server'
import { getJobs } from '@/lib/sanity-queries'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department') || undefined
    const employmentType = searchParams.get('type') || undefined
    const limit = parseInt(searchParams.get('limit') || '20')

    const jobs = await getJobs(department, employmentType, limit)

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}
