import { NextResponse } from "next/server"
import { getAllEvents } from "@/lib/cms/queries"

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams
  const limit = Math.max(1, Math.min(Number(query.get("limit")) || 100, 100))
  try {
    const events = await getAllEvents()
    return NextResponse.json(events.filter(event => !query.get("category") || event.category === query.get("category")).slice(0, limit))
  } catch {
    return NextResponse.json({ error: "Events are temporarily unavailable" }, { status: 503 })
  }
}
