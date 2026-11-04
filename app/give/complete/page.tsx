import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { settlePaystackPayment } from "@/lib/paystack"

export const dynamic = "force-dynamic"
export const metadata = { title: "Donation confirmation", robots: { index: false, follow: false } }
export default async function DonationCompletePage(props: { searchParams: Promise<{ reference?: string }> }) {
  const searchParams = await props.searchParams;
  let paid = false
  if (searchParams.reference) {
    try { paid = (await settlePaystackPayment(searchParams.reference)).status === "paid" } catch { /* Never infer payment from the callback URL. */ }
  }
  return (
    <div>
      <SiteHeader />
      <main id="main-content" className="inner-page flex-1">
        <div className="page-container page-container--reading py-16 sm:py-20 lg:py-24">
          <h1 className="font-heading text-4xl text-dark-azure">{paid ? "Thank you for your gift" : "Payment confirmation"}</h1>
          <p className="mt-6 text-lg leading-8">{paid ? "Your payment has been confirmed. Your gift goes to the programme you designated." : "We have not confirmed a payment yet. If you have been debited, please contact info@medwhole.org with your payment reference before trying again."}</p>
          <Link href="/impact" className="mt-8 inline-block font-semibold text-pine-teal underline">See what the money did</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
