import { PortableTextBlock } from 'sanity'

// Base types
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface SanityFile {
  _type: 'file'
  asset: {
    _ref: string
    _type: 'reference'
    url?: string
  }
}

export interface SanitySlug {
  _type: 'slug'
  current: string
}

export interface SanityReference {
  _ref: string
  _type: 'reference'
}

// Testimonial
export interface Testimonial {
  _id: string
  _type: 'testimonial'
  name: string
  role?: string
  organization?: string
  photo?: SanityImage
  testimonial: string
  rating?: number
  relatedProgram?: Program
  category?: 'beneficiary' | 'partner' | 'volunteer' | 'donor' | 'staff'
  featured: boolean
  publishedAt: string
  isActive: boolean
}

// Partner
export interface Partner {
  _id: string
  _type: 'partner'
  name: string
  slug: SanitySlug
  logo: SanityImage
  description?: string
  partnerType: 'strategic' | 'funding' | 'implementation' | 'academic' | 'corporate' | 'ngo' | 'government'
  website?: string
  partnershipStartDate?: string
  partnershipStatus: 'active' | 'inactive' | 'pending'
  collaborationAreas?: string[]
  contactPerson?: {
    name?: string
    email?: string
    phone?: string
    position?: string
  }
  featured: boolean
  order: number
  isActive: boolean
}

// Resource
export interface Resource {
  _id: string
  _type: 'resource'
  title: string
  slug: SanitySlug
  description: string
  resourceType: 'report' | 'research' | 'policy' | 'training' | 'guideline' | 'infographic' | 'video' | 'presentation' | 'case-study' | 'toolkit'
  category?: string[]
  thumbnail?: SanityImage
  file?: SanityFile
  externalUrl?: string
  fileSize?: string
  language: 'en' | 'fr' | 'ha' | 'yo' | 'ig'
  authors?: string[]
  publishedDate: string
  relatedProgram?: Program
  tags?: string[]
  downloadCount: number
  featured: boolean
  requiresRegistration: boolean
  isActive: boolean
}

// FAQ
export interface FAQ {
  _id: string
  _type: 'faq'
  question: string
  answer: PortableTextBlock[]
  category: 'general' | 'programs' | 'donations' | 'volunteering' | 'events' | 'partnerships'
  order: number
  isActive: boolean
}

// Job
export interface Job {
  _id: string
  _type: 'job'
  title: string
  slug: SanitySlug
  department: 'health' | 'education' | 'admin' | 'finance' | 'programs' | 'communications' | 'research'
  location: string
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'volunteer'
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive'
  summary: string
  description: PortableTextBlock[]
  responsibilities: string[]
  qualifications: string[]
  skills?: string[]
  benefits?: string[]
  salaryRange?: {
    min?: number
    max?: number
    currency: 'NGN' | 'USD' | 'GBP' | 'EUR'
    period: 'hour' | 'month' | 'year'
  }
  applicationDeadline: string
  applicationMethod: 'email' | 'external' | 'internal'
  applicationEmail?: string
  applicationUrl?: string
  contactPerson?: {
    name?: string
    email?: string
    phone?: string
  }
  postedDate: string
  status: 'open' | 'closed' | 'on-hold' | 'filled'
  featured: boolean
  isActive: boolean
}

// Impact Story
export interface ImpactStory {
  _id: string
  _type: 'impactStory'
  title: string
  slug: SanitySlug
  excerpt: string
  content: PortableTextBlock[]
  featuredImage: SanityImage
  beneficiaryName?: string
  location?: string
  relatedProgram: Program
  impactMetrics?: Array<{
    metric: string
    value: string
    description?: string
  }>
  beforeAfter?: {
    before?: string
    after?: string
    beforeImage?: SanityImage
    afterImage?: SanityImage
  }
  videoUrl?: string
  quote?: {
    text: string
    author: string
  }
  publishedAt: string
  featured: boolean
  isActive: boolean
}

// Donation Campaign
export interface DonationCampaign {
  _id: string
  _type: 'donation'
  title: string
  slug: SanitySlug
  description: string
  content?: PortableTextBlock[]
  featuredImage?: SanityImage
  campaignType: 'general' | 'program' | 'emergency' | 'monthly' | 'corporate'
  relatedProgram?: Program
  goalAmount?: number
  currentAmount: number
  currency: 'NGN' | 'USD' | 'GBP' | 'EUR'
  suggestedAmounts?: number[]
  startDate?: string
  endDate?: string
  donationUrl?: string
  impactStatements?: Array<{
    amount: number
    impact: string
  }>
  taxDeductible: boolean
  featured: boolean
  status: 'active' | 'completed' | 'paused' | 'upcoming'
  isActive: boolean
}

// Newsletter Subscriber
export interface NewsletterSubscriber {
  _id: string
  _type: 'newsletter'
  email: string
  name?: string
  subscribedAt: string
  interests?: string[]
  status: 'active' | 'unsubscribed' | 'bounced'
  source?: string
  unsubscribedAt?: string
}

// Site Settings
export interface SiteSettings {
  _type: 'siteSettings'
  siteName: string
  siteDescription?: string
  logo?: SanityImage
  favicon?: SanityImage
  contactInfo?: {
    email?: string
    phone?: string
    address?: string
  }
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  maintenanceMode?: {
    enabled: boolean
    message?: string
  }
  announcementBar?: {
    enabled: boolean
    message?: string
    link?: string
    type: 'info' | 'warning' | 'success' | 'error'
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: SanityImage
    keywords?: string[]
  }
  analytics?: {
    googleAnalyticsId?: string
    facebookPixelId?: string
  }
  donationSettings?: {
    defaultDonationUrl?: string
    showDonationButton: boolean
  }
}

// Existing types (enhanced)
export interface Event {
  _id: string
  _type: 'event'
  title: string
  slug: SanitySlug
  description?: string
  excerpt?: string
  featuredImage?: SanityImage
  content?: PortableTextBlock[]
  category?: 'Academy' | 'Health' | 'Consulting' | 'General'
  date: string
  endDate?: string
  location?: string
  venue?: string
  isFree: boolean
  price?: number
  currency?: 'NGN' | 'USD' | 'GBP' | 'EUR'
  capacity?: number
  requiresRegistration: boolean
  registrationType?: 'external' | 'custom'
  registrationUrl?: string
  registrationForm?: {
    fields: Array<{
      fieldId: string
      label: string
      fieldType: 'text' | 'textarea' | 'email' | 'phone' | 'number' | 'date' | 'select' | 'radio' | 'checkbox' | 'file'
      placeholder?: string
      options?: string[]
      required: boolean
      helpText?: string
      validation?: {
        minLength?: number
        maxLength?: number
        pattern?: string
      }
    }>
    submitButtonText?: string
    successMessage?: string
    notificationEmails?: string[]
  }
  registrationDeadline?: string
  organizer?: string
  contactEmail?: string
  contactPhone?: string
  featured: boolean
  isActive: boolean
}

export interface Program {
  _id: string
  _type: 'program'
  title: string
  slug: SanitySlug
  description: string
  content?: PortableTextBlock[]
  featuredImage?: SanityImage
  category: 'health' | 'education' | 'nutrition' | 'capacity'
  objectives?: string[]
  impact?: {
    beneficiaries?: number
    locations?: number
    yearStarted?: number
  }
  featured: boolean
  isActive: boolean
}

export interface News {
  _id: string
  _type: 'news'
  title: string
  slug: SanitySlug
  excerpt: string
  content: PortableTextBlock[]
  featuredImage?: SanityImage
  category?: 'announcement' | 'research' | 'impact-story' | 'partnership' | 'program-update'
  author?: string
  publishedAt: string
  featured: boolean
  isActive: boolean
}

export interface TeamMember {
  _id: string
  _type: 'team'
  name: string
  role: string
  bio?: string
  photo?: SanityImage
  category: 'leadership' | 'board' | 'staff' | 'advisors'
  order: number
  email?: string
  linkedin?: string
  isActive: boolean
}

export interface GalleryImage {
  _id: string
  _type: 'gallery'
  title: string
  image: SanityImage
  description?: string
  category: 'Academy' | 'Health' | 'Consulting' | 'Events' | 'Community'
  order: number
  isActive: boolean
}

export interface EventRegistration {
  _id: string
  _type: 'eventRegistration'
  event: SanityReference
  submittedAt: string
  formData: {
    data: Array<{
      fieldId: string
      label: string
      value: string
    }>
  }
  contactEmail?: string
  contactName?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  notes?: string
}
