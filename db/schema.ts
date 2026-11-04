import { pgTable, text, varchar, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Team Members Table
export const teamMembers = pgTable("team_members", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  bio: text("bio"),
  imageUrl: text("image_url"),
  email: varchar("email", { length: 255 }),
  linkedinUrl: text("linkedin_url"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Programs Table
export const programs = pgTable("programs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // Academy, Health, Consult
  subcategory: varchar("subcategory", { length: 100 }),
  description: text("description").notNull(),
  duration: varchar("duration", { length: 100 }),
  level: varchar("level", { length: 50 }),
  format: varchar("format", { length: 50 }),
  imageUrl: text("image_url"),
  modules: jsonb("modules").$type<string[]>(),
  outcomes: jsonb("outcomes").$type<string[]>(),
  components: jsonb("components").$type<string[]>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Impact Stories Table
export const impactStories = pgTable("impact_stories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  date: varchar("date", { length: 50 }),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  impact: jsonb("impact").$type<string[]>(),
  category: varchar("category", { length: 100 }), // Health, Education, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Statistics Table
export const statistics = pgTable("statistics", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  label: varchar("label", { length: 255 }).notNull(),
  value: varchar("value", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }), // lucide icon name
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Events Table
export const events = pgTable("events", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  date: varchar("date", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }),
  category: varchar("category", { length: 100 }), // Academy, Health, Consulting, Conference, Webinar, Training, Workshop
  imageUrl: text("image_url"),
  registrationUrl: text("registration_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partners Table
export const partners = pgTable("partners", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  description: text("description"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Careers/Job Postings Table
export const jobPostings = pgTable("job_postings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  department: varchar("department", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // Full-time, Part-time, Contract
  level: varchar("level", { length: 50 }).notNull(), // Entry, Mid, Senior
  description: text("description").notNull(),
  responsibilities: jsonb("responsibilities").$type<string[]>(),
  qualifications: jsonb("qualifications").$type<string[]>(),
  benefits: jsonb("benefits").$type<string[]>(),
  salary: varchar("salary", { length: 100 }),
  deadline: varchar("deadline", { length: 100 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin Users Table (for authentication)
export const adminUsers = pgTable("admin_users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 50 }).default("admin"), // admin, super_admin
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// News Articles Table
export const newsArticles = pgTable("news_articles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  author: varchar("author", { length: 255 }),
  category: varchar("category", { length: 100 }), // News, Update, Announcement
  imageUrl: text("image_url"),
  publishedDate: varchar("published_date", { length: 100 }),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gallery Images Table
export const galleryImages = pgTable("gallery_images", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: varchar("category", { length: 100 }).notNull(), // Academy, Health, Consult, Events, Team
  date: varchar("date", { length: 100 }),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Resources Table
export const resources = pgTable("resources", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 100 }).notNull(), // Toolkit, Report, Guide, Publication
  category: varchar("category", { length: 100 }), // Academy, Health, Consult
  fileUrl: text("file_url"),
  downloadUrl: text("download_url"),
  fileSize: varchar("file_size", { length: 50 }),
  publishedDate: varchar("published_date", { length: 100 }),
  author: varchar("author", { length: 255 }),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services Table (for Health and Consulting services)
export const services = pgTable("services", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // Health, Consult
  description: text("description").notNull(),
  features: jsonb("features").$type<string[]>(),
  icon: varchar("icon", { length: 50 }), // lucide icon name
  imageUrl: text("image_url"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Testimonials Table
export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }),
  organization: varchar("organization", { length: 255 }),
  content: text("content").notNull(),
  rating: integer("rating").default(5),
  category: varchar("category", { length: 100 }), // Academy, Health, Consult, General
  imageUrl: text("image_url"),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod Schemas for validation
export const insertTeamMemberSchema = createInsertSchema(teamMembers);
export const selectTeamMemberSchema = createSelectSchema(teamMembers);

export const insertProgramSchema = createInsertSchema(programs);
export const selectProgramSchema = createSelectSchema(programs);

export const insertImpactStorySchema = createInsertSchema(impactStories);
export const selectImpactStorySchema = createSelectSchema(impactStories);

export const insertStatisticSchema = createInsertSchema(statistics);
export const selectStatisticSchema = createSelectSchema(statistics);

export const insertEventSchema = createInsertSchema(events);
export const selectEventSchema = createSelectSchema(events);

export const insertPartnerSchema = createInsertSchema(partners);
export const selectPartnerSchema = createSelectSchema(partners);

export const insertJobPostingSchema = createInsertSchema(jobPostings);
export const selectJobPostingSchema = createSelectSchema(jobPostings);

export const insertAdminUserSchema = createInsertSchema(adminUsers);
export const selectAdminUserSchema = createSelectSchema(adminUsers);

export const insertNewsArticleSchema = createInsertSchema(newsArticles);
export const selectNewsArticleSchema = createSelectSchema(newsArticles);

export const insertGalleryImageSchema = createInsertSchema(galleryImages);
export const selectGalleryImageSchema = createSelectSchema(galleryImages);

export const insertResourceSchema = createInsertSchema(resources);
export const selectResourceSchema = createSelectSchema(resources);

export const insertServiceSchema = createInsertSchema(services);
export const selectServiceSchema = createSelectSchema(services);

export const insertTestimonialSchema = createInsertSchema(testimonials);
export const selectTestimonialSchema = createSelectSchema(testimonials);

// TypeScript types
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;

export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;

export type ImpactStory = typeof impactStories.$inferSelect;
export type NewImpactStory = typeof impactStories.$inferInsert;

export type Statistic = typeof statistics.$inferSelect;
export type NewStatistic = typeof statistics.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type Partner = typeof partners.$inferSelect;
export type NewPartner = typeof partners.$inferInsert;

export type JobPosting = typeof jobPostings.$inferSelect;
export type NewJobPosting = typeof jobPostings.$inferInsert;

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;

export type NewsArticle = typeof newsArticles.$inferSelect;
export type NewNewsArticle = typeof newsArticles.$inferInsert;

export type GalleryImage = typeof galleryImages.$inferSelect;
export type NewGalleryImage = typeof galleryImages.$inferInsert;

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
