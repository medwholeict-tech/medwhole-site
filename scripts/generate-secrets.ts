import crypto from "crypto"

console.log("🔐 Generating secure secrets for your .env file\n")

// Generate NEXTAUTH_SECRET (32 bytes = 256 bits)
const nextAuthSecret = crypto.randomBytes(32).toString("base64")
console.log("NEXTAUTH_SECRET (copy this to your .env):")
console.log(nextAuthSecret)
console.log()

// Generate additional secrets if needed
const apiSecret = crypto.randomBytes(32).toString("hex")
console.log("Optional API_SECRET (for custom API authentication):")
console.log(apiSecret)
console.log()

// Generate example JWT payload
const examplePayload = {
  userId: crypto.randomUUID(),
  email: "admin@medwhole.org",
  role: "admin",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
}

console.log("📋 Example JWT payload structure:")
console.log(JSON.stringify(examplePayload, null, 2))
console.log()

console.log("✅ Copy the NEXTAUTH_SECRET above to your .env file")
console.log("💡 NextAuth will automatically handle JWT token generation and validation")
