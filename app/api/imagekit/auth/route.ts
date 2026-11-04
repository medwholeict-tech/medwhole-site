import { NextResponse } from "next/server"
import ImageKit from "imagekit"
import { auth } from "@/lib/auth"

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
})

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Only signed-in admins may obtain upload credentials. An unauthenticated
    // caller could otherwise upload arbitrary media at our expense.
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const authenticationParameters = imagekit.getAuthenticationParameters()
    return NextResponse.json(authenticationParameters)
  } catch (error) {
    console.error("ImageKit auth error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}
