import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@sanity/client"
import { rateLimit } from "@/lib/rate-limit"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

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

    // Create partnership application in Sanity
    const application = await client.create({
      _type: "partnershipApplication",
      organizationName: data.organizationName,
      organizationType: data.organizationType,
      contactPerson: {
        name: data.contactName,
        title: data.contactTitle,
        email: data.contactEmail,
        phone: data.contactPhone,
      },
      organizationWebsite: data.website || undefined,
      partnershipInterest: data.partnershipInterest,
      proposedCollaboration: data.proposedCollaboration,
      organizationCapacity: data.organizationCapacity || undefined,
      geographicFocus: data.geographicFocus || undefined,
      status: "new",
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Partnership application submitted successfully!",
        id: application._id 
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
