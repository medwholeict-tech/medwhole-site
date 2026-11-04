import { randomUUID } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { donationIntentSchema } from "@/lib/donation-intent"
import { sendDonationAdminNotification, sendDonationInstructionsEmail } from "@/lib/donation-email"
import { writeClient } from "@/lib/sanity.server"

export const runtime = "nodejs"

function createReference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "")
  return `MW-${date}-${randomUUID().slice(0, 6).toUpperCase()}`
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") || 0)
  if (contentLength > 20_000) {
    return NextResponse.json({ error: "Submission is too large" }, { status: 413 })
  }

  try {
    const parsed = donationIntentSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please review the highlighted fields", fields: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const input = parsed.data
    const reference = createReference()
    const submittedAt = new Date().toISOString()
    const emailStatus = input.email ? "failed" : "not-requested"

    const record = await writeClient.create({
      _type: "donationIntent",
      reference,
      fullName: input.fullName,
      email: input.email || undefined,
      phone: input.phone || undefined,
      country: input.country,
      currency: input.currency,
      amount: Number(input.amount),
      frequency: input.frequency,
      programme: input.programme,
      designation: input.designation || undefined,
      sourcePath: input.sourcePath || undefined,
      expectedTransferDate: input.expectedTransferDate || undefined,
      consent: input.consent,
      status: "new",
      emailStatus,
      submittedAt,
    })

    const emailIntent = {
      reference,
      fullName: input.fullName,
      email: input.email || undefined,
      phone: input.phone || undefined,
      country: input.country,
      currency: input.currency,
      amount: input.amount,
      frequency: input.frequency,
      programme: input.programme,
      designation: input.designation || undefined,
      sourcePath: input.sourcePath || undefined,
      expectedTransferDate: input.expectedTransferDate || undefined,
    }

    const [donorEmailResult, adminEmailResult] = await Promise.allSettled([
      sendDonationInstructionsEmail(emailIntent),
      sendDonationAdminNotification(emailIntent),
    ])

    const donorEmailSent =
      donorEmailResult.status === "fulfilled" && donorEmailResult.value.success

    if (input.email) {
      await writeClient
        .patch(record._id)
        .set({
          emailStatus: donorEmailSent ? "sent" : "failed",
          ...(donorEmailSent ? { status: "instructions-sent" } : {}),
        })
        .commit()
    }

    if (donorEmailResult.status === "rejected") {
      console.error("Donation instructions email failed:", donorEmailResult.reason)
    }
    if (adminEmailResult.status === "rejected") {
      console.error("Donation admin notification failed:", adminEmailResult.reason)
    }

    return NextResponse.json(
      {
        success: true,
        reference,
        emailSent: donorEmailSent,
        message: "Donation intent recorded",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Donation intent submission failed:", error)
    return NextResponse.json(
      { error: "We could not record your donation intent. Please try again." },
      { status: 500 },
    )
  }
}
