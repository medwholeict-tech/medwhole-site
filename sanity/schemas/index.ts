import { eventSchema } from './event'
import { eventRegistrationSchema } from './eventRegistration'
import { newsSchema } from './news'
import { gallerySchema } from './gallery'
import { teamSchema } from './team'
import { programSchema } from './program'
import { testimonialSchema } from './testimonial'
import { partnerSchema } from './partner'
import { resourceSchema } from './resource'
import { faqSchema } from './faq'
import { jobSchema } from './job'
import { impactStorySchema } from './impactStory'
import { donationSchema } from './donation'
import { siteSettingsSchema } from './siteSettings'
import { newsletterSchema } from './newsletter'
import { partnershipApplicationSchema } from './partnershipApplication'
import { volunteerApplicationSchema } from './volunteerApplication'
import { donationIntentSchema } from './donationIntent'
import { contactSubmissionSchema } from './contactSubmission'
import { donationPaymentSchema } from './donationPayment'
import { communitySchema } from './community'

export const schemaTypes = [
  // Core Content
  eventSchema,
  eventRegistrationSchema,
  newsSchema,
  programSchema,
  impactStorySchema,
  communitySchema,
  
  // Resources & Media
  gallerySchema,
  resourceSchema,
  
  // People & Organizations
  teamSchema,
  partnerSchema,
  testimonialSchema,
  
  // Engagement
  faqSchema,
  jobSchema,
  donationSchema,
  donationIntentSchema,
  donationPaymentSchema,
  newsletterSchema,
  contactSubmissionSchema,
  
  // Applications
  partnershipApplicationSchema,
  volunteerApplicationSchema,
  
  // Settings
  siteSettingsSchema,
]
