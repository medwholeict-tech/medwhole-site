import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { listPrivatePayloadDocuments, updatePrivatePayloadDocument } from "@/lib/cms/payload"
import type { CmsCollection } from "@/lib/cms/types"
import { inboxStatuses } from "@/lib/cms/inbox-statuses"

export const dynamic = "force-dynamic"

const collections = new Set<CmsCollection>([
  "contact-submissions", "volunteer-applications", "partnership-applications",
  "newsletter-subscribers", "event-registrations", "donation-intents", "donation-payments",
  "email-deliveries",
])

type Context = { params: Promise<{ collection: string }> }

function isAllowed(collection: string): collection is CmsCollection {
  return collections.has(collection as CmsCollection)
}

function validOrigin(request: Request) {
  const origin = request.headers.get("origin")
  return Boolean(origin && origin === new URL(request.url).origin)
}

export async function GET(request: Request, props: Context) {
  const params = await props.params;
  if (!(await auth())?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isAllowed(params.collection)) return NextResponse.json({ error: "Unknown inbox" }, { status: 404 })
  const incoming = new URL(request.url).searchParams
  const query = new URLSearchParams()
  query.set("limit", String(Math.min(100, Math.max(1, Number(incoming.get("limit")) || 50))))
  query.set("sort", "-submittedAt")
  try {
    return NextResponse.json(await listPrivatePayloadDocuments(params.collection, query.toString()))
  } catch {
    return NextResponse.json({ error: "This Payload inbox is unavailable or its role-specific key is not configured." }, { status: 503 })
  }
}

export async function PATCH(request: Request, props: Context) {
  const params = await props.params;
  if (!(await auth())?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!validOrigin(request)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
  if (!isAllowed(params.collection)) return NextResponse.json({ error: "Unknown inbox" }, { status: 404 })
  try {
    const { id, status } = await request.json()
    const statuses = inboxStatuses(params.collection)
    if (typeof id !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(id) || typeof status !== "string" || !statuses.includes(status)) {
      return NextResponse.json({ error: "Invalid inbox update" }, { status: 400 })
    }
    return NextResponse.json(await updatePrivatePayloadDocument(params.collection, id, { status }))
  } catch {
    return NextResponse.json({ error: "Could not update this record. Check the user's Payload role." }, { status: 502 })
  }
}
