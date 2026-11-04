"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function PartnerApplicationForm({ community = "" }: { community?: string }) {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    type: "Programme funding",
    message: community ? `Community: ${community}. ` : "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    try {
      const response = await fetch("/api/partnership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: formData.name,
          organizationName: formData.organization,
          contactEmail: formData.email,
          contactPhone: formData.phone,
          proposedCollaboration: `Type: ${formData.type}. Message: ${formData.message}`,
        }),
      })
      if (!response.ok) throw new Error("We could not receive your application. Please try again.")
      setSubmitted(true)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {error ? (
        <p role="alert" className="border border-amber-flame bg-amber-flame/10 p-4 text-white">
          {error}
        </p>
      ) : null}
      {submitted ? (
        <div className="mt-8 rounded-[4px] border border-pine-teal bg-pine-teal/20 p-8 text-center text-white">
          <h3 className="font-heading text-2xl font-normal text-white">Thank You</h3>
          <p className="mt-3 text-sm text-pale-sky">
            Your request has been received. Thank you for getting in touch with MedWHOLE.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-[4px] border border-white/20 bg-prussian-blue p-6 sm:p-8"
        >
          <div>
            <Label htmlFor="name" className="meta-label text-pale-sky">
              Your Name *
            </Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 bg-white text-dark-azure placeholder:text-graphite/50 border-grey-azure"
            />
          </div>

          <div>
            <Label htmlFor="organization" className="meta-label text-pale-sky">
              Organization Name *
            </Label>
            <Input
              id="organization"
              required
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="mt-1 bg-white text-dark-azure placeholder:text-graphite/50 border-grey-azure"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="email" className="meta-label text-pale-sky">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 bg-white text-dark-azure placeholder:text-graphite/50 border-grey-azure"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="meta-label text-pale-sky">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 bg-white text-dark-azure placeholder:text-graphite/50 border-grey-azure"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="type" className="meta-label text-pale-sky">
              Partnership Interest
            </Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 flex h-10 w-full rounded-[4px] border border-grey-azure bg-white px-3 py-2 text-sm text-dark-azure focus:outline-none focus:ring-1 focus:ring-amber-flame"
            >
              <option value="Programme funding">Programme funding</option>
              <option value="Technical partnership">Technical partnership</option>
              <option value="Institutional">Institutional</option>
              <option value="Corporate and CSR">Corporate and CSR</option>
              <option value="Faith-based">Faith-based</option>
            </select>
          </div>

          <div>
            <Label htmlFor="message" className="meta-label text-pale-sky">
              Proposed Scope / Message
            </Label>
            <Textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="mt-1 bg-white text-dark-azure placeholder:text-graphite/50 border-grey-azure"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-[4px] bg-amber-flame py-3 meta-label text-prussian-blue hover:bg-white transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Request a conversation"}
          </Button>
        </form>
      )}
    </>
  )
}
