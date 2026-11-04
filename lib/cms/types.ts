export type CmsCollection =
  | "pages"
  | "programmes"
  | "events"
  | "news"
  | "communities"
  | "impact-stories"
  | "team-members"
  | "partners"
  | "jobs"
  | "resources"
  | "media"
  | "testimonials"
  | "faqs"
  | "contact-submissions"
  | "volunteer-applications"
  | "partnership-applications"
  | "newsletter-subscribers"
  | "event-registrations"
  | "donation-intents"
  | "donation-payments"
  | "email-deliveries"

export type CmsDocument = {
  id: string
  [key: string]: unknown
}

export type CmsListResponse<T extends CmsDocument = CmsDocument> = {
  docs: T[]
  totalDocs?: number
  totalPages?: number
  page?: number
  limit?: number
}

export type CmsHealth = {
  configured: boolean
  reachable: boolean
  adminConfigured: boolean
  baseUrl: string | null
  checkedAt: string
  error?: string
}
