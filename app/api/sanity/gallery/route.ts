import { NextRequest, NextResponse } from "next/server"
import { getGalleryImages } from "@/lib/sanity-queries"

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
    const limit = parseLimit(searchParams.get("limit"), 20)

    const images = await getGalleryImages(category, limit)

    return NextResponse.json(images, { status: 200 })
  } catch (error) {
    console.error("Error fetching gallery from Sanity:", error)
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 }
    )
  }
}
