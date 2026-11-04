import { NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { createWebsiteSubmission } from "@/lib/cms/payload"

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown"
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const data = await request.json()

    if (!data.organizationName || !data.contactEmail || !data.proposedCollaboration) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    if (data.website_trap) {
      return NextResponse.json({ success: true })
    }

    const application = await createWebsiteSubmission("partnership-applications", {
      fullName: data.contactName || data.organizationName, email: String(data.contactEmail).toLowerCase(),
      organisation: data.organizationName, phone: data.contactPhone,
      partnershipType: data.organizationType || "", message: data.proposedCollaboration,
      details: { contactTitle: data.contactTitle, organizationWebsite: data.website,
        partnershipInterest: data.partnershipInterest, organizationCapacity: data.organizationCapacity,
        geographicFocus: data.geographicFocus },
      status: "new", submittedAt: new Date().toISOString(),
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Partnership application submitted successfully!",
        id: application.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error submitting partnership application:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to submit application. Please try again." 
      },
      { status: 500 }
    )
  }
}
