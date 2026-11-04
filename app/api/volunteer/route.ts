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

    if (!data.fullName || !data.email || !data.motivation) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    if (data.website) {
      return NextResponse.json({ success: true })
    }

    const application = await createWebsiteSubmission("volunteer-applications", {
      fullName: data.fullName, email: String(data.email).toLowerCase(), phone: data.phone,
      location: { state: data.state, city: data.city },
      areasOfInterest: data.areasOfInterest || [], skills: data.skills || [], motivation: data.motivation,
      details: { age: data.age, occupation: data.occupation, education: data.education,
        availability: { frequency: data.frequency, duration: data.duration }, previousVolunteer: data.previousVolunteer },
      status: "new", submittedAt: new Date().toISOString(),
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Volunteer application submitted successfully!",
        id: application.id
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
