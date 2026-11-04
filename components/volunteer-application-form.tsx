"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const whereNeeded = [
  {
    role: "Teach",
    details: "Summer School runs six class bands at once in Gosa and five in Kunyami, Monday to Thursday mornings through August",
  },
  {
    role: "Clinical",
    details: "Outreaches need consultation, laboratory, nursing, eye care and pharmacy",
  },
  {
    role: "Mentor",
    details: "ComPart and the Community Innovation Challenge need facilitators across several weeks",
  },
  {
    role: "Media",
    details: "Photography and video, with consent discipline",
  },
  {
    role: "Logistics and operations",
    details: "Registration, triage flow and materials",
  },
]

export function VolunteerApplicationForm({ community = "" }: { community?: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: community,
    interests: [] as string[],
    frequency: "Saturdays only",
    duration: "One term (3 months)",
    reasons: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const toggleInterest = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(role)
        ? prev.interests.filter((i) => i !== role)
        : [...prev.interests, role],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    try {
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.location,
          areasOfInterest: formData.interests,
          frequency: formData.frequency,
          duration: formData.duration,
          motivation: formData.reasons,
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

  return (<>
    {error ? <p role="alert" className="border border-amber-flame p-4 text-dark-azure">{error}</p> : null}
      {submitted ? (
        <div className="mt-8 rounded-[4px] border border-pine-teal bg-white p-8 text-center">
          <h3 className="font-heading text-2xl font-normal text-pine-teal">Application Submitted</h3>
          <p className="mt-3 text-sm text-graphite">
            Thank you for applying to volunteer with MedWHOLE Alliance.
          </p>
        </div>
      ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-[4px] border border-grey-azure/50 bg-white p-6 sm:p-8">
                <div>
                  <Label htmlFor="name" className="meta-label text-dark-azure">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email" className="meta-label text-dark-azure">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="meta-label text-dark-azure">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="meta-label text-dark-azure">Location / Community (in or near FCT Abuja) *</Label>
                  <Input
                    id="location"
                    required
                    placeholder="e.g. Airport Road corridor, Gosa, Lugbe, Garki"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="meta-label text-dark-azure">Role Areas of Interest *</Label>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {whereNeeded.map((item) => {
                      const checked = formData.interests.includes(item.role)
                      return (
                        <button
                          key={item.role}
                          type="button"
                          aria-pressed={checked}
                          onClick={() => toggleInterest(item.role)}
                          className={`flex items-center gap-2 rounded-[4px] border px-3 py-2 text-left text-xs font-medium transition-colors ${
                            checked
                              ? "border-pine-teal bg-pine-teal text-white"
                              : "border-grey-azure/50 bg-parchment text-dark-azure hover:bg-parchment"
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full ${checked ? "bg-white" : "bg-grey-azure"}`} />
                          {item.role}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="frequency" className="meta-label text-dark-azure">Availability Frequency</Label>
                    <select
                      id="frequency"
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="mt-1 flex h-10 w-full rounded-[4px] border border-grey-azure/50 bg-white px-3 py-2 text-sm text-graphite focus:outline-none focus:ring-1 focus:ring-pine-teal"
                    >
                      <option value="Saturdays only">Saturdays only</option>
                      <option value="Weekdays (Monday–Thursday mornings)">Weekdays (Monday–Thursday mornings)</option>
                      <option value="Event days / Outreaches only">Event days / Outreaches only</option>
                      <option value="Flexible / As needed">Flexible / As needed</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="duration" className="meta-label text-dark-azure">Committed Duration</Label>
                    <select
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="mt-1 flex h-10 w-full rounded-[4px] border border-grey-azure/50 bg-white px-3 py-2 text-sm text-graphite focus:outline-none focus:ring-1 focus:ring-pine-teal"
                    >
                      <option value="One month (Summer School)">One month (Summer School August)</option>
                      <option value="One term (3 months)">One term (3 months)</option>
                      <option value="Full academic year">Full academic year</option>
                      <option value="Ongoing / Permanent">Ongoing / Permanent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="reasons" className="meta-label text-dark-azure">Your Reasons for Applying *</Label>
                  <Textarea
                    id="reasons"
                    required
                    rows={4}
                    placeholder="Tell us about your background, skills, and why you want to volunteer with MedWHOLE."
                    value={formData.reasons}
                    onChange={(e) => setFormData({ ...formData, reasons: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-[4px] bg-amber-flame py-3 meta-label text-prussian-blue hover:bg-dark-azure hover:text-white transition-colors"
                >
                  {isSubmitting ? "Submitting..." : "Apply to volunteer"}
                </Button>
              </form>
            )}
  </>)
}
