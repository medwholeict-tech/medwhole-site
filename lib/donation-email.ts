import "server-only"

import { Resend } from "resend"
import { recordPayloadEmailDelivery } from "@/lib/cms/email-delivery"
import {
  donationProgrammeLabels,
  formatDonationAmount,
  getTransferNarration,
  transferRoutes,
  type DonationCurrency,
  type DonationFrequency,
  type DonationProgramme,
} from "@/lib/donation-intent"

type DonationEmailIntent = {
  reference: string
  fullName: string
  email?: string
  phone?: string
  country: string
  currency: DonationCurrency
  amount: string
  frequency: DonationFrequency
  programme: DonationProgramme
  designation?: string
  sourcePath?: string
  expectedTransferDate?: string
}

const FROM_EMAIL = process.env.EMAIL_FROM || "onboarding@resend.dev"

function escapeHtml(value: string | number | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  return apiKey ? new Resend(apiKey) : null
}

function renderTransferGroups(currency: DonationCurrency) {
  return transferRoutes[currency].groups
    .map(
      (group) => `
        <div style="margin:0 0 18px;">
          <h3 style="margin:0 0 8px;color:#1b3a57;font-size:15px;">${escapeHtml(group.title)}</h3>
          <table role="presentation" style="width:100%;border-collapse:collapse;">
            ${group.details
              .map(
                (detail) => `
                  <tr>
                    <td style="padding:7px 12px 7px 0;color:#5d6670;font-size:13px;vertical-align:top;width:35%;">${escapeHtml(detail.label)}</td>
                    <td style="padding:7px 0;color:#14213d;font-size:13px;font-weight:600;word-break:break-word;">${escapeHtml(detail.value)}</td>
                  </tr>`,
              )
              .join("")}
          </table>
        </div>`,
    )
    .join("")
}

function emailShell(title: string, preheader: string, body: string) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(title)}</title>
    </head>
    <body style="margin:0;background:#f9f6f0;color:#333333;font-family:Arial,Helvetica,sans-serif;">
      <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</span>
      <table role="presentation" style="width:100%;border-collapse:collapse;background:#f9f6f0;">
        <tr>
          <td style="padding:28px 14px;">
            <table role="presentation" style="width:100%;max-width:620px;margin:0 auto;border-collapse:collapse;background:#ffffff;border:1px solid #9faebb;">
              <tr><td style="height:6px;background:#ffb800;"></td></tr>
              <tr>
                <td style="padding:26px 30px;background:#1b3a57;color:#ffffff;">
                  <p style="margin:0 0 5px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#afc9d8;">MedWHOLE Alliance</p>
                  <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:25px;line-height:1.3;font-weight:400;">${escapeHtml(title)}</h1>
                </td>
              </tr>
              <tr><td style="padding:30px;">${body}</td></tr>
              <tr>
                <td style="padding:20px 30px;background:#14213d;color:#afc9d8;font-size:12px;line-height:1.7;">
                  Whole People. Lasting Impact.<br />
                  7 Nissi Drive, Fort Royal Airport Road, Abuja, FCT, Nigeria<br />
                  <a href="mailto:info@medwhole.org" style="color:#ffb800;text-decoration:none;">info@medwhole.org</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`
}

export async function sendDonationInstructionsEmail(intent: DonationEmailIntent) {
  if (!intent.email) return { success: false as const, skipped: true as const }

  const resend = getResendClient()
  if (!resend) return { success: false as const, skipped: false as const }

  const amount = formatDonationAmount(intent.amount, intent.currency)
  const narration = getTransferNarration(intent.reference)
  const body = `
    <p style="margin:0 0 18px;font-size:15px;line-height:1.7;">Hello ${escapeHtml(intent.fullName)},</p>
    <p style="margin:0 0 22px;font-size:15px;line-height:1.7;">Thank you for choosing to support MedWHOLE. We have recorded your donation intent. No payment has been completed yet; please use the instructions below to make the transfer through your bank.</p>
    <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 24px;background:#f9f6f0;border-left:4px solid #ffb800;">
      <tr><td style="padding:16px 18px;font-size:13px;line-height:1.7;">
        <strong style="color:#1b3a57;">Reference:</strong> ${escapeHtml(intent.reference)}<br />
        <strong style="color:#1b3a57;">Intended gift:</strong> ${escapeHtml(amount)}<br />
        <strong style="color:#1b3a57;">Frequency:</strong> ${escapeHtml(intent.frequency === "one-time" ? "One-time" : "Monthly")}<br />
        <strong style="color:#1b3a57;">Preferred use:</strong> ${escapeHtml(donationProgrammeLabels[intent.programme])}${intent.designation ? `<br /><strong style="color:#1b3a57;">Specific work:</strong> ${escapeHtml(intent.designation)}` : ""}
      </td></tr>
    </table>
    <h2 style="margin:0 0 6px;color:#1b3a57;font-family:Georgia,'Times New Roman',serif;font-size:21px;font-weight:400;">${escapeHtml(transferRoutes[intent.currency].label)}</h2>
    <p style="margin:0 0 20px;color:#5d6670;font-size:13px;line-height:1.6;">${escapeHtml(transferRoutes[intent.currency].description)}</p>
    ${renderTransferGroups(intent.currency)}
    <div style="margin:24px 0;padding:15px 17px;background:#d5d8bb;color:#14213d;font-size:13px;line-height:1.6;">
      Use <strong>${escapeHtml(narration)}</strong> as the transfer narration so our team can match your gift to this intent.
    </div>
    <p style="margin:0;font-size:13px;line-height:1.7;color:#5d6670;">Bank transfers can take time to arrive. MedWHOLE will confirm the donation after the funds have been received and verified.</p>`

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: intent.email,
    subject: `Your MedWHOLE transfer instructions - ${intent.reference}`,
    html: emailShell("Your transfer instructions", `Donation reference ${intent.reference}`, body),
  })

  if (error) {
    await recordPayloadEmailDelivery({ template: "donation-transfer-instructions", recordId: intent.reference, recipient: intent.email, status: "failed", error })
    throw error
  }
  await recordPayloadEmailDelivery({ template: "donation-transfer-instructions", recordId: intent.reference, recipient: intent.email, providerId: data?.id, status: "sent" })
  return { success: true as const, skipped: false as const, data }
}

export async function sendDonationAdminNotification(intent: DonationEmailIntent) {
  const resend = getResendClient()
  const recipients = (process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean)

  if (!resend || recipients.length === 0) {
    return { success: false as const, skipped: true as const }
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const amount = formatDonationAmount(intent.amount, intent.currency)
  const body = `
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;">A new bank-transfer donation intent has been recorded.</p>
    <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 24px;">
      <tr><td style="padding:8px 12px 8px 0;color:#5d6670;width:34%;">Reference</td><td style="padding:8px 0;font-weight:600;color:#14213d;">${escapeHtml(intent.reference)}</td></tr>
      <tr><td style="padding:8px 12px 8px 0;color:#5d6670;">Donor</td><td style="padding:8px 0;font-weight:600;color:#14213d;">${escapeHtml(intent.fullName)}</td></tr>
      <tr><td style="padding:8px 12px 8px 0;color:#5d6670;">Intended gift</td><td style="padding:8px 0;font-weight:600;color:#14213d;">${escapeHtml(amount)}</td></tr>
      <tr><td style="padding:8px 12px 8px 0;color:#5d6670;">Country</td><td style="padding:8px 0;color:#14213d;">${escapeHtml(intent.country)}</td></tr>
      <tr><td style="padding:8px 12px 8px 0;color:#5d6670;">Email</td><td style="padding:8px 0;color:#14213d;">${escapeHtml(intent.email || "Not provided")}</td></tr>
      <tr><td style="padding:8px 12px 8px 0;color:#5d6670;">Phone</td><td style="padding:8px 0;color:#14213d;">${escapeHtml(intent.phone || "Not provided")}</td></tr>
      <tr><td style="padding:8px 12px 8px 0;color:#5d6670;">Expected date</td><td style="padding:8px 0;color:#14213d;">${escapeHtml(intent.expectedTransferDate || "Not specified")}</td></tr>
      ${intent.designation ? `<tr><td style="padding:8px 12px 8px 0;color:#5d6670;">Specific work</td><td style="padding:8px 0;font-weight:600;color:#14213d;">${escapeHtml(intent.designation)}</td></tr>` : ""}
      ${intent.sourcePath ? `<tr><td style="padding:8px 12px 8px 0;color:#5d6670;">Source page</td><td style="padding:8px 0;color:#14213d;"><a href="${escapeHtml(`${siteUrl}${intent.sourcePath}`)}" style="color:#004f42;">${escapeHtml(intent.sourcePath)}</a></td></tr>` : ""}
    </table>
    <a href="${escapeHtml(`${siteUrl}/studio`)}" style="display:inline-block;background:#ffb800;color:#14213d;padding:12px 20px;text-decoration:none;font-size:14px;font-weight:700;">Open Sanity Studio</a>`

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: recipients,
    subject: `New donation intent: ${intent.reference} - ${amount}`,
    html: emailShell("New donation intent", `New intent from ${intent.fullName}`, body),
  })

  if (error) {
    await Promise.all(recipients.map((recipient) => recordPayloadEmailDelivery({ template: "donation-admin-notification", recordId: intent.reference, recipient, status: "failed", error })))
    throw error
  }
  await Promise.all(recipients.map((recipient) => recordPayloadEmailDelivery({ template: "donation-admin-notification", recordId: intent.reference, recipient, providerId: data?.id, status: "sent" })))
  return { success: true as const, skipped: false as const, data }
}
