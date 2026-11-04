import { NextResponse } from "next/server"
import { contactFormSchema } from "@/lib/contact"
import { writeClient } from "@/lib/sanity.server"
import { rateLimit } from "@/lib/rate-limit"
import { createWebsiteSubmission } from "@/lib/cms/payload"

export async function POST(request: Request) {
  const ip = (request.headers as Headers).get("x-forwarded-for")?.split(",")[0] ?? "unknown"
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const body = await request.json()
    const parsed = contactFormSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Check the form and try again" },
        { status: 400 },
      )
    }

    if (parsed.data.website) {
      return NextResponse.json({ success: true, message: "Message received" })
    }

    const submission = await writeClient.create({
      _type: "contactSubmission",
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      subject: parsed.data.subject,
      message: parsed.data.message,
      status: "new",
      submittedAt: new Date().toISOString(),
    })

    try {
      if (process.env.PAYLOAD_CMS_URL && process.env.PAYLOAD_CMS_WEBSITE_API_KEY) {
        await createWebsiteSubmission("contact-submissions", {
          fullName: parsed.data.name,
          email: parsed.data.email.toLowerCase(),
          phone: parsed.data.phone || "",
          subject: parsed.data.subject,
          message: parsed.data.message,
          status: "new",
          submittedAt: new Date().toISOString(),
        })
      }
    } catch (cmsError) {
      console.warn("Payload contact submission write:", cmsError)
    }

    return NextResponse.json(
      { success: true, message: "Message received successfully", id: submission._id },
      { status: 201 },
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "We could not receive your message. Please try again." },
      { status: 500 },
    )
  }
}
