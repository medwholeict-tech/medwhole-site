import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { galleryImages } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined

    let query = db.select().from(galleryImages).where(eq(galleryImages.isActive, true)).orderBy(desc(galleryImages.order), desc(galleryImages.createdAt))

    if (limit) {
      query = query.limit(limit) as any
    }

    const allImages = await query

    // Filter by category if provided
    const filteredImages = category 
      ? allImages.filter(image => image.category?.toLowerCase() === category.toLowerCase())
      : allImages

    return NextResponse.json(filteredImages, { status: 200 })
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 }
    )
  }
}
