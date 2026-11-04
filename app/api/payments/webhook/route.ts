import { NextResponse } from "next/server"
import { settlePaystackPayment, validPaystackSignature } from "@/lib/paystack"

export const runtime = "nodejs"
export async function POST(request: Request) {
  const raw = await request.text()
  if (raw.length > 200_000) return new NextResponse(null, { status: 413 })
  if (!validPaystackSignature(raw, request.headers.get("x-paystack-signature"))) return new NextResponse(null, { status: 401 })
  try {
    const event = JSON.parse(raw)
    if (event.event === "charge.success" && typeof event.data?.reference === "string") await settlePaystackPayment(event.data.reference)
    return NextResponse.json({ received: true })
  } catch {
    // Return a failure so Paystack retries if verification, storage or receipt delivery fails.
    return new NextResponse(null, { status: 500 })
  }
}
