import { client } from './sanity'
import { groq } from 'next-sanity'

function clampLimit(limit: number, defaultLimit: number) {
  if (!Number.isFinite(limit)) return defaultLimit
  return Math.max(1, Math.min(Math.trunc(limit), 50))
}

export async function getUpcomingEvents(category?: string, limit: number = 10) {
  const safeLimit = clampLimit(limit, 10)
  const categoryFilter = category ? `&& category == $category` : ''
  const now = new Date().toISOString()

  const query = groq`*[_type == "event" && isActive == true && (
    status == "ongoing" ||
    status == "upcoming" ||
    (!defined(status) && coalesce(endDate, date) >= $now)
  ) ${categoryFilter}] | order(date asc) [0...$safeLimit] {
    _id,
    title,
    slug,
    description,
    excerpt,
    featuredImage,
    category,
    date,
    endDate,
    status,
    schedule,
    showTime,
    location,
    venue,
    isFree,
    price,
    currency,
    capacity,
    requiresRegistration,
    registrationUrl,
    registrationDeadline,
    organizer,
    contactEmail,
    contactPhone,
    featured
  }`

  return client.fetch(query, { now, safeLimit, ...(category ? { category } : {}) })
}

export async function getPastEvents(category?: string, limit: number = 10) {
  const safeLimit = clampLimit(limit, 10)
  const categoryFilter = category ? `&& category == $category` : ''
  const now = new Date().toISOString()

  const query = groq`*[_type == "event" && isActive == true && (
    status == "completed" ||
    (!defined(status) && coalesce(endDate, date) < $now)
  ) ${categoryFilter}] | order(date desc) [0...$safeLimit] {
    _id,
    title,
    slug,
    description,
    excerpt,
    featuredImage,
    category,
    date,
    endDate,
    status,
    schedule,
    showTime,
    location,
    venue,
    featured
  }`

  return client.fetch(query, { now, safeLimit, ...(category ? { category } : {}) })
}

// Keep for backward compatibility
export async function getEvents(category?: string, limit: number = 10) {
  return getUpcomingEvents(category, limit)
}

export async function getEventBySlug(slug: string) {
  const query = groq`*[_type == "event" && slug.current == $slug && isActive != false][0] {
    _id,
    _updatedAt,
    title,
    slug,
    description,
    excerpt,
    content,
    featuredImage,
    storyMoments[] {
      _key,
      title,
      caption,
      image
    },
    impactFigures[] {
      _key,
      value,
      label
    },
    communityContext,
    whyItMatters,
    participation {
      description,
      steps
    },
    closingReflection,
    category,
    date,
    endDate,
    status,
    schedule,
    showTime,
    location,
    venue,
    isFree,
    price,
    currency,
    capacity,
    requiresRegistration,
    registrationType,
    registrationUrl,
    registrationForm {
      fields[] {
        fieldId,
        label,
        fieldType,
        placeholder,
        options,
        required,
        helpText,
        validation
      },
      submitButtonText,
      successMessage,
      notificationEmails
    },
    registrationDeadline,
    organizer,
    contactEmail,
    contactPhone,
    featured
  }`

  return client.fetch(query, { slug })
}

export async function getNews(category?: string, limit: number = 10) {
  const safeLimit = clampLimit(limit, 10)
  const categoryFilter = category ? `&& category == $category` : ''

  const query = groq`*[_type == "news" && isActive == true ${categoryFilter}] | order(publishedAt desc) [0...$safeLimit] {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    category,
    author,
    publishedAt,
    featured
  }`

  return client.fetch(query, { safeLimit, ...(category ? { category } : {}) })
}

export async function getNewsBySlug(slug: string) {
  const query = groq`*[_type == "news" && slug.current == $slug && isActive != false][0] {
    _id,
    _updatedAt,
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    category,
    author,
    publishedAt,
    featured
  }`

  return client.fetch(query, { slug })
}

export async function getGalleryImages(category?: string, limit: number = 20) {
  const safeLimit = clampLimit(limit, 20)
  const categoryFilter = category ? `&& category == $category` : ''

  const query = groq`*[_type == "gallery" && isActive == true ${categoryFilter}] | order(order asc, _createdAt desc) [0...$safeLimit] {
    _id,
    title,
    image,
    description,
    category,
    order
  }`

  return client.fetch(query, { safeLimit, ...(category ? { category } : {}) })
}

export async function getTeamMembers(category?: string) {
  const categoryFilter = category ? `&& category == $category` : ''

  const query = groq`*[_type == "team" && isActive == true ${categoryFilter}] | order(order asc, name asc) {
    _id,
    name,
    role,
    bio,
    photo,
    category,
    email,
    linkedin,
    order
  }`

  return client.fetch(query, category ? { category } : {})
}

export async function getPrograms(category?: string) {
  const categoryFilter = category ? `&& category == $category` : ''

  const query = groq`*[_type == "program" && isActive == true ${categoryFilter}] | order(featured desc, _createdAt desc) {
    _id,
    title,
    slug,
    description,
    featuredImage,
    category,
    objectives,
    impact,
    featured
  }`

  return client.fetch(query, category ? { category } : {})
}

export async function getProgramBySlug(slug: string) {
  const query = groq`*[_type == "program" && slug.current == $slug && isActive != false][0] {
    _id,
    _updatedAt,
    title,
    slug,
    description,
    content,
    featuredImage,
    category,
    objectives,
    impact,
    featured
  }`

  return client.fetch(query, { slug })
}

export async function getSitemapEntries() {
  const query = groq`*[
    _type in ["event", "news", "program"] &&
    isActive != false &&
    defined(slug.current)
  ] | order(_updatedAt desc) {
    _type,
    "slug": slug.current,
    _updatedAt
  }`

  return client.fetch(query)
}

// Testimonials
export async function getTestimonials(category?: string, limit: number = 10) {
  const safeLimit = clampLimit(limit, 10)
  const categoryFilter = category ? `&& category == $category` : ''

  const query = groq`*[_type == "testimonial" && isActive == true ${categoryFilter}] | order(featured desc, publishedAt desc) [0...$safeLimit] {
    _id,
    name,
    role,
    organization,
    photo,
    testimonial,
    rating,
    relatedProgram->{
      _id,
      title,
      slug
    },
    category,
    featured,
    publishedAt
  }`

  return client.fetch(query, { safeLimit, ...(category ? { category } : {}) })
}

// Partners
export async function getPartners(partnerType?: string) {
  const typeFilter = partnerType ? `&& partnerType == $partnerType` : ''

  const query = groq`*[_type == "partner" && isActive == true ${typeFilter}] | order(featured desc, order asc, name asc) {
    _id,
    name,
    slug,
    logo,
    description,
    partnerType,
    website,
    partnershipStartDate,
    partnershipStatus,
    collaborationAreas,
    featured,
    order
  }`

  return client.fetch(query, partnerType ? { partnerType } : {})
}

export async function getPartnerBySlug(slug: string) {
  const query = groq`*[_type == "partner" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    logo,
    description,
    partnerType,
    website,
    partnershipStartDate,
    partnershipStatus,
    collaborationAreas,
    contactPerson,
    featured
  }`

  return client.fetch(query, { slug })
}

// Resources
export async function getResources(resourceType?: string, category?: string, limit: number = 20) {
  const safeLimit = clampLimit(limit, 20)
  const typeFilter = resourceType ? `&& resourceType == $resourceType` : ''
  const categoryFilter = category ? `&& $category in category` : ''

  const query = groq`*[_type == "resource" && isActive == true ${typeFilter} ${categoryFilter}] | order(featured desc, publishedDate desc) [0...$safeLimit] {
    _id,
    title,
    slug,
    description,
    resourceType,
    category,
    thumbnail,
    file,
    externalUrl,
    fileSize,
    language,
    authors,
    publishedDate,
    relatedProgram->{
      _id,
      title,
      slug
    },
    tags,
    downloadCount,
    featured,
    requiresRegistration
  }`

  return client.fetch(query, { 
    safeLimit, 
    ...(resourceType ? { resourceType } : {}),
    ...(category ? { category } : {})
  })
}

export async function getResourceBySlug(slug: string) {
  const query = groq`*[_type == "resource" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    resourceType,
    category,
    thumbnail,
    file,
    externalUrl,
    fileSize,
    language,
    authors,
    publishedDate,
    relatedProgram->{
      _id,
      title,
      slug,
      description
    },
    tags,
    downloadCount,
    featured,
    requiresRegistration
  }`

  return client.fetch(query, { slug })
}

// FAQs
export async function getFAQs(category?: string) {
  const categoryFilter = category ? `&& category == $category` : ''

  const query = groq`*[_type == "faq" && isActive == true ${categoryFilter}] | order(order asc, _createdAt asc) {
    _id,
    question,
    answer,
    category,
    order
  }`

  return client.fetch(query, category ? { category } : {})
}

// Jobs
export async function getJobs(department?: string, employmentType?: string, limit: number = 20) {
  const safeLimit = clampLimit(limit, 20)
  const departmentFilter = department ? `&& department == $department` : ''
  const typeFilter = employmentType ? `&& employmentType == $employmentType` : ''

  const query = groq`*[_type == "job" && isActive == true && status == "open" ${departmentFilter} ${typeFilter}] | order(featured desc, postedDate desc) [0...$safeLimit] {
    _id,
    title,
    slug,
    department,
    location,
    employmentType,
    experienceLevel,
    summary,
    salaryRange,
    applicationDeadline,
    applicationMethod,
    postedDate,
    status,
    featured
  }`

  return client.fetch(query, { 
    safeLimit,
    ...(department ? { department } : {}),
    ...(employmentType ? { employmentType } : {})
  })
}

export async function getJobBySlug(slug: string) {
  const query = groq`*[_type == "job" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    department,
    location,
    employmentType,
    experienceLevel,
    summary,
    description,
    responsibilities,
    qualifications,
    skills,
    benefits,
    salaryRange,
    applicationDeadline,
    applicationMethod,
    applicationEmail,
    applicationUrl,
    contactPerson,
    postedDate,
    status,
    featured
  }`

  return client.fetch(query, { slug })
}

// Impact Stories
export async function getImpactStories(programId?: string, limit: number = 10) {
  const safeLimit = clampLimit(limit, 10)
  const programFilter = programId ? `&& relatedProgram._ref == $programId` : ''

  const query = groq`*[_type == "impactStory" && isActive == true ${programFilter}] | order(featured desc, publishedAt desc) [0...$safeLimit] {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    beneficiaryName,
    location,
    relatedProgram->{
      _id,
      title,
      slug
    },
    impactMetrics,
    quote,
    publishedAt,
    featured
  }`

  return client.fetch(query, { safeLimit, ...(programId ? { programId } : {}) })
}

export async function getImpactStoryBySlug(slug: string) {
  const query = groq`*[_type == "impactStory" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    beneficiaryName,
    location,
    relatedProgram->{
      _id,
      title,
      slug,
      description
    },
    impactMetrics,
    beforeAfter,
    videoUrl,
    quote,
    publishedAt,
    featured
  }`

  return client.fetch(query, { slug })
}

// Donations
export async function getDonationCampaigns(status?: string, limit: number = 10) {
  const safeLimit = clampLimit(limit, 10)
  const statusFilter = status ? `&& status == $status` : ''

  const query = groq`*[_type == "donation" && isActive == true ${statusFilter}] | order(featured desc, startDate desc) [0...$safeLimit] {
    _id,
    title,
    slug,
    description,
    featuredImage,
    campaignType,
    relatedProgram->{
      _id,
      title,
      slug
    },
    goalAmount,
    currentAmount,
    currency,
    suggestedAmounts,
    startDate,
    endDate,
    donationUrl,
    impactStatements,
    featured,
    status
  }`

  return client.fetch(query, { safeLimit, ...(status ? { status } : {}) })
}

export async function getDonationCampaignBySlug(slug: string) {
  const query = groq`*[_type == "donation" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    content,
    featuredImage,
    campaignType,
    relatedProgram->{
      _id,
      title,
      slug,
      description
    },
    goalAmount,
    currentAmount,
    currency,
    suggestedAmounts,
    startDate,
    endDate,
    donationUrl,
    impactStatements,
    taxDeductible,
    featured,
    status
  }`

  return client.fetch(query, { slug })
}

// Site Settings
export async function getSiteSettings() {
  const query = groq`*[_type == "siteSettings"][0] {
    siteName,
    siteDescription,
    logo,
    favicon,
    contactInfo,
    socialMedia,
    maintenanceMode,
    announcementBar,
    seo,
    analytics,
    donationSettings
  }`

  return client.fetch(query)
}

// Newsletter
export async function getNewsletterSubscribers(status?: string) {
  const statusFilter = status ? `&& status == $status` : ''

  const query = groq`*[_type == "newsletter" ${statusFilter}] | order(subscribedAt desc) {
    _id,
    email,
    name,
    subscribedAt,
    interests,
    status,
    source
  }`

  return client.fetch(query, status ? { status } : {})
}
