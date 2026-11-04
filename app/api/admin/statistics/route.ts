import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { statistics, insertStatisticSchema } from "@/db/schema"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = insertStatisticSchema.parse(body)

    const [newStat] = await db.insert(statistics).values(validatedData).returning()

    return NextResponse.json(newStat, { status: 201 })
  } catch (error) {
    console.error("Error creating statistic:", error)
    return NextResponse.json(
      { error: "Failed to create statistic" },
      { status: 500 }
    )
  }
}
