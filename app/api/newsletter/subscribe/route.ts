import { NextResponse } from "next/server"
import { newsletterFormSchema } from "@/lib/newsletter"
import { rateLimit } from "@/lib/rate-limit"
import { createWebsiteSubmission, listPrivatePayloadDocuments, updatePrivatePayloadDocument } from "@/lib/cms/payload"

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown"
  if (!rateLimit(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  try {
    const parsed = newsletterFormSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Check your email address and try again" }, { status: 400 })
    const { name, interests, source } = parsed.data
    const email = parsed.data.email.toLowerCase()
    const query = new URLSearchParams({ "where[email][equals]": email, limit: "1", depth: "0" })
    const existing = (await listPrivatePayloadDocuments("newsletter-subscribers", query.toString())).docs[0]
    if (existing) {
      if (existing.status === "unsubscribed" || existing.unsubscribedAt) {
        await updatePrivatePayloadDocument("newsletter-subscribers", String(existing.id), {
          status: "active", confirmedAt: new Date().toISOString(), unsubscribedAt: null, interests,
        })
        return NextResponse.json({ message: "Subscription reactivated successfully", subscriber: { id: existing.id } })
      }
      return NextResponse.json({ error: "Email already subscribed" }, { status: 409 })
    }
    try {
      const subscriber = await createWebsiteSubmission("newsletter-subscribers", {
        email, name, interests, sourcePage: source || "website", confirmedAt: new Date().toISOString(),
        status: "active", submittedAt: new Date().toISOString(),
      })
      return NextResponse.json({ message: "Subscribed successfully", subscriber: { id: subscriber.id } })
    } catch (error) {
      if ((await listPrivatePayloadDocuments("newsletter-subscribers", query.toString())).docs.length) {
        return NextResponse.json({ error: "Email already subscribed" }, { status: 409 })
      }
      throw error
    }
  } catch {
    return NextResponse.json({ error: "We could not save your subscription. Please try again." }, { status: 503 })
  }
}
