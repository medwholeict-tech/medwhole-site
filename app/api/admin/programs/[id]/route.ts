import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { programs, insertProgramSchema } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const program = await db.query.programs.findFirst({
      where: eq(programs.id, params.id),
    })

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 })
    }

    return NextResponse.json(program)
  } catch (error) {
    console.error("Error fetching program:", error)
    return NextResponse.json(
      { error: "Failed to fetch program" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = insertProgramSchema.partial().parse(body)

    const [updated] = await db
      .update(programs)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(programs.id, params.id))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating program:", error)
    return NextResponse.json(
      { error: "Failed to update program" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await db.delete(programs).where(eq(programs.id, params.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting program:", error)
    return NextResponse.json(
      { error: "Failed to delete program" },
      { status: 500 }
    )
  }
}
