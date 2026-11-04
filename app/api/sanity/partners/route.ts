import { NextResponse } from 'next/server'
import { getPartners } from '@/lib/sanity-queries'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const partnerType = searchParams.get('type') || undefined

    const partners = await getPartners(partnerType)

    return NextResponse.json(partners)
  } catch (error) {
    console.error('Error fetching partners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    )
  }
}
