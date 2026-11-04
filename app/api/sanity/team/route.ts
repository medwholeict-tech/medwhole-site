import { NextRequest, NextResponse } from "next/server"
import { getTeamMembers } from "@/lib/sanity-queries"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category") || undefined

    const team = await getTeamMembers(category)

    return NextResponse.json(team, { status: 200 })
  } catch (error) {
    console.error("Error fetching team from Sanity:", error)
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    )
  }
}
