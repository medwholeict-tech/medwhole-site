import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { programs, insertProgramSchema } from "@/db/schema"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = insertProgramSchema.parse(body)

    const [newProgram] = await db.insert(programs).values(validatedData).returning()

    return NextResponse.json(newProgram, { status: 201 })
  } catch (error) {
    console.error("Error creating program:", error)
    return NextResponse.json(
      { error: "Failed to create program" },
      { status: 500 }
    )
  }
}
