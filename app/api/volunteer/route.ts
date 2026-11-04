import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@sanity/client"
import { rateLimit } from "@/lib/rate-limit"
import { createWebsiteSubmission } from "@/lib/cms/payload"

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

    if (!data.fullName || !data.email || !data.motivation) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    if (data.website) {
      return NextResponse.json({ success: true })
    }

    // Create volunteer application in Sanity
    const application = await client.create({
      _type: "volunteerApplication",
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      location: {
        state: data.state,
        city: data.city || undefined,
      },
      age: data.age || undefined,
      occupation: data.occupation || undefined,
      education: data.education || undefined,
      areasOfInterest: data.areasOfInterest,
      skills: data.skills,
      availability: {
        frequency: data.frequency || undefined,
        duration: data.duration || undefined,
      },
      motivation: data.motivation,
      previousVolunteer: data.previousVolunteer || undefined,
      status: "new",
      submittedAt: new Date().toISOString(),
    })

    // Also record into Payload operational inbox
    try {
      if (process.env.PAYLOAD_CMS_URL && process.env.PAYLOAD_CMS_WEBSITE_API_KEY) {
        await createWebsiteSubmission("volunteer-applications", {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || "",
          location: {
            state: data.state,
            city: data.city || undefined,
          },
          areasOfInterest: data.areasOfInterest || [],
          skills: data.skills || [],
          motivation: data.motivation,
          status: "new",
          submittedAt: new Date().toISOString(),
        })
      }
    } catch (cmsError) {
      console.warn("Payload volunteer application write:", cmsError)
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Volunteer application submitted successfully!",
        id: application._id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error submitting volunteer application:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to submit application. Please try again." 
      },
      { status: 500 }
    )
  }
}
