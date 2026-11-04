"use client"

import { useState, type FormEvent } from "react"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type NewsletterFormProps = {
  source: string
  compact?: boolean
  inverted?: boolean
}

export function NewsletterForm({ source, compact = false, inverted = false }: NewsletterFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, source, website }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "We could not add you to the newsletter")
      }

      setStatus("success")
      setMessage("You’re subscribed. Watch your inbox for MedWHOLE updates.")
      setName("")
      setEmail("")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`newsletter-name-${source}`} className={cn(inverted && "text-white")}>
            Name <span className={cn("font-normal", inverted ? "text-pale-sky" : "text-graphite")}>(optional)</span>
          </Label>
          <Input
            id={`newsletter-name-${source}`}
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={status === "loading"}
            placeholder="Your name"
            className={cn(inverted && "border-pale-sky bg-white text-graphite")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`newsletter-email-${source}`} className={cn(inverted && "text-white")}>
            Email address *
          </Label>
          <Input
            id={`newsletter-email-${source}`}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={status === "loading"}
            placeholder="you@example.com"
            className={cn(inverted && "border-pale-sky bg-white text-graphite")}
          />
        </div>
      </div>

      <div className="hidden" aria-hidden="true">
        <Label htmlFor={`newsletter-website-${source}`}>Website</Label>
        <Input
          id={`newsletter-website-${source}`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <Button type="submit" size={compact ? "default" : "lg"} variant={inverted ? "accent" : "default"} disabled={status === "loading"}>
        {status === "loading" ? <><Loader2 data-icon="inline-start" className="animate-spin" />Subscribing...</> : "Subscribe to updates"}
      </Button>

      {status === "success" ? (
        <p className={cn("flex items-start gap-2 text-sm", inverted ? "text-white" : "text-pine-teal")} role="status">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none" />
          {message}
        </p>
      ) : null}
      {status === "error" ? (
        <p className={cn("flex items-start gap-2 text-sm", inverted ? "text-white" : "text-dark-azure")} role="alert">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none" />
          {message}
        </p>
      ) : null}
    </form>
  )
}
