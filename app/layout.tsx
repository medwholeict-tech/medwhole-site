import type React from "react"
import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { SkipToContent } from "@/components/skip-to-content"
import { OrganizationSchema } from "@/components/structured-data"
import { BrandIntro } from "@/components/brand-intro"
import { MotionController } from "@/components/motion-controller"
import { RouteTransition } from "@/components/route-transition"
import { SmoothScroll } from "@/components/smooth-scroll"
import { generateSEO } from "@/lib/seo"

const libreBaskerville = localFont({
  src: "../public/fonts/libre-baskerville.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-libre-baskerville",
  display: "swap",
})

export const metadata: Metadata = generateSEO({ url: "/" })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1b3a57",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(window.location.hostname!=="localhost"&&sessionStorage.getItem("medwhole-brand-intro-seen")==="1"){document.documentElement.dataset.brandIntroSeen="true"}}catch(e){}',
          }}
        />
        <OrganizationSchema />
      </head>
      <body className={`${libreBaskerville.variable} antialiased`}>
        <SkipToContent />
        <BrandIntro />
        <Suspense fallback={null}>
          <MotionController />
          <SmoothScroll />
          <RouteTransition />
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
