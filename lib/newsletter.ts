import { z } from "zod"

export const newsletterFormSchema = z.object({
  name: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email("Enter a valid email address").max(254),
  interests: z.array(z.string().trim().max(80)).max(12).optional().default([]),
  source: z.string().trim().max(80).optional().default("website"),
  website: z.string().max(0).optional(),
})

export type NewsletterFormInput = z.infer<typeof newsletterFormSchema>
