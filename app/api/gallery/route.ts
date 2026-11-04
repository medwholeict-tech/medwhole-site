import { NextResponse } from "next/server"
import { getGalleryImages } from "@/lib/cms/queries"

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams
  try {
    return NextResponse.json(await getGalleryImages(query.get("category") || undefined, Number(query.get("limit")) || 20))
  } catch {
    return NextResponse.json({ error: "Media are temporarily unavailable" }, { status: 503 })
  }
}
