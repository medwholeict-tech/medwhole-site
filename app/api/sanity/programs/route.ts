import { NextRequest, NextResponse } from "next/server"
import { getPrograms } from "@/lib/sanity-queries"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category") || undefined

    const programs = await getPrograms(category)

    return NextResponse.json(programs, { status: 200 })
  } catch (error) {
    console.error("Error fetching programs from Sanity:", error)
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    )
  }
}
