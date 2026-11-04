import { NextResponse } from "next/server"
import { generateAntiBotToken } from "@/lib/bot-protection"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action") || "form_submit"
    const token = generateAntiBotToken(action)

    return NextResponse.json({ token }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ token: null }, { status: 500 })
  }
}
