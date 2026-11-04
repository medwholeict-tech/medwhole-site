import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { writeClient } from '@/lib/sanity.server'
import { sendRegistrationConfirmation, sendOrganizerNotification } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import {
  antiBotConfigured,
  verifyAntiBotToken,
  isHoneypotTriggered,
  isSpamPattern,
} from '@/lib/bot-protection'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Sanity document IDs are limited to alphanumeric characters plus _ . -
const eventIdSchema = z
  .string()
  .regex(/^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}$/, 'Invalid event ID')

const registrationFormSchema = z.object({
  eventId: eventIdSchema,
  formData: z
    .array(
      z.object({
        fieldId: z.string().max(200).optional(),
        label: z.string().min(1).max(200),
        value: z
          .union([z.string().max(4000), z.number(), z.boolean()])
          .optional()
          .transform((v) => (v === undefined || v === null ? '' : String(v))),
      })
    )
    .min(1)
    .max(60),
  // Honeypot fields and the anti-bot token are optional extras
  website: z.string().max(500).optional(),
  antiBotToken: z.string().max(200).optional(),
})

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const parsed = registrationFormSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid registration data' },
        { status: 400 }
      )
    }

    const { eventId, website, antiBotToken } = parsed.data

    // Normalize: emails and stored documents expect a required fieldId
    const formData = parsed.data.formData.map((field) => ({
      fieldId: field.fieldId ?? field.label,
      label: field.label,
      value: field.value,
    }))

    // Honeypot: silently accept so bots do not retry with other tactics
    if (isHoneypotTriggered({ website })) {
      return NextResponse.json({
        success: true,
        message: 'Registration submitted successfully',
      })
    }

    // Signed bot check: the form fetches a token on page load and must
    // submit it. Skipped only when NEXTAUTH_SECRET is not configured.
    if (antiBotConfigured) {
      const botCheck = verifyAntiBotToken(antiBotToken, 'event-registration')
      if (botCheck.isBot) {
        return NextResponse.json(
          {
            error:
              'Registration could not be submitted. Please refresh the page and try again.',
          },
          { status: 400 }
        )
      }
    }

    // Extract contact info for easy reference
    const contactEmail =
      formData.find((field) => field.label.toLowerCase().includes('email'))?.value ||
      ''

    const contactName =
      formData.find((field) => field.label.toLowerCase().includes('name'))?.value ||
      ''

    if (!contactEmail || !contactName) {
      return NextResponse.json(
        { error: 'Name and email are required in the form' },
        { status: 400 }
      )
    }

    if (isSpamPattern(contactName, contactEmail).isBot) {
      return NextResponse.json({
        success: true,
        message: 'Registration submitted successfully',
      })
    }

    // Fetch event details
    const event = await writeClient.fetch(
      `*[_type == "event" && _id == $eventId][0] {
        _id,
        title,
        slug,
        date,
        venue,
        registrationForm {
          notificationEmails
        }
      }`,
      { eventId }
    )

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Create registration document in Sanity
    const registration = await writeClient.create({
      _type: 'eventRegistration',
      event: {
        _type: 'reference',
        _ref: eventId,
      },
      submittedAt: new Date().toISOString(),
      formData: {
        data: formData,
      },
      contactEmail,
      contactName,
      status: 'pending',
    })

    // Send confirmation email to registrant
    try {
      await sendRegistrationConfirmation(
        { name: contactName, email: contactEmail },
        {
          title: event.title,
          date: new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          venue: event.venue,
          slug: event.slug.current,
        },
        formData
      )
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the registration if email fails
    }

    // Send notification to event organizers
    const notificationEmails = event.registrationForm?.notificationEmails || []
    if (notificationEmails.length > 0) {
      try {
        await sendOrganizerNotification(
          notificationEmails,
          { name: contactName, email: contactEmail },
          {
            title: event.title,
            date: new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            venue: event.venue,
            slug: event.slug.current,
          },
          formData
        )
      } catch (emailError) {
        console.error('Failed to send organizer notification:', emailError)
        // Don't fail the registration if email fails
      }
    }

    return NextResponse.json({
      success: true,
      registrationId: registration._id,
      message: 'Registration submitted successfully',
    })
  } catch (error) {
    console.error('Event registration error:', error)
    return NextResponse.json(
      { error: 'Failed to submit registration' },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch registrations for an event (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const parsedEventId = eventIdSchema.safeParse(eventId)
    if (!parsedEventId.success) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
    }

    const registrations = await writeClient.fetch(
      `*[_type == "eventRegistration" && event._ref == $eventId] | order(submittedAt desc) {
        _id,
        submittedAt,
        contactEmail,
        contactName,
        status,
        formData,
        notes
      }`,
      { eventId: parsedEventId.data }
    )

    return NextResponse.json({ registrations })
  } catch (error) {
    console.error('Failed to fetch registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}
