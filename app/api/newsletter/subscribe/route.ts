import { NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity.server'
import { newsletterFormSchema } from '@/lib/newsletter'
import { rateLimit } from '@/lib/rate-limit'
import { createWebsiteSubmission } from '@/lib/cms/payload'

export async function POST(request: Request) {
  const ip = (request.headers as Headers).get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const parsed = newsletterFormSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Check your email address and try again' },
        { status: 400 }
      )
    }

    if (parsed.data.website) {
      return NextResponse.json({ message: 'Subscribed successfully' })
    }

    const { name, interests, source } = parsed.data
    const email = parsed.data.email.toLowerCase()

    const existing = await writeClient.fetch(
      `*[_type == "newsletter" && email == $email][0]`,
      { email }
    )

    if (existing) {
      if (existing.status === 'unsubscribed') {
        await writeClient
          .patch(existing._id)
          .set({
            status: 'active',
            subscribedAt: new Date().toISOString(),
            interests: interests || existing.interests,
          })
          .unset(['unsubscribedAt'])
          .commit()

        return NextResponse.json({
          message: 'Subscription reactivated successfully',
          subscriber: existing,
        })
      }

      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      )
    }

    const subscriber = await writeClient.create({
      _type: 'newsletter',
      email,
      name: name || undefined,
      interests: interests || [],
      source: source || 'website',
      subscribedAt: new Date().toISOString(),
      status: 'active',
    })

    // Also record into Payload operational inbox
    try {
      if (process.env.PAYLOAD_CMS_URL && process.env.PAYLOAD_CMS_WEBSITE_API_KEY) {
        await createWebsiteSubmission('newsletter-subscribers', {
          email,
          name: name || undefined,
          confirmedAt: new Date().toISOString(),
          status: 'new',
          submittedAt: new Date().toISOString(),
        })
      }
    } catch (cmsError) {
      console.warn('Payload newsletter write:', cmsError)
    }

    return NextResponse.json({
      message: 'Subscribed successfully',
      subscriber,
    })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
