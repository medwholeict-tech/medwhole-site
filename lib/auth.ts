import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "@/db"
import { adminUsers } from "@/db/schema"
import { eq } from "drizzle-orm"
import { rateLimit } from "@/lib/rate-limit"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Brute-force protection: max 10 sign-in attempts per IP per 15 minutes
        const ip =
          (request as Request | undefined)?.headers
            ?.get?.("x-forwarded-for")
            ?.split(",")[0]
            ?.trim() || "unknown"
        if (!rateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) {
          return null
        }

        const user = await db.query.adminUsers.findFirst({
          where: eq(adminUsers.email, credentials.email as string),
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.email,
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID to token on sign in
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      // Add user ID to session
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdminPage = nextUrl.pathname.startsWith("/admin")
      const isOnLoginPage = nextUrl.pathname === "/admin/login"

      if (isOnAdminPage && !isOnLoginPage) {
        return isLoggedIn
      }

      return true
    },
  },
})
