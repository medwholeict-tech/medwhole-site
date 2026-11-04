import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { events } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined

    let query = db.select().from(events).where(eq(events.isActive, true)).orderBy(desc(events.createdAt))

    if (limit) {
      query = query.limit(limit) as any
    }

    const allEvents = await query

    // Filter by category if provided
    const filteredEvents = category 
      ? allEvents.filter(event => event.category?.toLowerCase() === category.toLowerCase())
      : allEvents

    return NextResponse.json(filteredEvents, { status: 200 })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    )
  }
}
