import { NextResponse } from 'next/server'
import { getTestimonials } from '@/lib/sanity-queries'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || undefined
    const limit = parseInt(searchParams.get('limit') || '10')

    const testimonials = await getTestimonials(category, limit)

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}
