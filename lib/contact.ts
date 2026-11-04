import { z } from "zod"

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(254),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().min(2, "Select an area of interest").max(100),
  message: z.string().trim().min(10, "Enter a little more detail").max(5000),
  website: z.string().max(0).optional(),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>
