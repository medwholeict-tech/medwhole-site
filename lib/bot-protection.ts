import crypto from "crypto"

// Secret key for signing anti-bot tokens.
// REQUIREMENT: set NEXTAUTH_SECRET in the environment. No hardcoded fallback is
// allowed - a public fallback would let anyone forge anti-bot tokens.
const SECRET = process.env.NEXTAUTH_SECRET || process.env.ANTI_BOT_SECRET || ""

/**
 * Whether anti-bot signing is configured. Routes should skip verification
 * gracefully when this is false instead of crashing.
 */
export const antiBotConfigured = SECRET.length > 0

export interface BotCheckResult {
  isBot: boolean
  reason?: string
}

/**
 * Generates a signed anti-bot token containing the current timestamp.
 */
export function generateAntiBotToken(action = "form_submit"): string {
  if (!antiBotConfigured) {
    throw new Error(
      "Anti-bot token signing is not configured. Set NEXTAUTH_SECRET in the environment."
    )
  }

  const timestamp = Date.now()
  const payload = `${action}:${timestamp}`
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex")
    .slice(0, 16)

  return `${timestamp}.${signature}`
}

/**
 * Verifies an anti-bot token.
 * Requires:
 * 1. Valid HMAC signature
 * 2. Minimum submission duration (default 2500ms) to ensure human interaction
 * 3. Maximum token age (default 24 hours) to prevent replay attacks
 */
export function verifyAntiBotToken(
  token: string | undefined | null,
  action = "form_submit",
  minDurationMs = 2500,
  maxAgeMs = 24 * 60 * 60 * 1000
): BotCheckResult {
  if (!antiBotConfigured) {
    // Without a secret we cannot verify anything; treat as unverifiable.
    return { isBot: true, reason: "Anti-bot verification is not configured" }
  }

  if (!token || typeof token !== "string") {
    return { isBot: true, reason: "Missing or invalid anti-bot token" }
  }

  const [timestampStr, signature] = token.split(".")
  if (!timestampStr || !signature) {
    return { isBot: true, reason: "Malformed anti-bot token" }
  }

  const timestamp = parseInt(timestampStr, 10)
  if (isNaN(timestamp)) {
    return { isBot: true, reason: "Invalid timestamp in token" }
  }

  // Verify HMAC signature
  const expectedPayload = `${action}:${timestamp}`
  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(expectedPayload)
    .digest("hex")
    .slice(0, 16)

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return { isBot: true, reason: "Invalid anti-bot token signature" }
  }

  const now = Date.now()
  const timeElapsed = now - timestamp

  // If submitted too fast (under 2.5 seconds), it's automated
  if (timeElapsed < minDurationMs) {
    return {
      isBot: true,
      reason: `Submitted too fast (${timeElapsed}ms < ${minDurationMs}ms)`,
    }
  }

  // If token is older than 24 hours
  if (timeElapsed > maxAgeMs) {
    return { isBot: true, reason: "Token expired" }
  }

  return { isBot: false }
}

/**
 * Checks for common honeypot fields.
 * If any of these fields have a value, the submission is from a bot.
 */
export function isHoneypotTriggered(
  fields: Record<string, any>
): boolean {
  const honeypotKeys = [
    "website",
    "website_trap",
    "company_fax",
    "hp_website",
    "hp_title",
    "business_url",
  ]

  for (const key of honeypotKeys) {
    if (fields[key] && typeof fields[key] === "string" && fields[key].trim().length > 0) {
      return true
    }
  }

  return false
}

/**
 * Checks text and email inputs for spam patterns.
 */
export function isSpamPattern(
  contactName?: string,
  contactEmail?: string,
  textFields: string[] = []
): BotCheckResult {
  // Check for URLs or suspicious characters in name field
  if (contactName) {
    const urlPattern = /(https?:\/\/|www\.|\.ru\b|\.top\b|\.xyz\b|\.cn\b|t\.me\/|bit\.ly\/)/i
    if (urlPattern.test(contactName)) {
      return { isBot: true, reason: "URL or spam domain detected in name field" }
    }

    // Pure punctuation or spam length
    if (contactName.length > 80) {
      return { isBot: true, reason: "Excessive name length" }
    }
  }

  // Check email
  if (contactEmail) {
    const suspiciousEmailDomains = [
      /\.ru$/i,
      /\.top$/i,
      /\.xyz$/i,
      /\.online$/i,
      /\.buzz$/i,
      /\.bond$/i,
      /mailinator\.com$/i,
      /tempmail\.com$/i,
      /guerrillamail\.com$/i,
      /10minutemail\.com$/i,
    ]

    for (const domainRegex of suspiciousEmailDomains) {
      if (domainRegex.test(contactEmail)) {
        return { isBot: true, reason: `Suspicious email domain: ${contactEmail}` }
      }
    }
  }

  // Check text content for common spam injection strings
  const spamKeywords = [
    /crypto\s*investment/i,
    /casino\s*online/i,
    /seo\s*services/i,
    /telegram\s*channel/i,
    /adult\s*dating/i,
    /erotic/i,
    /viagra/i,
  ]

  for (const text of textFields) {
    if (text) {
      for (const pattern of spamKeywords) {
        if (pattern.test(text)) {
          return { isBot: true, reason: `Spam keyword match: ${pattern}` }
        }
      }
    }
  }

  return { isBot: false }
}
