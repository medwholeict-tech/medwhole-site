import { NextRequest, NextResponse } from "next/server"
import { getEvents } from "@/lib/sanity-queries"

export const dynamic = 'force-dynamic'

function parseLimit(raw: string | null, defaultLimit: number) {
  if (!raw) return defaultLimit
  const value = Number(raw)
  if (!Number.isFinite(value)) return defaultLimit
  return Math.max(1, Math.min(Math.trunc(value), 50))
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category") || undefined
    const limit = parseLimit(searchParams.get("limit"), 10)

    const events = await getEvents(category, limit)

    return NextResponse.json(events, { status: 200 })
  } catch (error) {
    console.error("Error fetching events from Sanity:", error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    )
  }
}
