import { NextResponse } from "next/server"
import { getCombinedSocialFeed } from "@/lib/social-feed"

export const dynamic = "force-dynamic"
export const revalidate = 3600 // Cache for 1 hour

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || 8), 1), 20)

    const items = await getCombinedSocialFeed(limit)

    return NextResponse.json(
      {
        items,
        count: items.length,
        fetchedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    )
  } catch (error) {
    console.error("Error in /api/social-feed:", error)
    return NextResponse.json(
      { error: "Failed to fetch social feed", items: [] },
      { status: 500 }
    )
  }
}
