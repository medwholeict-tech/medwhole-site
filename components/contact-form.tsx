"use client"

import type React from "react"
import { useState } from "react"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const interests = ["Giving", "Volunteering", "Partnership", "Media", "A safeguarding concern", "Other"]

export function ContactForm({ community = "" }: { community?: string }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interest: "",
    message: community ? `Community: ${community}. ` : "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          subject: formData.interest,
          message: formData.message,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      setSubmitStatus("success")
      setFormData({ firstName: "", lastName: "", email: "", phone: "", interest: "", message: "" })
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="first-name">First name *</Label>
              <Input id="first-name" required value={formData.firstName} onChange={(event) => setFormData({ ...formData, firstName: event.target.value })} disabled={isSubmitting} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="last-name">Last name *</Label>
              <Input id="last-name" required value={formData.lastName} onChange={(event) => setFormData({ ...formData, lastName: event.target.value })} disabled={isSubmitting} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email address *</Label>
            <Input id="email" type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} disabled={isSubmitting} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Telephone number</Label>
            <Input id="phone" type="tel" autoComplete="tel" maxLength={30} value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} disabled={isSubmitting} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="interest">Subject *</Label>
            <select
              id="interest"
              required
              value={formData.interest}
              onChange={(event) => setFormData({ ...formData, interest: event.target.value })}
              disabled={isSubmitting}
              className="flex min-h-11 w-full rounded-[4px] border border-grey-azure bg-white px-3 py-2 text-sm text-graphite shadow-none transition-[color,box-shadow] focus:border-pine-teal focus:outline-none focus-visible:ring-[3px] focus-visible:ring-dark-azure/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select an area</option>
              {interests.map((interest) => <option key={interest} value={interest}>{interest}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea id="message" required value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder="Tell us about your interest in MedWHOLE's work..." rows={6} disabled={isSubmitting} />
          </div>

          {submitStatus === "success" ? (
            <div className="flex items-center gap-2 bg-pale-sky/30 p-4 text-sm text-dark-azure" role="status">
              <CheckCircle aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
              <span>Thank you for your message. We&apos;ll get back to you soon.</span>
            </div>
          ) : null}

          {submitStatus === "error" ? (
            <div className="flex items-center gap-2 border border-amber-flame bg-parchment p-4 text-sm text-dark-azure" role="alert">
              <AlertCircle aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
              <span>{errorMessage || "Something went wrong. Please try again."}</span>
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 data-icon="inline-start" className="animate-spin" />Sending...</> : "Send message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
