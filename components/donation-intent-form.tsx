"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  RotateCcw,
  ShieldCheck,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  donationIntentSchema,
  donationProgrammeLabels,
  formatDonationAmount,
  getTransferNarration,
  suggestedAmounts,
  transferRoutes,
  type DonationCurrency,
  type DonationIntentInput,
} from "@/lib/donation-intent"

type SubmissionResult = {
  reference: string
  emailSent: boolean
  values: DonationIntentInput
}

export function DonationIntentForm({
  initialAmount,
  initialDesignation,
  sourcePath,
  onlineGivingEnabled = false,
  community = "",
}: {
  initialAmount?: string
  initialDesignation?: string
  sourcePath?: string
  onlineGivingEnabled?: boolean
  community?: string
}) {
  const [submission, setSubmission] = useState<SubmissionResult | null>(null)
  const [serverError, setServerError] = useState("")

  const form = useForm<DonationIntentInput>({
    resolver: zodResolver(donationIntentSchema),
    defaultValues: {
      currency: "NGN",
      frequency: "one-time",
      amount: initialAmount || "10000",
      programme: "where-needed",
      designation: initialDesignation,
      sourcePath,
      fullName: "",
      country: "Nigeria",
      email: "",
      phone: "",
      expectedTransferDate: "",
      consent: false,
      website: "",
    },
  })

  const currency = form.watch("currency")
  const amount = form.watch("amount")

  async function onSubmit(values: DonationIntentInput) {
    setServerError("")

    try {
      if (onlineGivingEnabled && values.currency === "NGN") {
        const response = await fetch("/api/payments/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName: values.fullName, email: values.email, amount: values.amount, frequency: values.frequency === "monthly" ? "monthly" : "one-off", designation: values.designation || donationProgrammeLabels[values.programme], community, website: values.website }),
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "We could not start your payment")
        const checkout = new URL(result.url)
        if (checkout.protocol !== "https:" || checkout.hostname !== "checkout.paystack.com") throw new Error("We could not open checkout")
        window.location.assign(checkout.href)
        return
      }
      const response = await fetch("/api/donation-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const result = await response.json()

      if (!response.ok) {
        if (result.fields) {
          Object.entries(result.fields).forEach(([field, messages]) => {
            const message = Array.isArray(messages) ? messages[0] : undefined
            if (message) form.setError(field as keyof DonationIntentInput, { message: String(message) })
          })
        }
        throw new Error(result.error || "We could not record your donation intent")
      }

      setSubmission({
        reference: result.reference,
        emailSent: Boolean(result.emailSent),
        values,
      })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Please try again")
    }
  }

  function startAnotherIntent() {
    setSubmission(null)
    setServerError("")
    form.reset()
  }

  if (submission) {
    return <TransferInstructions submission={submission} onReset={startAnotherIntent} />
  }

  return (
    <div className="overflow-hidden rounded-[4px] border border-grey-azure bg-white shadow-none">
      <div className="border-b border-grey-azure/50 px-5 py-6 sm:px-8">
        <p className="text-sm font-semibold text-pine-teal">{onlineGivingEnabled && currency === "NGN" ? "Give with Paystack" : "Donation intent"}</p>
        <h2 className="font-heading text-2xl text-dark-azure sm:text-3xl">{onlineGivingEnabled && currency === "NGN" ? "Prepare your gift" : "Prepare your transfer"}</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-graphite">
          {onlineGivingEnabled && currency === "NGN" ? "Choose your gift details, then continue to secure Paystack checkout." : "Tell us about the gift you intend to make. We will record it for follow-up, then show the correct bank instructions."}
        </p>
        {initialDesignation ? (
          <div className="mt-5 border-l-4 border-amber-flame bg-parchment px-4 py-3">
            <p className="meta-label text-pine-teal">Supporting this work</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-dark-azure">{initialDesignation}</p>
          </div>
        ) : null}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-0" noValidate>
          <section className="flex flex-col gap-6 px-5 py-7 sm:px-8" aria-labelledby="gift-details-heading">
            <SectionHeading number="1" title="Gift details" id="gift-details-heading" />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transfer currency</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={(value) => {
                        if (!value) return
                        const nextCurrency = value as DonationCurrency
                        field.onChange(nextCurrency)
                        form.setValue("amount", suggestedAmounts[nextCurrency][1], { shouldValidate: true })
                      }}
                      variant="outline"
                      className="grid w-full grid-cols-3"
                    >
                      <ToggleGroupItem value="NGN" aria-label="Nigerian naira">NGN</ToggleGroupItem>
                      <ToggleGroupItem value="USD" aria-label="US dollar">USD</ToggleGroupItem>
                      <ToggleGroupItem value="GBP" aria-label="British pound">GBP</ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormDescription>{transferRoutes[currency].description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intended amount</FormLabel>
                  <ToggleGroup
                    type="single"
                    value={suggestedAmounts[currency].includes(field.value) ? field.value : ""}
                    onValueChange={(value) => value && field.onChange(value)}
                    variant="outline"
                    className="grid w-full grid-cols-2 sm:grid-cols-4"
                  >
                    {suggestedAmounts[currency].map((suggested) => (
                      <ToggleGroupItem key={suggested} value={suggested}>
                        {formatDonationAmount(suggested, currency)}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                  <FormControl>
                    <Input {...field} inputMode="decimal" autoComplete="off" aria-label={`Custom amount in ${currency}`} />
                  </FormControl>
                  <FormDescription>Enter another amount at any time.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <FormControl>
                      <ToggleGroup type="single" value={field.value} onValueChange={(value) => value && field.onChange(value)} variant="outline" className="grid w-full grid-cols-2">
                        <ToggleGroupItem value="one-time">One-time</ToggleGroupItem>
                        <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="programme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred use</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a programme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {Object.entries(donationProgrammeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <Separator />

          <section className="flex flex-col gap-6 px-5 py-7 sm:px-8" aria-labelledby="contact-details-heading">
            <SectionHeading number="2" title="Contact details" id="contact-details-heading" />
            <p className="-mt-3 text-sm leading-6 text-muted-foreground">Email is optional, but please provide either an email address or phone number so our team can follow up.</p>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl><Input {...field} autoComplete="name" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl><Input {...field} autoComplete="country-name" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address <span className="font-normal text-muted-foreground">(optional)</span></FormLabel>
                    <FormControl><Input {...field} type="email" autoComplete="email" /></FormControl>
                    <FormDescription>We will email the instructions if provided.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone / WhatsApp <span className="font-normal text-muted-foreground">(optional)</span></FormLabel>
                    <FormControl><Input {...field} type="tel" autoComplete="tel" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expectedTransferDate"
              render={({ field }) => (
                <FormItem className="sm:max-w-[calc(50%-0.625rem)]">
                  <FormLabel>Expected transfer date <span className="font-normal text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl><Input {...field} type="date" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 rounded-[4px] border border-grey-azure/50 bg-parchment p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="flex flex-col gap-1">
                    <FormLabel className="leading-6">I consent to MedWHOLE storing these details and contacting me about this donation intent.</FormLabel>
                    <FormDescription>We will not add you to marketing lists automatically. Read our <Link href="/privacy" className="font-semibold text-pine-teal underline-offset-4 hover:underline">Privacy Policy</Link>.</FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="hidden" aria-hidden="true">
                  <FormLabel>Website</FormLabel>
                  <FormControl><Input {...field} tabIndex={-1} autoComplete="off" /></FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => <input type="hidden" name={field.name} value={field.value || ""} ref={field.ref} />}
            />
            <FormField
              control={form.control}
              name="sourcePath"
              render={({ field }) => <input type="hidden" name={field.name} value={field.value || ""} ref={field.ref} />}
            />
          </section>

          <div className="border-t border-grey-azure/50 bg-parchment px-5 py-6 sm:px-8">
            {serverError ? (
              <Alert variant="destructive" className="mb-5">
                <AlertTitle>We could not continue</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-dark-azure">{formatDonationAmount(amount || 0, currency)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{onlineGivingEnabled && currency === "NGN" ? "Payment is completed securely through Paystack." : "Intent only — no payment is taken on this website."}</p>
              </div>
              <Button type="submit" variant="accent" size="xl" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <ShieldCheck data-icon="inline-start" />}
                {form.formState.isSubmitting ? "Preparing..." : onlineGivingEnabled && currency === "NGN" ? "Continue to Paystack" : "Create transfer instructions"}
                {!form.formState.isSubmitting ? <ArrowRight data-icon="inline-end" /> : null}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

function SectionHeading({ number, title, id }: { number: string; title: string; id: string }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-dark-azure text-sm font-bold text-white">{number}</span>
      <h3 id={id} className="font-heading text-xl text-dark-azure">{title}</h3>
    </div>
  )
}

function TransferInstructions({ submission, onReset }: { submission: SubmissionResult; onReset: () => void }) {
  const { values, reference, emailSent } = submission
  const [copied, setCopied] = useState("")
  const route = transferRoutes[values.currency]
  const narration = getTransferNarration(reference)

  async function copyValue(label: string, value: string) {
    await navigator.clipboard.writeText(value)
    setCopied(label)
    window.setTimeout(() => setCopied(""), 1800)
  }

  async function copyAll() {
    const details = route.groups.flatMap((group) => [
      group.title,
      ...group.details.map((detail) => `${detail.label}: ${detail.value}`),
      "",
    ])
    await copyValue("all", [
      `MedWHOLE donation reference: ${reference}`,
      `Intended gift: ${formatDonationAmount(values.amount, values.currency)}`,
      "",
      ...details,
      `Transfer narration: ${narration}`,
    ].join("\n"))
  }

  return (
    <div className="overflow-hidden rounded-[4px] border border-grey-azure bg-white shadow-none" aria-live="polite">
      <div className="bg-dark-azure px-5 py-7 text-white sm:px-8">
        <CheckCircle2 className="size-8 text-amber-flame" aria-hidden="true" />
        <h2 className="font-heading text-2xl sm:text-3xl">Your transfer instructions are ready.</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-pale-sky">Your intent has been recorded. No payment has been completed yet.</p>
      </div>

      <div className="flex flex-col gap-7 px-5 py-7 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[4px] bg-parchment p-4">
            <p className="meta-label text-pine-teal">Reference</p>
            <p className="font-heading text-xl text-dark-azure">{reference}</p>
          </div>
          <div className="rounded-[4px] bg-parchment p-4">
            <p className="meta-label text-pine-teal">Intended gift</p>
            <p className="font-heading text-xl text-dark-azure">{formatDonationAmount(values.amount, values.currency)}</p>
          </div>
        </div>

        {values.designation ? (
          <div className="border-l-4 border-amber-flame bg-parchment px-4 py-3">
            <p className="meta-label text-pine-teal">Gift designation</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-dark-azure">{values.designation}</p>
          </div>
        ) : null}

        {values.email ? (
          <Alert>
            <Mail aria-hidden="true" />
            <AlertTitle>{emailSent ? "Instructions emailed" : "Use the instructions below"}</AlertTitle>
            <AlertDescription>
              {emailSent ? `A copy was sent to ${values.email}.` : "We recorded your email, but could not send a copy. The complete instructions remain available below."}
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-heading text-2xl text-dark-azure">{route.label}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{route.description}</p>
          </div>
          <Button type="button" variant="outline" onClick={copyAll}>
            <Copy data-icon="inline-start" />
            {copied === "all" ? "Copied" : "Copy all"}
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          {route.groups.map((group) => (
            <section key={group.title} aria-labelledby={`transfer-${group.title.replaceAll(" ", "-").toLowerCase()}`}>
              <h4 id={`transfer-${group.title.replaceAll(" ", "-").toLowerCase()}`} className="border-b border-grey-azure/50 pb-2 text-sm font-semibold text-dark-azure">{group.title}</h4>
              <dl>
                {group.details.map((detail) => {
                  const copyKey = `${group.title}-${detail.label}`
                  return (
                    <div key={detail.label} className="grid gap-2 border-b border-grey-azure/50 py-3 last:border-b-0 sm:grid-cols-[0.34fr_0.66fr]">
                      <dt className="text-sm text-muted-foreground">{detail.label}</dt>
                      <dd className="flex items-start justify-between gap-3 text-sm font-semibold leading-6 text-prussian-blue">
                        <span className="break-words">{detail.value}</span>
                        <Button type="button" variant="ghost" size="icon" aria-label={`Copy ${detail.label}`} onClick={() => copyValue(copyKey, detail.value)}>
                          {copied === copyKey ? <CheckCircle2 /> : <Copy />}
                        </Button>
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </section>
          ))}
        </div>

        <Alert>
          <ShieldCheck aria-hidden="true" />
          <AlertTitle>Use this transfer narration</AlertTitle>
          <AlertDescription>
            <button type="button" className="font-semibold text-dark-azure underline-offset-4 hover:underline" onClick={() => copyValue("narration", narration)}>
              {narration}
            </button>
            {copied === "narration" ? " — copied" : ""}. This helps our team match your transfer to the recorded intent.
          </AlertDescription>
        </Alert>

        <p className="text-sm leading-7 text-muted-foreground">Bank transfers can take time to arrive. MedWHOLE will confirm the donation after the funds have been received and verified.</p>

        <div className="flex flex-col gap-3 border-t border-grey-azure/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="outline" onClick={onReset}>
            <RotateCcw data-icon="inline-start" />
            Start another intent
          </Button>
          <Link href="/contact?interest=donations" className="text-sm font-semibold text-pine-teal underline-offset-4 hover:underline">Need help with the transfer?</Link>
        </div>
      </div>
    </div>
  )
}
