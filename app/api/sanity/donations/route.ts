import { NextResponse } from 'next/server'
import { getDonationCampaigns } from '@/lib/sanity-queries'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const limit = parseInt(searchParams.get('limit') || '10')

    const campaigns = await getDonationCampaigns(status, limit)

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Error fetching donation campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch donation campaigns' },
      { status: 500 }
    )
  }
}
