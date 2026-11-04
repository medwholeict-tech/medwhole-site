import { Resend } from 'resend'
import { recordPayloadEmailDelivery } from '@/lib/cms/email-delivery'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// Default sender email
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev'

interface EventDetails {
  title: string
  date: string
  venue?: string
  slug: string
}

interface RegistrantDetails {
  name: string
  email: string
}

interface FormDataField {
  fieldId: string
  label: string
  value: string
}

/**
 * Send confirmation email to registrant
 */
export async function sendRegistrationConfirmation(
  registrant: RegistrantDetails,
  event: EventDetails,
  formData: FormDataField[]
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: registrant.email,
      subject: `Registration Confirmed: ${event.title}`,
      html: generateConfirmationEmail(registrant, event, formData),
    })

    if (error) {
      console.error('Failed to send confirmation email:', error)
      throw error
    }

    await recordPayloadEmailDelivery({ template: 'event-registration-confirmation', recordId: event.slug, recipient: registrant.email, providerId: data?.id, status: 'sent' })
    return { success: true, data }
  } catch (error) {
    await recordPayloadEmailDelivery({ template: 'event-registration-confirmation', recordId: event.slug, recipient: registrant.email, status: 'failed', error })
    console.error('Error sending confirmation email:', error)
    throw error
  }
}

/**
 * Send notification email to event organizers
 */
export async function sendOrganizerNotification(
  organizerEmails: string[],
  registrant: RegistrantDetails,
  event: EventDetails,
  formData: FormDataField[]
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: organizerEmails,
      subject: `New Registration: ${event.title}`,
      html: generateOrganizerNotificationEmail(registrant, event, formData),
    })

    if (error) {
      console.error('Failed to send organizer notification:', error)
      throw error
    }

    await Promise.all(organizerEmails.map((recipient) => recordPayloadEmailDelivery({ template: 'event-organizer-notification', recordId: event.slug, recipient, providerId: data?.id, status: 'sent' })))
    return { success: true, data }
  } catch (error) {
    await Promise.all(organizerEmails.map((recipient) => recordPayloadEmailDelivery({ template: 'event-organizer-notification', recordId: event.slug, recipient, status: 'failed', error })))
    console.error('Error sending organizer notification:', error)
    throw error
  }
}

/**
 * Generate HTML for confirmation email
 */
function generateConfirmationEmail(
  registrant: RegistrantDetails,
  event: EventDetails,
  formData: FormDataField[]
): string {
  const eventUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/events/${event.slug}`
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Confirmed</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1b3a57; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; border-top: 4px solid #ffb800;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-family: Georgia, serif;">Registration Confirmed</h1>
          <p style="color: #afc9d8; margin: 8px 0 0; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase;">MedWHOLE Alliance</p>
        </div>
        
        <div style="background: #f9f6f0; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #9faebb; border-top: none;">
          <p style="font-size: 16px; margin-bottom: 20px; color: #333333;">Hello ${registrant.name},</p>
          
          <p style="font-size: 16px; margin-bottom: 30px; color: #333333;">
            Thank you for registering for <strong style="color: #1b3a57;">${event.title}</strong>. We're excited to have you join us!
          </p>
          
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #004f42;">
            <h2 style="margin-top: 0; color: #1b3a57; font-size: 20px; font-family: Georgia, serif;">Event Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; width: 120px;">Event:</td>
                <td style="padding: 8px 0;">${event.title}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600;">Date:</td>
                <td style="padding: 8px 0;">${event.date}</td>
              </tr>
              ${event.venue ? `
              <tr>
                <td style="padding: 8px 0; font-weight: 600;">Location:</td>
                <td style="padding: 8px 0;">${event.venue}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          ${formData.length > 0 ? `
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="margin-top: 0; color: #333; font-size: 18px;">Your Registration Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${formData.map(field => `
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; width: 120px; vertical-align: top;">${field.label}:</td>
                  <td style="padding: 8px 0; word-break: break-word;">${field.value}</td>
                </tr>
              `).join('')}
            </table>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${eventUrl}" style="display: inline-block; background: #ffb800; color: #14213d; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 16px;">View Event Details</a>
          </div>
          
          <div style="border-top: 1px solid #9faebb; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #5d6670; font-size: 14px; margin: 5px 0;">
              If you have any questions, please don't hesitate to reach out to us.
            </p>
            <p style="color: #5d6670; font-size: 14px; margin: 5px 0;">
              MedWHOLE Alliance<br>
              <a href="mailto:info@medwhole.org" style="color: #004f42; text-decoration: none; font-weight: 600;">info@medwhole.org</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Generate HTML for organizer notification email
 */
function generateOrganizerNotificationEmail(
  registrant: RegistrantDetails,
  event: EventDetails,
  formData: FormDataField[]
): string {
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/event-registrations`
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Event Registration</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #14213d; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; border-top: 4px solid #ffb800;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-family: Georgia, serif;">New Registration Received</h1>
          <p style="color: #afc9d8; margin: 6px 0 0; font-size: 12px; letter-spacing: 1.2px; text-transform: uppercase;">MedWHOLE Alliance</p>
        </div>
        
        <div style="background: #f9f6f0; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #9faebb; border-top: none;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            A new registration has been submitted for <strong>${event.title}</strong>.
          </p>
          
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #004f42;">
            <h2 style="margin-top: 0; color: #1b3a57; font-size: 18px; font-family: Georgia, serif;">Registrant Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; width: 100px; color: #333333;">Name:</td>
                <td style="padding: 8px 0; color: #333333;">${registrant.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #333333;">Email:</td>
                <td style="padding: 8px 0;">
                  <a href="mailto:${registrant.email}" style="color: #004f42; text-decoration: none; font-weight: 600;">
                    ${registrant.email}
                  </a>
                </td>
              </tr>
            </table>
          </div>
          
          ${formData.length > 0 ? `
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333; font-size: 18px;">Form Submission</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${formData.map(field => `
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; width: 120px; vertical-align: top; border-bottom: 1px solid #f0f0f0;">
                    ${field.label}:
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; word-break: break-word;">
                    ${field.value}
                  </td>
                </tr>
              `).join('')}
            </table>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${adminUrl}" style="display: inline-block; background: #1b3a57; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 16px; border: 1px solid #ffb800;">View All Registrations</a>
          </div>
          
          <div style="border-top: 1px solid #9faebb; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #5d6670; font-size: 13px; margin: 0;">
              This is an automated notification from MedWHOLE Alliance Event Registration System
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}
