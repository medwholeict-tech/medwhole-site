import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { teamMembers, insertTeamMemberSchema } from "@/db/schema"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = insertTeamMemberSchema.parse(body)

    const [newMember] = await db.insert(teamMembers).values(validatedData).returning()

    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    console.error("Error creating team member:", error)
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    )
  }
}
