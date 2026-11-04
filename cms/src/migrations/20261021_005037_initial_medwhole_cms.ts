import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE SCHEMA IF NOT EXISTS "medwhole_cms";
   CREATE TYPE "medwhole_cms"."enum_administrators_roles" AS ENUM('administrator', 'editor', 'contributor', 'content_read', 'operations', 'finance', 'website_service');
  CREATE TYPE "medwhole_cms"."enum_media_category" AS ENUM('Homepage', 'Academy', 'Health', 'Empowerment', 'Community', 'Events', 'Team', 'Partner', 'Documents', 'Uncategorized');
  CREATE TYPE "medwhole_cms"."enum_media_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum__media_v_version_category" AS ENUM('Homepage', 'Academy', 'Health', 'Empowerment', 'Community', 'Events', 'Team', 'Partner', 'Documents', 'Uncategorized');
  CREATE TYPE "medwhole_cms"."enum__media_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum_programmes_pillar" AS ENUM('Health', 'Literacy', 'Empowerment');
  CREATE TYPE "medwhole_cms"."enum_programmes_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum__programmes_v_version_pillar" AS ENUM('Health', 'Literacy', 'Empowerment');
  CREATE TYPE "medwhole_cms"."enum__programmes_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum_news_category" AS ENUM('Programme reports', 'Quarterly reports', 'Partnerships', 'Announcements', 'announcement', 'quarterly-report', 'research', 'impact-story', 'partnership', 'program-update');
  CREATE TYPE "medwhole_cms"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum__news_v_version_category" AS ENUM('Programme reports', 'Quarterly reports', 'Partnerships', 'Announcements', 'announcement', 'quarterly-report', 'research', 'impact-story', 'partnership', 'program-update');
  CREATE TYPE "medwhole_cms"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum_communities_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum__communities_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum_impact_stories_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum__impact_stories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum_team_members_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum__team_members_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum_partners_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum__partners_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum_resources_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum__resources_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum_jobs_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum__jobs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum_contact_submissions_status" AS ENUM('new', 'in_review', 'replied', 'resolved', 'archived');
  CREATE TYPE "medwhole_cms"."enum_volunteer_applications_status" AS ENUM('new', 'in_review', 'replied', 'resolved', 'archived');
  CREATE TYPE "medwhole_cms"."enum_partnership_applications_status" AS ENUM('new', 'in_review', 'replied', 'resolved', 'archived');
  CREATE TYPE "medwhole_cms"."enum_newsletter_subscribers_status" AS ENUM('new', 'in_review', 'replied', 'resolved', 'archived');
  CREATE TYPE "medwhole_cms"."enum_event_registrations_status" AS ENUM('new', 'in_review', 'replied', 'resolved', 'archived');
  CREATE TYPE "medwhole_cms"."enum_donation_intents_currency" AS ENUM('NGN', 'USD', 'GBP');
  CREATE TYPE "medwhole_cms"."enum_donation_intents_frequency" AS ENUM('one-time', 'monthly');
  CREATE TYPE "medwhole_cms"."enum_donation_intents_status" AS ENUM('new', 'in_review', 'replied', 'resolved', 'archived');
  CREATE TYPE "medwhole_cms"."enum_donation_payments_status" AS ENUM('new', 'in_review', 'replied', 'resolved', 'archived');
  CREATE TYPE "medwhole_cms"."enum_email_deliveries_status" AS ENUM('queued', 'sent', 'failed', 'retry');
  CREATE TYPE "medwhole_cms"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "medwhole_cms"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "medwhole_cms"."administrators_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "medwhole_cms"."enum_administrators_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "medwhole_cms"."administrators_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "medwhole_cms"."administrators" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "medwhole_cms"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"category" "medwhole_cms"."enum_media_category",
  	"consent_confirmed" boolean DEFAULT false,
  	"source" varchar,
  	"source_sanity_id" varchar,
  	"alt_review_required" boolean DEFAULT false,
  	"consent_review_required" boolean DEFAULT false,
  	"usage_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "medwhole_cms"."enum_media_status" DEFAULT 'draft',
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar
  );
  
  CREATE TABLE "medwhole_cms"."_media_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_alt" varchar,
  	"version_caption" varchar,
  	"version_credit" varchar,
  	"version_category" "medwhole_cms"."enum__media_v_version_category",
  	"version_consent_confirmed" boolean DEFAULT false,
  	"version_source" varchar,
  	"version_source_sanity_id" varchar,
  	"version_alt_review_required" boolean DEFAULT false,
  	"version_consent_review_required" boolean DEFAULT false,
  	"version_usage_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "medwhole_cms"."enum__media_v_version_status" DEFAULT 'draft',
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"version_sizes_card_url" varchar,
  	"version_sizes_card_width" numeric,
  	"version_sizes_card_height" numeric,
  	"version_sizes_card_mime_type" varchar,
  	"version_sizes_card_filesize" numeric,
  	"version_sizes_card_filename" varchar,
  	"version_sizes_wide_url" varchar,
  	"version_sizes_wide_width" numeric,
  	"version_sizes_wide_height" numeric,
  	"version_sizes_wide_mime_type" varchar,
  	"version_sizes_wide_filesize" numeric,
  	"version_sizes_wide_filename" varchar,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "medwhole_cms"."pages_blocks_manuscript" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"image_alt" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "medwhole_cms"."pages_blocks_figures_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "medwhole_cms"."pages_blocks_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "medwhole_cms"."pages_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"asset_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "medwhole_cms"."pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "medwhole_cms"."pages_blocks_approved_content_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_number" numeric,
  	"section_label" varchar,
  	"source_blocks" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "medwhole_cms"."pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"path" varchar,
  	"source_copy_key" varchar,
  	"source_snapshot" jsonb,
  	"meta_description" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"hero_image_id" integer,
  	"hero_image_alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "medwhole_cms"."enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "medwhole_cms"."_pages_v_blocks_manuscript" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"subheading" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"image_alt" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "medwhole_cms"."_pages_v_blocks_figures_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "medwhole_cms"."_pages_v_blocks_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "medwhole_cms"."_pages_v_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"asset_id" integer,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "medwhole_cms"."_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "medwhole_cms"."_pages_v_blocks_approved_content_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_number" numeric,
  	"section_label" varchar,
  	"source_blocks" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "medwhole_cms"."_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_path" varchar,
  	"version_source_copy_key" varchar,
  	"version_source_snapshot" jsonb,
  	"version_meta_description" varchar,
  	"version_eyebrow" varchar,
  	"version_heading" varchar,
  	"version_subheading" varchar,
  	"version_hero_image_id" integer,
  	"version_hero_image_alt" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "medwhole_cms"."enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "medwhole_cms"."programmes_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "medwhole_cms"."programmes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"pillar" "medwhole_cms"."enum_programmes_pillar",
  	"category" varchar,
  	"summary" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"source_sanity_id" varchar,
  	"source_snapshot" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "medwhole_cms"."enum_programmes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "medwhole_cms"."_programmes_v_version_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "medwhole_cms"."_programmes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_pillar" "medwhole_cms"."enum__programmes_v_version_pillar",
  	"version_category" varchar,
  	"version_summary" varchar,
  	"version_body" varchar,
  	"version_image_id" integer,
  	"version_image_alt" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_source_sanity_id" varchar,
  	"version_source_snapshot" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "medwhole_cms"."enum__programmes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "medwhole_cms"."events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"standfirst" varchar,
  	"body" varchar,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"location" varchar,
  	"category" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"registration_url" varchar,
  	"featured" boolean DEFAULT false,
  	"source_sanity_id" varchar,
  	"source_snapshot" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "medwhole_cms"."enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "medwhole_cms"."events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "medwhole_cms"."_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_standfirst" varchar,
  	"version_body" varchar,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_category" varchar,
  	"version_image_id" integer,
  	"version_image_alt" varchar,
  	"version_registration_url" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_source_sanity_id" varchar,
  	"version_source_snapshot" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "medwhole_cms"."enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "medwhole_cms"."_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "medwhole_cms"."news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"category" "medwhole_cms"."enum_news_category",
  	"summary" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"author" varchar,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"source_sanity_id" varchar,
  	"source_snapshot" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "medwhole_cms"."enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "medwhole_cms"."_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_category" "medwhole_cms"."enum__news_v_version_category",
  	"version_summary" varchar,
  	"version_body" varchar,
  	"version_image_id" integer,
  	"version_image_alt" varchar,
  	"version_author" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_source_sanity_id" varchar,
  	"version_source_snapshot" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "medwhole_cms"."enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "medwhole_cms"."communities_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "medwhole_cms"."communities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"location" varchar,
  	"established_at" timestamp(3) with time zone,
  	"summary" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"source_sanity_id" varchar,
  	"source_snapshot" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "medwhole_cms"."enum_communities_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "medwhole_cms"."_communities_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "medwhole_cms"."_communities_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_location" varchar,
  	"version_established_at" timestamp(3) with time zone,
  	"version_summary" varchar,
  	"version_body" varchar,
  	"version_image_id" integer,
  	"version_image_alt" varchar,
  	"version_source_sanity_id" varchar,
  	"version_source_snapshot" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "medwhole_cms"."enum__communities_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "medwhole_cms"."impact_stories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"location" varchar,
  	"date" timestamp(3) with time zone,
  	"summary" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"source_sanity_id" varchar,
  	"source_snapshot" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "medwhole_cms"."enum_impact_stories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "medwhole_cms"."_impact_stories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_location" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_summary" varchar,
  	"version_body" varchar,
  	"version_image_id" integer,
  	"version_image_alt" varchar,
  	"version_source_sanity_id" varchar,
  	"version_source_snapshot" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "medwhole_cms"."enum__impact_stories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "medwhole_cms"."team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"biography" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"email" varchar,
  	"linkedin_url" varchar,
  	"order" numeric DEFAULT 0,
  	"source_sanity_id" varchar,
  	"source_snapshot" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "medwhole_cms"."enum_team_members_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "medwhole_cms"."_team_members_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_role" varchar,
  	"version_biography" varchar,
  	"version_image_id" integer,
  	"version_image_alt" varchar,
  	"version_email" varchar,
  	"version_linkedin_url" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_source_sanity_id" varchar,
  	"version_source_snapshot" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "medwhole_cms"."enum__team_members_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "medwhole_cms"."partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"summary" varchar,
  	"logo_id" integer,
  	"website_url" varchar,
  	"order" numeric DEFAULT 0,
  	"source_sanity_id" varchar,
  	"source_snapshot" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "medwhole_cms"."enum_partners_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "medwhole_cms"."_partners_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_summary" varchar,
  	"version_logo_id" integer,
  	"version_website_url" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_source_sanity_id" varchar,
  	"version_source_snapshot" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "medwhole_cms"."enum__partners_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "medwhole_cms"."resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"category" varchar,
  	"document_id" integer,
  	"author" varchar,
  	"published_at" timestamp(3) with time zone,
  	"source_sanity_id" varchar,
  	"source_snapshot" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "medwhole_cms"."enum_resources_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "medwhole_cms"."_resources_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_category" varchar,
  	"version_document_id" integer,
  	"version_author" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_source_sanity_id" varchar,
  	"version_source_snapshot" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "medwhole_cms"."enum__resources_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "medwhole_cms"."jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"department" varchar,
  	"location" varchar,
  	"type" varchar,
  	"level" varchar,
  	"body" varchar,
  	"deadline" timestamp(3) with time zone,
  	"source_sanity_id" varchar,
  	"source_snapshot" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "medwhole_cms"."enum_jobs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "medwhole_cms"."_jobs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_department" varchar,
  	"version_location" varchar,
  	"version_type" varchar,
  	"version_level" varchar,
  	"version_body" varchar,
  	"version_deadline" timestamp(3) with time zone,
  	"version_source_sanity_id" varchar,
  	"version_source_snapshot" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "medwhole_cms"."enum__jobs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "medwhole_cms"."contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"status" "medwhole_cms"."enum_contact_submissions_status" DEFAULT 'new' NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"source_page" varchar,
  	"consent" boolean DEFAULT false,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "medwhole_cms"."volunteer_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"location" jsonb,
  	"areas_of_interest" jsonb,
  	"skills" jsonb,
  	"motivation" varchar NOT NULL,
  	"status" "medwhole_cms"."enum_volunteer_applications_status" DEFAULT 'new' NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"source_page" varchar,
  	"consent" boolean DEFAULT false,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "medwhole_cms"."partnership_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"organisation" varchar NOT NULL,
  	"phone" varchar,
  	"partnership_type" varchar,
  	"message" varchar NOT NULL,
  	"status" "medwhole_cms"."enum_partnership_applications_status" DEFAULT 'new' NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"source_page" varchar,
  	"consent" boolean DEFAULT false,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "medwhole_cms"."newsletter_subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"name" varchar,
  	"confirmed_at" timestamp(3) with time zone,
  	"unsubscribed_at" timestamp(3) with time zone,
  	"status" "medwhole_cms"."enum_newsletter_subscribers_status" DEFAULT 'new' NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"source_page" varchar,
  	"consent" boolean DEFAULT false,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "medwhole_cms"."event_registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"event_id" integer NOT NULL,
  	"phone" varchar,
  	"form_data" jsonb,
  	"status" "medwhole_cms"."enum_event_registrations_status" DEFAULT 'new' NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"source_page" varchar,
  	"consent" boolean DEFAULT false,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "medwhole_cms"."donation_intents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"amount" varchar NOT NULL,
  	"currency" "medwhole_cms"."enum_donation_intents_currency" NOT NULL,
  	"frequency" "medwhole_cms"."enum_donation_intents_frequency" NOT NULL,
  	"programme" varchar,
  	"status" "medwhole_cms"."enum_donation_intents_status" DEFAULT 'new' NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"source_page" varchar,
  	"consent" boolean DEFAULT false,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "medwhole_cms"."donation_payments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"parent_reference" varchar,
  	"amount_minor" numeric NOT NULL,
  	"currency" varchar NOT NULL,
  	"provider_status" varchar NOT NULL,
  	"paid_at" timestamp(3) with time zone,
  	"receipt_sent" boolean DEFAULT false,
  	"status" "medwhole_cms"."enum_donation_payments_status" DEFAULT 'new' NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"source_page" varchar,
  	"consent" boolean DEFAULT false,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "medwhole_cms"."email_deliveries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"template" varchar NOT NULL,
  	"record_id" varchar NOT NULL,
  	"recipient" varchar NOT NULL,
  	"provider_id" varchar,
  	"attempts" numeric DEFAULT 0,
  	"last_error" varchar,
  	"status" "medwhole_cms"."enum_email_deliveries_status" DEFAULT 'queued' NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"source_page" varchar,
  	"consent" boolean DEFAULT false,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "medwhole_cms"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "medwhole_cms"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "medwhole_cms"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"administrators_id" integer,
  	"media_id" integer,
  	"pages_id" integer,
  	"programmes_id" integer,
  	"events_id" integer,
  	"news_id" integer,
  	"communities_id" integer,
  	"impact_stories_id" integer,
  	"team_members_id" integer,
  	"partners_id" integer,
  	"resources_id" integer,
  	"jobs_id" integer,
  	"contact_submissions_id" integer,
  	"volunteer_applications_id" integer,
  	"partnership_applications_id" integer,
  	"newsletter_subscribers_id" integer,
  	"event_registrations_id" integer,
  	"donation_intents_id" integer,
  	"donation_payments_id" integer,
  	"email_deliveries_id" integer
  );
  
  CREATE TABLE "medwhole_cms"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "medwhole_cms"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"administrators_id" integer
  );
  
  CREATE TABLE "medwhole_cms"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "medwhole_cms"."homepage_impact_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"source_note" varchar
  );
  
  CREATE TABLE "medwhole_cms"."homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_heading" varchar,
  	"hero_description" varchar,
  	"hero_video_id" integer,
  	"hero_video_url" varchar,
  	"hero_poster_id" integer,
  	"hero_primary_cta_label" varchar,
  	"hero_primary_cta_href" varchar,
  	"hero_secondary_cta_label" varchar,
  	"hero_secondary_cta_href" varchar,
  	"featured_story_id" integer,
  	"community_feature_id" integer,
  	"manifesto" jsonb,
  	"_status" "medwhole_cms"."enum_homepage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "medwhole_cms"."homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"programmes_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "medwhole_cms"."_homepage_v_version_impact_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"source_note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "medwhole_cms"."_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_heading" varchar,
  	"version_hero_description" varchar,
  	"version_hero_video_id" integer,
  	"version_hero_video_url" varchar,
  	"version_hero_poster_id" integer,
  	"version_hero_primary_cta_label" varchar,
  	"version_hero_primary_cta_href" varchar,
  	"version_hero_secondary_cta_label" varchar,
  	"version_hero_secondary_cta_href" varchar,
  	"version_featured_story_id" integer,
  	"version_community_feature_id" integer,
  	"version_manifesto" jsonb,
  	"version__status" "medwhole_cms"."enum__homepage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "medwhole_cms"."_homepage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"programmes_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "medwhole_cms"."site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "medwhole_cms"."site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"organisation_name" varchar DEFAULT 'MedWHOLE Alliance for Health and Development' NOT NULL,
  	"site_title" varchar DEFAULT 'MedWHOLE | Whole People. Lasting Impact.' NOT NULL,
  	"site_description" varchar DEFAULT 'A Christ-centred development organisation advancing Health, Literacy, and Empowerment.' NOT NULL,
  	"tagline" varchar DEFAULT 'Whole People. Lasting Impact.',
  	"public_email" varchar DEFAULT 'info@medwhole.org' NOT NULL,
  	"public_phone" varchar,
  	"public_address" varchar,
  	"internal_email_recipients" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "medwhole_cms"."administrators_roles" ADD CONSTRAINT "administrators_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."administrators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."administrators_sessions" ADD CONSTRAINT "administrators_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."administrators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_media_v" ADD CONSTRAINT "_media_v_parent_id_media_id_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."pages_blocks_manuscript" ADD CONSTRAINT "pages_blocks_manuscript_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."pages_blocks_manuscript" ADD CONSTRAINT "pages_blocks_manuscript_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."pages_blocks_figures_items" ADD CONSTRAINT "pages_blocks_figures_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."pages_blocks_figures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."pages_blocks_figures" ADD CONSTRAINT "pages_blocks_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_asset_id_media_id_fk" FOREIGN KEY ("asset_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."pages_blocks_approved_content_section" ADD CONSTRAINT "pages_blocks_approved_content_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_pages_v_blocks_manuscript" ADD CONSTRAINT "_pages_v_blocks_manuscript_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_pages_v_blocks_manuscript" ADD CONSTRAINT "_pages_v_blocks_manuscript_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_pages_v_blocks_figures_items" ADD CONSTRAINT "_pages_v_blocks_figures_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."_pages_v_blocks_figures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_pages_v_blocks_figures" ADD CONSTRAINT "_pages_v_blocks_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_asset_id_media_id_fk" FOREIGN KEY ("asset_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_pages_v_blocks_approved_content_section" ADD CONSTRAINT "_pages_v_blocks_approved_content_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_pages_v" ADD CONSTRAINT "_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."programmes_outcomes" ADD CONSTRAINT "programmes_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."programmes" ADD CONSTRAINT "programmes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_programmes_v_version_outcomes" ADD CONSTRAINT "_programmes_v_version_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."_programmes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_programmes_v" ADD CONSTRAINT "_programmes_v_parent_id_programmes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_programmes_v" ADD CONSTRAINT "_programmes_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."events_rels" ADD CONSTRAINT "events_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_events_v_rels" ADD CONSTRAINT "_events_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."news" ADD CONSTRAINT "news_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_news_v" ADD CONSTRAINT "_news_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."communities_sections" ADD CONSTRAINT "communities_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."communities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."communities" ADD CONSTRAINT "communities_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_communities_v_version_sections" ADD CONSTRAINT "_communities_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."_communities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_communities_v" ADD CONSTRAINT "_communities_v_parent_id_communities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."communities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_communities_v" ADD CONSTRAINT "_communities_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."impact_stories" ADD CONSTRAINT "impact_stories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_impact_stories_v" ADD CONSTRAINT "_impact_stories_v_parent_id_impact_stories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."impact_stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_impact_stories_v" ADD CONSTRAINT "_impact_stories_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."team_members" ADD CONSTRAINT "team_members_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_team_members_v" ADD CONSTRAINT "_team_members_v_parent_id_team_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_team_members_v" ADD CONSTRAINT "_team_members_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_partners_v" ADD CONSTRAINT "_partners_v_parent_id_partners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_partners_v" ADD CONSTRAINT "_partners_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."resources" ADD CONSTRAINT "resources_document_id_media_id_fk" FOREIGN KEY ("document_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_resources_v" ADD CONSTRAINT "_resources_v_parent_id_resources_id_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_resources_v" ADD CONSTRAINT "_resources_v_version_document_id_media_id_fk" FOREIGN KEY ("version_document_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_jobs_v" ADD CONSTRAINT "_jobs_v_parent_id_jobs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "medwhole_cms"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_administrators_fk" FOREIGN KEY ("administrators_id") REFERENCES "medwhole_cms"."administrators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "medwhole_cms"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programmes_fk" FOREIGN KEY ("programmes_id") REFERENCES "medwhole_cms"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "medwhole_cms"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "medwhole_cms"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_communities_fk" FOREIGN KEY ("communities_id") REFERENCES "medwhole_cms"."communities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_impact_stories_fk" FOREIGN KEY ("impact_stories_id") REFERENCES "medwhole_cms"."impact_stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "medwhole_cms"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "medwhole_cms"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "medwhole_cms"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "medwhole_cms"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "medwhole_cms"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_volunteer_applications_fk" FOREIGN KEY ("volunteer_applications_id") REFERENCES "medwhole_cms"."volunteer_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partnership_applications_fk" FOREIGN KEY ("partnership_applications_id") REFERENCES "medwhole_cms"."partnership_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_subscribers_fk" FOREIGN KEY ("newsletter_subscribers_id") REFERENCES "medwhole_cms"."newsletter_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_registrations_fk" FOREIGN KEY ("event_registrations_id") REFERENCES "medwhole_cms"."event_registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_donation_intents_fk" FOREIGN KEY ("donation_intents_id") REFERENCES "medwhole_cms"."donation_intents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_donation_payments_fk" FOREIGN KEY ("donation_payments_id") REFERENCES "medwhole_cms"."donation_payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_deliveries_fk" FOREIGN KEY ("email_deliveries_id") REFERENCES "medwhole_cms"."email_deliveries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_administrators_fk" FOREIGN KEY ("administrators_id") REFERENCES "medwhole_cms"."administrators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."homepage_impact_figures" ADD CONSTRAINT "homepage_impact_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."homepage" ADD CONSTRAINT "homepage_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."homepage" ADD CONSTRAINT "homepage_hero_poster_id_media_id_fk" FOREIGN KEY ("hero_poster_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."homepage" ADD CONSTRAINT "homepage_featured_story_id_impact_stories_id_fk" FOREIGN KEY ("featured_story_id") REFERENCES "medwhole_cms"."impact_stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."homepage" ADD CONSTRAINT "homepage_community_feature_id_communities_id_fk" FOREIGN KEY ("community_feature_id") REFERENCES "medwhole_cms"."communities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."homepage_rels" ADD CONSTRAINT "homepage_rels_programmes_fk" FOREIGN KEY ("programmes_id") REFERENCES "medwhole_cms"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."homepage_rels" ADD CONSTRAINT "homepage_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_homepage_v_version_impact_figures" ADD CONSTRAINT "_homepage_v_version_impact_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_video_id_media_id_fk" FOREIGN KEY ("version_hero_video_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_poster_id_media_id_fk" FOREIGN KEY ("version_hero_poster_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_homepage_v" ADD CONSTRAINT "_homepage_v_version_featured_story_id_impact_stories_id_fk" FOREIGN KEY ("version_featured_story_id") REFERENCES "medwhole_cms"."impact_stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_homepage_v" ADD CONSTRAINT "_homepage_v_version_community_feature_id_communities_id_fk" FOREIGN KEY ("version_community_feature_id") REFERENCES "medwhole_cms"."communities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "medwhole_cms"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_programmes_fk" FOREIGN KEY ("programmes_id") REFERENCES "medwhole_cms"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "medwhole_cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "medwhole_cms"."site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "administrators_roles_order_idx" ON "medwhole_cms"."administrators_roles" USING btree ("order");
  CREATE INDEX "administrators_roles_parent_idx" ON "medwhole_cms"."administrators_roles" USING btree ("parent_id");
  CREATE INDEX "administrators_sessions_order_idx" ON "medwhole_cms"."administrators_sessions" USING btree ("_order");
  CREATE INDEX "administrators_sessions_parent_id_idx" ON "medwhole_cms"."administrators_sessions" USING btree ("_parent_id");
  CREATE INDEX "administrators_updated_at_idx" ON "medwhole_cms"."administrators" USING btree ("updated_at");
  CREATE INDEX "administrators_created_at_idx" ON "medwhole_cms"."administrators" USING btree ("created_at");
  CREATE UNIQUE INDEX "administrators_email_idx" ON "medwhole_cms"."administrators" USING btree ("email");
  CREATE UNIQUE INDEX "media_source_sanity_id_idx" ON "medwhole_cms"."media" USING btree ("source_sanity_id");
  CREATE INDEX "media_updated_at_idx" ON "medwhole_cms"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "medwhole_cms"."media" USING btree ("created_at");
  CREATE INDEX "media__status_idx" ON "medwhole_cms"."media" USING btree ("_status");
  CREATE UNIQUE INDEX "media_filename_idx" ON "medwhole_cms"."media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "medwhole_cms"."media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "medwhole_cms"."media" USING btree ("sizes_wide_filename");
  CREATE INDEX "_media_v_parent_idx" ON "medwhole_cms"."_media_v" USING btree ("parent_id");
  CREATE INDEX "_media_v_version_version_source_sanity_id_idx" ON "medwhole_cms"."_media_v" USING btree ("version_source_sanity_id");
  CREATE INDEX "_media_v_version_version_updated_at_idx" ON "medwhole_cms"."_media_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_v_version_version_created_at_idx" ON "medwhole_cms"."_media_v" USING btree ("version_created_at");
  CREATE INDEX "_media_v_version_version__status_idx" ON "medwhole_cms"."_media_v" USING btree ("version__status");
  CREATE INDEX "_media_v_version_version_filename_idx" ON "medwhole_cms"."_media_v" USING btree ("version_filename");
  CREATE INDEX "_media_v_version_sizes_card_version_sizes_card_filename_idx" ON "medwhole_cms"."_media_v" USING btree ("version_sizes_card_filename");
  CREATE INDEX "_media_v_version_sizes_wide_version_sizes_wide_filename_idx" ON "medwhole_cms"."_media_v" USING btree ("version_sizes_wide_filename");
  CREATE INDEX "_media_v_created_at_idx" ON "medwhole_cms"."_media_v" USING btree ("created_at");
  CREATE INDEX "_media_v_updated_at_idx" ON "medwhole_cms"."_media_v" USING btree ("updated_at");
  CREATE INDEX "_media_v_latest_idx" ON "medwhole_cms"."_media_v" USING btree ("latest");
  CREATE INDEX "pages_blocks_manuscript_order_idx" ON "medwhole_cms"."pages_blocks_manuscript" USING btree ("_order");
  CREATE INDEX "pages_blocks_manuscript_parent_id_idx" ON "medwhole_cms"."pages_blocks_manuscript" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_manuscript_path_idx" ON "medwhole_cms"."pages_blocks_manuscript" USING btree ("_path");
  CREATE INDEX "pages_blocks_manuscript_image_idx" ON "medwhole_cms"."pages_blocks_manuscript" USING btree ("image_id");
  CREATE INDEX "pages_blocks_figures_items_order_idx" ON "medwhole_cms"."pages_blocks_figures_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_figures_items_parent_id_idx" ON "medwhole_cms"."pages_blocks_figures_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_figures_order_idx" ON "medwhole_cms"."pages_blocks_figures" USING btree ("_order");
  CREATE INDEX "pages_blocks_figures_parent_id_idx" ON "medwhole_cms"."pages_blocks_figures" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_figures_path_idx" ON "medwhole_cms"."pages_blocks_figures" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_images_order_idx" ON "medwhole_cms"."pages_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_images_parent_id_idx" ON "medwhole_cms"."pages_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_images_asset_idx" ON "medwhole_cms"."pages_blocks_gallery_images" USING btree ("asset_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "medwhole_cms"."pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "medwhole_cms"."pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "medwhole_cms"."pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_approved_content_section_order_idx" ON "medwhole_cms"."pages_blocks_approved_content_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_approved_content_section_parent_id_idx" ON "medwhole_cms"."pages_blocks_approved_content_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_approved_content_section_path_idx" ON "medwhole_cms"."pages_blocks_approved_content_section" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_path_idx" ON "medwhole_cms"."pages" USING btree ("path");
  CREATE UNIQUE INDEX "pages_source_copy_key_idx" ON "medwhole_cms"."pages" USING btree ("source_copy_key");
  CREATE INDEX "pages_hero_image_idx" ON "medwhole_cms"."pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "medwhole_cms"."pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "medwhole_cms"."pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "medwhole_cms"."pages" USING btree ("_status");
  CREATE INDEX "_pages_v_blocks_manuscript_order_idx" ON "medwhole_cms"."_pages_v_blocks_manuscript" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_manuscript_parent_id_idx" ON "medwhole_cms"."_pages_v_blocks_manuscript" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_manuscript_path_idx" ON "medwhole_cms"."_pages_v_blocks_manuscript" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_manuscript_image_idx" ON "medwhole_cms"."_pages_v_blocks_manuscript" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_figures_items_order_idx" ON "medwhole_cms"."_pages_v_blocks_figures_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_figures_items_parent_id_idx" ON "medwhole_cms"."_pages_v_blocks_figures_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_figures_order_idx" ON "medwhole_cms"."_pages_v_blocks_figures" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_figures_parent_id_idx" ON "medwhole_cms"."_pages_v_blocks_figures" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_figures_path_idx" ON "medwhole_cms"."_pages_v_blocks_figures" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gallery_images_order_idx" ON "medwhole_cms"."_pages_v_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_images_parent_id_idx" ON "medwhole_cms"."_pages_v_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_images_asset_idx" ON "medwhole_cms"."_pages_v_blocks_gallery_images" USING btree ("asset_id");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "medwhole_cms"."_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "medwhole_cms"."_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "medwhole_cms"."_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_approved_content_section_order_idx" ON "medwhole_cms"."_pages_v_blocks_approved_content_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_approved_content_section_parent_id_idx" ON "medwhole_cms"."_pages_v_blocks_approved_content_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_approved_content_section_path_idx" ON "medwhole_cms"."_pages_v_blocks_approved_content_section" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "medwhole_cms"."_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_path_idx" ON "medwhole_cms"."_pages_v" USING btree ("version_path");
  CREATE INDEX "_pages_v_version_version_source_copy_key_idx" ON "medwhole_cms"."_pages_v" USING btree ("version_source_copy_key");
  CREATE INDEX "_pages_v_version_version_hero_image_idx" ON "medwhole_cms"."_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "medwhole_cms"."_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "medwhole_cms"."_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "medwhole_cms"."_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "medwhole_cms"."_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "medwhole_cms"."_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "medwhole_cms"."_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "medwhole_cms"."_pages_v" USING btree ("autosave");
  CREATE INDEX "programmes_outcomes_order_idx" ON "medwhole_cms"."programmes_outcomes" USING btree ("_order");
  CREATE INDEX "programmes_outcomes_parent_id_idx" ON "medwhole_cms"."programmes_outcomes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programmes_slug_idx" ON "medwhole_cms"."programmes" USING btree ("slug");
  CREATE INDEX "programmes_image_idx" ON "medwhole_cms"."programmes" USING btree ("image_id");
  CREATE UNIQUE INDEX "programmes_source_sanity_id_idx" ON "medwhole_cms"."programmes" USING btree ("source_sanity_id");
  CREATE INDEX "programmes_updated_at_idx" ON "medwhole_cms"."programmes" USING btree ("updated_at");
  CREATE INDEX "programmes_created_at_idx" ON "medwhole_cms"."programmes" USING btree ("created_at");
  CREATE INDEX "programmes__status_idx" ON "medwhole_cms"."programmes" USING btree ("_status");
  CREATE INDEX "_programmes_v_version_outcomes_order_idx" ON "medwhole_cms"."_programmes_v_version_outcomes" USING btree ("_order");
  CREATE INDEX "_programmes_v_version_outcomes_parent_id_idx" ON "medwhole_cms"."_programmes_v_version_outcomes" USING btree ("_parent_id");
  CREATE INDEX "_programmes_v_parent_idx" ON "medwhole_cms"."_programmes_v" USING btree ("parent_id");
  CREATE INDEX "_programmes_v_version_version_slug_idx" ON "medwhole_cms"."_programmes_v" USING btree ("version_slug");
  CREATE INDEX "_programmes_v_version_version_image_idx" ON "medwhole_cms"."_programmes_v" USING btree ("version_image_id");
  CREATE INDEX "_programmes_v_version_version_source_sanity_id_idx" ON "medwhole_cms"."_programmes_v" USING btree ("version_source_sanity_id");
  CREATE INDEX "_programmes_v_version_version_updated_at_idx" ON "medwhole_cms"."_programmes_v" USING btree ("version_updated_at");
  CREATE INDEX "_programmes_v_version_version_created_at_idx" ON "medwhole_cms"."_programmes_v" USING btree ("version_created_at");
  CREATE INDEX "_programmes_v_version_version__status_idx" ON "medwhole_cms"."_programmes_v" USING btree ("version__status");
  CREATE INDEX "_programmes_v_created_at_idx" ON "medwhole_cms"."_programmes_v" USING btree ("created_at");
  CREATE INDEX "_programmes_v_updated_at_idx" ON "medwhole_cms"."_programmes_v" USING btree ("updated_at");
  CREATE INDEX "_programmes_v_latest_idx" ON "medwhole_cms"."_programmes_v" USING btree ("latest");
  CREATE INDEX "_programmes_v_autosave_idx" ON "medwhole_cms"."_programmes_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "events_slug_idx" ON "medwhole_cms"."events" USING btree ("slug");
  CREATE INDEX "events_image_idx" ON "medwhole_cms"."events" USING btree ("image_id");
  CREATE UNIQUE INDEX "events_source_sanity_id_idx" ON "medwhole_cms"."events" USING btree ("source_sanity_id");
  CREATE INDEX "events_updated_at_idx" ON "medwhole_cms"."events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "medwhole_cms"."events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "medwhole_cms"."events" USING btree ("_status");
  CREATE INDEX "events_rels_order_idx" ON "medwhole_cms"."events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "medwhole_cms"."events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "medwhole_cms"."events_rels" USING btree ("path");
  CREATE INDEX "events_rels_media_id_idx" ON "medwhole_cms"."events_rels" USING btree ("media_id");
  CREATE INDEX "_events_v_parent_idx" ON "medwhole_cms"."_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "medwhole_cms"."_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_image_idx" ON "medwhole_cms"."_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_version_source_sanity_id_idx" ON "medwhole_cms"."_events_v" USING btree ("version_source_sanity_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "medwhole_cms"."_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "medwhole_cms"."_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "medwhole_cms"."_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "medwhole_cms"."_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "medwhole_cms"."_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "medwhole_cms"."_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_autosave_idx" ON "medwhole_cms"."_events_v" USING btree ("autosave");
  CREATE INDEX "_events_v_rels_order_idx" ON "medwhole_cms"."_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "medwhole_cms"."_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "medwhole_cms"."_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_media_id_idx" ON "medwhole_cms"."_events_v_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "medwhole_cms"."news" USING btree ("slug");
  CREATE INDEX "news_image_idx" ON "medwhole_cms"."news" USING btree ("image_id");
  CREATE UNIQUE INDEX "news_source_sanity_id_idx" ON "medwhole_cms"."news" USING btree ("source_sanity_id");
  CREATE INDEX "news_updated_at_idx" ON "medwhole_cms"."news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "medwhole_cms"."news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "medwhole_cms"."news" USING btree ("_status");
  CREATE INDEX "_news_v_parent_idx" ON "medwhole_cms"."_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "medwhole_cms"."_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_image_idx" ON "medwhole_cms"."_news_v" USING btree ("version_image_id");
  CREATE INDEX "_news_v_version_version_source_sanity_id_idx" ON "medwhole_cms"."_news_v" USING btree ("version_source_sanity_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "medwhole_cms"."_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "medwhole_cms"."_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "medwhole_cms"."_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "medwhole_cms"."_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "medwhole_cms"."_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "medwhole_cms"."_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_autosave_idx" ON "medwhole_cms"."_news_v" USING btree ("autosave");
  CREATE INDEX "communities_sections_order_idx" ON "medwhole_cms"."communities_sections" USING btree ("_order");
  CREATE INDEX "communities_sections_parent_id_idx" ON "medwhole_cms"."communities_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "communities_slug_idx" ON "medwhole_cms"."communities" USING btree ("slug");
  CREATE INDEX "communities_image_idx" ON "medwhole_cms"."communities" USING btree ("image_id");
  CREATE UNIQUE INDEX "communities_source_sanity_id_idx" ON "medwhole_cms"."communities" USING btree ("source_sanity_id");
  CREATE INDEX "communities_updated_at_idx" ON "medwhole_cms"."communities" USING btree ("updated_at");
  CREATE INDEX "communities_created_at_idx" ON "medwhole_cms"."communities" USING btree ("created_at");
  CREATE INDEX "communities__status_idx" ON "medwhole_cms"."communities" USING btree ("_status");
  CREATE INDEX "_communities_v_version_sections_order_idx" ON "medwhole_cms"."_communities_v_version_sections" USING btree ("_order");
  CREATE INDEX "_communities_v_version_sections_parent_id_idx" ON "medwhole_cms"."_communities_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_communities_v_parent_idx" ON "medwhole_cms"."_communities_v" USING btree ("parent_id");
  CREATE INDEX "_communities_v_version_version_slug_idx" ON "medwhole_cms"."_communities_v" USING btree ("version_slug");
  CREATE INDEX "_communities_v_version_version_image_idx" ON "medwhole_cms"."_communities_v" USING btree ("version_image_id");
  CREATE INDEX "_communities_v_version_version_source_sanity_id_idx" ON "medwhole_cms"."_communities_v" USING btree ("version_source_sanity_id");
  CREATE INDEX "_communities_v_version_version_updated_at_idx" ON "medwhole_cms"."_communities_v" USING btree ("version_updated_at");
  CREATE INDEX "_communities_v_version_version_created_at_idx" ON "medwhole_cms"."_communities_v" USING btree ("version_created_at");
  CREATE INDEX "_communities_v_version_version__status_idx" ON "medwhole_cms"."_communities_v" USING btree ("version__status");
  CREATE INDEX "_communities_v_created_at_idx" ON "medwhole_cms"."_communities_v" USING btree ("created_at");
  CREATE INDEX "_communities_v_updated_at_idx" ON "medwhole_cms"."_communities_v" USING btree ("updated_at");
  CREATE INDEX "_communities_v_latest_idx" ON "medwhole_cms"."_communities_v" USING btree ("latest");
  CREATE INDEX "_communities_v_autosave_idx" ON "medwhole_cms"."_communities_v" USING btree ("autosave");
  CREATE INDEX "impact_stories_image_idx" ON "medwhole_cms"."impact_stories" USING btree ("image_id");
  CREATE UNIQUE INDEX "impact_stories_source_sanity_id_idx" ON "medwhole_cms"."impact_stories" USING btree ("source_sanity_id");
  CREATE INDEX "impact_stories_updated_at_idx" ON "medwhole_cms"."impact_stories" USING btree ("updated_at");
  CREATE INDEX "impact_stories_created_at_idx" ON "medwhole_cms"."impact_stories" USING btree ("created_at");
  CREATE INDEX "impact_stories__status_idx" ON "medwhole_cms"."impact_stories" USING btree ("_status");
  CREATE INDEX "_impact_stories_v_parent_idx" ON "medwhole_cms"."_impact_stories_v" USING btree ("parent_id");
  CREATE INDEX "_impact_stories_v_version_version_image_idx" ON "medwhole_cms"."_impact_stories_v" USING btree ("version_image_id");
  CREATE INDEX "_impact_stories_v_version_version_source_sanity_id_idx" ON "medwhole_cms"."_impact_stories_v" USING btree ("version_source_sanity_id");
  CREATE INDEX "_impact_stories_v_version_version_updated_at_idx" ON "medwhole_cms"."_impact_stories_v" USING btree ("version_updated_at");
  CREATE INDEX "_impact_stories_v_version_version_created_at_idx" ON "medwhole_cms"."_impact_stories_v" USING btree ("version_created_at");
  CREATE INDEX "_impact_stories_v_version_version__status_idx" ON "medwhole_cms"."_impact_stories_v" USING btree ("version__status");
  CREATE INDEX "_impact_stories_v_created_at_idx" ON "medwhole_cms"."_impact_stories_v" USING btree ("created_at");
  CREATE INDEX "_impact_stories_v_updated_at_idx" ON "medwhole_cms"."_impact_stories_v" USING btree ("updated_at");
  CREATE INDEX "_impact_stories_v_latest_idx" ON "medwhole_cms"."_impact_stories_v" USING btree ("latest");
  CREATE INDEX "_impact_stories_v_autosave_idx" ON "medwhole_cms"."_impact_stories_v" USING btree ("autosave");
  CREATE INDEX "team_members_image_idx" ON "medwhole_cms"."team_members" USING btree ("image_id");
  CREATE UNIQUE INDEX "team_members_source_sanity_id_idx" ON "medwhole_cms"."team_members" USING btree ("source_sanity_id");
  CREATE INDEX "team_members_updated_at_idx" ON "medwhole_cms"."team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "medwhole_cms"."team_members" USING btree ("created_at");
  CREATE INDEX "team_members__status_idx" ON "medwhole_cms"."team_members" USING btree ("_status");
  CREATE INDEX "_team_members_v_parent_idx" ON "medwhole_cms"."_team_members_v" USING btree ("parent_id");
  CREATE INDEX "_team_members_v_version_version_image_idx" ON "medwhole_cms"."_team_members_v" USING btree ("version_image_id");
  CREATE INDEX "_team_members_v_version_version_source_sanity_id_idx" ON "medwhole_cms"."_team_members_v" USING btree ("version_source_sanity_id");
  CREATE INDEX "_team_members_v_version_version_updated_at_idx" ON "medwhole_cms"."_team_members_v" USING btree ("version_updated_at");
  CREATE INDEX "_team_members_v_version_version_created_at_idx" ON "medwhole_cms"."_team_members_v" USING btree ("version_created_at");
  CREATE INDEX "_team_members_v_version_version__status_idx" ON "medwhole_cms"."_team_members_v" USING btree ("version__status");
  CREATE INDEX "_team_members_v_created_at_idx" ON "medwhole_cms"."_team_members_v" USING btree ("created_at");
  CREATE INDEX "_team_members_v_updated_at_idx" ON "medwhole_cms"."_team_members_v" USING btree ("updated_at");
  CREATE INDEX "_team_members_v_latest_idx" ON "medwhole_cms"."_team_members_v" USING btree ("latest");
  CREATE INDEX "_team_members_v_autosave_idx" ON "medwhole_cms"."_team_members_v" USING btree ("autosave");
  CREATE INDEX "partners_logo_idx" ON "medwhole_cms"."partners" USING btree ("logo_id");
  CREATE UNIQUE INDEX "partners_source_sanity_id_idx" ON "medwhole_cms"."partners" USING btree ("source_sanity_id");
  CREATE INDEX "partners_updated_at_idx" ON "medwhole_cms"."partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "medwhole_cms"."partners" USING btree ("created_at");
  CREATE INDEX "partners__status_idx" ON "medwhole_cms"."partners" USING btree ("_status");
  CREATE INDEX "_partners_v_parent_idx" ON "medwhole_cms"."_partners_v" USING btree ("parent_id");
  CREATE INDEX "_partners_v_version_version_logo_idx" ON "medwhole_cms"."_partners_v" USING btree ("version_logo_id");
  CREATE INDEX "_partners_v_version_version_source_sanity_id_idx" ON "medwhole_cms"."_partners_v" USING btree ("version_source_sanity_id");
  CREATE INDEX "_partners_v_version_version_updated_at_idx" ON "medwhole_cms"."_partners_v" USING btree ("version_updated_at");
  CREATE INDEX "_partners_v_version_version_created_at_idx" ON "medwhole_cms"."_partners_v" USING btree ("version_created_at");
  CREATE INDEX "_partners_v_version_version__status_idx" ON "medwhole_cms"."_partners_v" USING btree ("version__status");
  CREATE INDEX "_partners_v_created_at_idx" ON "medwhole_cms"."_partners_v" USING btree ("created_at");
  CREATE INDEX "_partners_v_updated_at_idx" ON "medwhole_cms"."_partners_v" USING btree ("updated_at");
  CREATE INDEX "_partners_v_latest_idx" ON "medwhole_cms"."_partners_v" USING btree ("latest");
  CREATE INDEX "_partners_v_autosave_idx" ON "medwhole_cms"."_partners_v" USING btree ("autosave");
  CREATE INDEX "resources_document_idx" ON "medwhole_cms"."resources" USING btree ("document_id");
  CREATE UNIQUE INDEX "resources_source_sanity_id_idx" ON "medwhole_cms"."resources" USING btree ("source_sanity_id");
  CREATE INDEX "resources_updated_at_idx" ON "medwhole_cms"."resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "medwhole_cms"."resources" USING btree ("created_at");
  CREATE INDEX "resources__status_idx" ON "medwhole_cms"."resources" USING btree ("_status");
  CREATE INDEX "_resources_v_parent_idx" ON "medwhole_cms"."_resources_v" USING btree ("parent_id");
  CREATE INDEX "_resources_v_version_version_document_idx" ON "medwhole_cms"."_resources_v" USING btree ("version_document_id");
  CREATE INDEX "_resources_v_version_version_source_sanity_id_idx" ON "medwhole_cms"."_resources_v" USING btree ("version_source_sanity_id");
  CREATE INDEX "_resources_v_version_version_updated_at_idx" ON "medwhole_cms"."_resources_v" USING btree ("version_updated_at");
  CREATE INDEX "_resources_v_version_version_created_at_idx" ON "medwhole_cms"."_resources_v" USING btree ("version_created_at");
  CREATE INDEX "_resources_v_version_version__status_idx" ON "medwhole_cms"."_resources_v" USING btree ("version__status");
  CREATE INDEX "_resources_v_created_at_idx" ON "medwhole_cms"."_resources_v" USING btree ("created_at");
  CREATE INDEX "_resources_v_updated_at_idx" ON "medwhole_cms"."_resources_v" USING btree ("updated_at");
  CREATE INDEX "_resources_v_latest_idx" ON "medwhole_cms"."_resources_v" USING btree ("latest");
  CREATE INDEX "_resources_v_autosave_idx" ON "medwhole_cms"."_resources_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "jobs_slug_idx" ON "medwhole_cms"."jobs" USING btree ("slug");
  CREATE UNIQUE INDEX "jobs_source_sanity_id_idx" ON "medwhole_cms"."jobs" USING btree ("source_sanity_id");
  CREATE INDEX "jobs_updated_at_idx" ON "medwhole_cms"."jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "medwhole_cms"."jobs" USING btree ("created_at");
  CREATE INDEX "jobs__status_idx" ON "medwhole_cms"."jobs" USING btree ("_status");
  CREATE INDEX "_jobs_v_parent_idx" ON "medwhole_cms"."_jobs_v" USING btree ("parent_id");
  CREATE INDEX "_jobs_v_version_version_slug_idx" ON "medwhole_cms"."_jobs_v" USING btree ("version_slug");
  CREATE INDEX "_jobs_v_version_version_source_sanity_id_idx" ON "medwhole_cms"."_jobs_v" USING btree ("version_source_sanity_id");
  CREATE INDEX "_jobs_v_version_version_updated_at_idx" ON "medwhole_cms"."_jobs_v" USING btree ("version_updated_at");
  CREATE INDEX "_jobs_v_version_version_created_at_idx" ON "medwhole_cms"."_jobs_v" USING btree ("version_created_at");
  CREATE INDEX "_jobs_v_version_version__status_idx" ON "medwhole_cms"."_jobs_v" USING btree ("version__status");
  CREATE INDEX "_jobs_v_created_at_idx" ON "medwhole_cms"."_jobs_v" USING btree ("created_at");
  CREATE INDEX "_jobs_v_updated_at_idx" ON "medwhole_cms"."_jobs_v" USING btree ("updated_at");
  CREATE INDEX "_jobs_v_latest_idx" ON "medwhole_cms"."_jobs_v" USING btree ("latest");
  CREATE INDEX "_jobs_v_autosave_idx" ON "medwhole_cms"."_jobs_v" USING btree ("autosave");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "medwhole_cms"."contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "medwhole_cms"."contact_submissions" USING btree ("created_at");
  CREATE INDEX "volunteer_applications_updated_at_idx" ON "medwhole_cms"."volunteer_applications" USING btree ("updated_at");
  CREATE INDEX "volunteer_applications_created_at_idx" ON "medwhole_cms"."volunteer_applications" USING btree ("created_at");
  CREATE INDEX "partnership_applications_updated_at_idx" ON "medwhole_cms"."partnership_applications" USING btree ("updated_at");
  CREATE INDEX "partnership_applications_created_at_idx" ON "medwhole_cms"."partnership_applications" USING btree ("created_at");
  CREATE UNIQUE INDEX "newsletter_subscribers_email_idx" ON "medwhole_cms"."newsletter_subscribers" USING btree ("email");
  CREATE INDEX "newsletter_subscribers_updated_at_idx" ON "medwhole_cms"."newsletter_subscribers" USING btree ("updated_at");
  CREATE INDEX "newsletter_subscribers_created_at_idx" ON "medwhole_cms"."newsletter_subscribers" USING btree ("created_at");
  CREATE INDEX "event_registrations_event_idx" ON "medwhole_cms"."event_registrations" USING btree ("event_id");
  CREATE INDEX "event_registrations_updated_at_idx" ON "medwhole_cms"."event_registrations" USING btree ("updated_at");
  CREATE INDEX "event_registrations_created_at_idx" ON "medwhole_cms"."event_registrations" USING btree ("created_at");
  CREATE UNIQUE INDEX "donation_intents_reference_idx" ON "medwhole_cms"."donation_intents" USING btree ("reference");
  CREATE INDEX "donation_intents_updated_at_idx" ON "medwhole_cms"."donation_intents" USING btree ("updated_at");
  CREATE INDEX "donation_intents_created_at_idx" ON "medwhole_cms"."donation_intents" USING btree ("created_at");
  CREATE UNIQUE INDEX "donation_payments_reference_idx" ON "medwhole_cms"."donation_payments" USING btree ("reference");
  CREATE INDEX "donation_payments_updated_at_idx" ON "medwhole_cms"."donation_payments" USING btree ("updated_at");
  CREATE INDEX "donation_payments_created_at_idx" ON "medwhole_cms"."donation_payments" USING btree ("created_at");
  CREATE INDEX "email_deliveries_updated_at_idx" ON "medwhole_cms"."email_deliveries" USING btree ("updated_at");
  CREATE INDEX "email_deliveries_created_at_idx" ON "medwhole_cms"."email_deliveries" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "medwhole_cms"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "medwhole_cms"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "medwhole_cms"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "medwhole_cms"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_administrators_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("administrators_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_programmes_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("programmes_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_communities_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("communities_id");
  CREATE INDEX "payload_locked_documents_rels_impact_stories_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("impact_stories_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("jobs_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_volunteer_applications_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("volunteer_applications_id");
  CREATE INDEX "payload_locked_documents_rels_partnership_applications_i_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("partnership_applications_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_subscribers_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("newsletter_subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_event_registrations_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("event_registrations_id");
  CREATE INDEX "payload_locked_documents_rels_donation_intents_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("donation_intents_id");
  CREATE INDEX "payload_locked_documents_rels_donation_payments_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("donation_payments_id");
  CREATE INDEX "payload_locked_documents_rels_email_deliveries_id_idx" ON "medwhole_cms"."payload_locked_documents_rels" USING btree ("email_deliveries_id");
  CREATE INDEX "payload_preferences_key_idx" ON "medwhole_cms"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "medwhole_cms"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "medwhole_cms"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "medwhole_cms"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "medwhole_cms"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "medwhole_cms"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_administrators_id_idx" ON "medwhole_cms"."payload_preferences_rels" USING btree ("administrators_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "medwhole_cms"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "medwhole_cms"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_impact_figures_order_idx" ON "medwhole_cms"."homepage_impact_figures" USING btree ("_order");
  CREATE INDEX "homepage_impact_figures_parent_id_idx" ON "medwhole_cms"."homepage_impact_figures" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_hero_video_idx" ON "medwhole_cms"."homepage" USING btree ("hero_video_id");
  CREATE INDEX "homepage_hero_hero_poster_idx" ON "medwhole_cms"."homepage" USING btree ("hero_poster_id");
  CREATE INDEX "homepage_featured_story_idx" ON "medwhole_cms"."homepage" USING btree ("featured_story_id");
  CREATE INDEX "homepage_community_feature_idx" ON "medwhole_cms"."homepage" USING btree ("community_feature_id");
  CREATE INDEX "homepage__status_idx" ON "medwhole_cms"."homepage" USING btree ("_status");
  CREATE INDEX "homepage_rels_order_idx" ON "medwhole_cms"."homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "medwhole_cms"."homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "medwhole_cms"."homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_programmes_id_idx" ON "medwhole_cms"."homepage_rels" USING btree ("programmes_id");
  CREATE INDEX "homepage_rels_media_id_idx" ON "medwhole_cms"."homepage_rels" USING btree ("media_id");
  CREATE INDEX "_homepage_v_version_impact_figures_order_idx" ON "medwhole_cms"."_homepage_v_version_impact_figures" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_impact_figures_parent_id_idx" ON "medwhole_cms"."_homepage_v_version_impact_figures" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_hero_version_hero_video_idx" ON "medwhole_cms"."_homepage_v" USING btree ("version_hero_video_id");
  CREATE INDEX "_homepage_v_version_hero_version_hero_poster_idx" ON "medwhole_cms"."_homepage_v" USING btree ("version_hero_poster_id");
  CREATE INDEX "_homepage_v_version_version_featured_story_idx" ON "medwhole_cms"."_homepage_v" USING btree ("version_featured_story_id");
  CREATE INDEX "_homepage_v_version_version_community_feature_idx" ON "medwhole_cms"."_homepage_v" USING btree ("version_community_feature_id");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "medwhole_cms"."_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "medwhole_cms"."_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "medwhole_cms"."_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_latest_idx" ON "medwhole_cms"."_homepage_v" USING btree ("latest");
  CREATE INDEX "_homepage_v_autosave_idx" ON "medwhole_cms"."_homepage_v" USING btree ("autosave");
  CREATE INDEX "_homepage_v_rels_order_idx" ON "medwhole_cms"."_homepage_v_rels" USING btree ("order");
  CREATE INDEX "_homepage_v_rels_parent_idx" ON "medwhole_cms"."_homepage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homepage_v_rels_path_idx" ON "medwhole_cms"."_homepage_v_rels" USING btree ("path");
  CREATE INDEX "_homepage_v_rels_programmes_id_idx" ON "medwhole_cms"."_homepage_v_rels" USING btree ("programmes_id");
  CREATE INDEX "_homepage_v_rels_media_id_idx" ON "medwhole_cms"."_homepage_v_rels" USING btree ("media_id");
  CREATE INDEX "site_settings_social_links_order_idx" ON "medwhole_cms"."site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "medwhole_cms"."site_settings_social_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "medwhole_cms"."administrators_roles" CASCADE;
  DROP TABLE "medwhole_cms"."administrators_sessions" CASCADE;
  DROP TABLE "medwhole_cms"."administrators" CASCADE;
  DROP TABLE "medwhole_cms"."media" CASCADE;
  DROP TABLE "medwhole_cms"."_media_v" CASCADE;
  DROP TABLE "medwhole_cms"."pages_blocks_manuscript" CASCADE;
  DROP TABLE "medwhole_cms"."pages_blocks_figures_items" CASCADE;
  DROP TABLE "medwhole_cms"."pages_blocks_figures" CASCADE;
  DROP TABLE "medwhole_cms"."pages_blocks_gallery_images" CASCADE;
  DROP TABLE "medwhole_cms"."pages_blocks_gallery" CASCADE;
  DROP TABLE "medwhole_cms"."pages_blocks_approved_content_section" CASCADE;
  DROP TABLE "medwhole_cms"."pages" CASCADE;
  DROP TABLE "medwhole_cms"."_pages_v_blocks_manuscript" CASCADE;
  DROP TABLE "medwhole_cms"."_pages_v_blocks_figures_items" CASCADE;
  DROP TABLE "medwhole_cms"."_pages_v_blocks_figures" CASCADE;
  DROP TABLE "medwhole_cms"."_pages_v_blocks_gallery_images" CASCADE;
  DROP TABLE "medwhole_cms"."_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "medwhole_cms"."_pages_v_blocks_approved_content_section" CASCADE;
  DROP TABLE "medwhole_cms"."_pages_v" CASCADE;
  DROP TABLE "medwhole_cms"."programmes_outcomes" CASCADE;
  DROP TABLE "medwhole_cms"."programmes" CASCADE;
  DROP TABLE "medwhole_cms"."_programmes_v_version_outcomes" CASCADE;
  DROP TABLE "medwhole_cms"."_programmes_v" CASCADE;
  DROP TABLE "medwhole_cms"."events" CASCADE;
  DROP TABLE "medwhole_cms"."events_rels" CASCADE;
  DROP TABLE "medwhole_cms"."_events_v" CASCADE;
  DROP TABLE "medwhole_cms"."_events_v_rels" CASCADE;
  DROP TABLE "medwhole_cms"."news" CASCADE;
  DROP TABLE "medwhole_cms"."_news_v" CASCADE;
  DROP TABLE "medwhole_cms"."communities_sections" CASCADE;
  DROP TABLE "medwhole_cms"."communities" CASCADE;
  DROP TABLE "medwhole_cms"."_communities_v_version_sections" CASCADE;
  DROP TABLE "medwhole_cms"."_communities_v" CASCADE;
  DROP TABLE "medwhole_cms"."impact_stories" CASCADE;
  DROP TABLE "medwhole_cms"."_impact_stories_v" CASCADE;
  DROP TABLE "medwhole_cms"."team_members" CASCADE;
  DROP TABLE "medwhole_cms"."_team_members_v" CASCADE;
  DROP TABLE "medwhole_cms"."partners" CASCADE;
  DROP TABLE "medwhole_cms"."_partners_v" CASCADE;
  DROP TABLE "medwhole_cms"."resources" CASCADE;
  DROP TABLE "medwhole_cms"."_resources_v" CASCADE;
  DROP TABLE "medwhole_cms"."jobs" CASCADE;
  DROP TABLE "medwhole_cms"."_jobs_v" CASCADE;
  DROP TABLE "medwhole_cms"."contact_submissions" CASCADE;
  DROP TABLE "medwhole_cms"."volunteer_applications" CASCADE;
  DROP TABLE "medwhole_cms"."partnership_applications" CASCADE;
  DROP TABLE "medwhole_cms"."newsletter_subscribers" CASCADE;
  DROP TABLE "medwhole_cms"."event_registrations" CASCADE;
  DROP TABLE "medwhole_cms"."donation_intents" CASCADE;
  DROP TABLE "medwhole_cms"."donation_payments" CASCADE;
  DROP TABLE "medwhole_cms"."email_deliveries" CASCADE;
  DROP TABLE "medwhole_cms"."payload_kv" CASCADE;
  DROP TABLE "medwhole_cms"."payload_locked_documents" CASCADE;
  DROP TABLE "medwhole_cms"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "medwhole_cms"."payload_preferences" CASCADE;
  DROP TABLE "medwhole_cms"."payload_preferences_rels" CASCADE;
  DROP TABLE "medwhole_cms"."payload_migrations" CASCADE;
  DROP TABLE "medwhole_cms"."homepage_impact_figures" CASCADE;
  DROP TABLE "medwhole_cms"."homepage" CASCADE;
  DROP TABLE "medwhole_cms"."homepage_rels" CASCADE;
  DROP TABLE "medwhole_cms"."_homepage_v_version_impact_figures" CASCADE;
  DROP TABLE "medwhole_cms"."_homepage_v" CASCADE;
  DROP TABLE "medwhole_cms"."_homepage_v_rels" CASCADE;
  DROP TABLE "medwhole_cms"."site_settings_social_links" CASCADE;
  DROP TABLE "medwhole_cms"."site_settings" CASCADE;
  DROP TYPE "medwhole_cms"."enum_administrators_roles";
  DROP TYPE "medwhole_cms"."enum_media_category";
  DROP TYPE "medwhole_cms"."enum_media_status";
  DROP TYPE "medwhole_cms"."enum__media_v_version_category";
  DROP TYPE "medwhole_cms"."enum__media_v_version_status";
  DROP TYPE "medwhole_cms"."enum_pages_status";
  DROP TYPE "medwhole_cms"."enum__pages_v_version_status";
  DROP TYPE "medwhole_cms"."enum_programmes_pillar";
  DROP TYPE "medwhole_cms"."enum_programmes_status";
  DROP TYPE "medwhole_cms"."enum__programmes_v_version_pillar";
  DROP TYPE "medwhole_cms"."enum__programmes_v_version_status";
  DROP TYPE "medwhole_cms"."enum_events_status";
  DROP TYPE "medwhole_cms"."enum__events_v_version_status";
  DROP TYPE "medwhole_cms"."enum_news_category";
  DROP TYPE "medwhole_cms"."enum_news_status";
  DROP TYPE "medwhole_cms"."enum__news_v_version_category";
  DROP TYPE "medwhole_cms"."enum__news_v_version_status";
  DROP TYPE "medwhole_cms"."enum_communities_status";
  DROP TYPE "medwhole_cms"."enum__communities_v_version_status";
  DROP TYPE "medwhole_cms"."enum_impact_stories_status";
  DROP TYPE "medwhole_cms"."enum__impact_stories_v_version_status";
  DROP TYPE "medwhole_cms"."enum_team_members_status";
  DROP TYPE "medwhole_cms"."enum__team_members_v_version_status";
  DROP TYPE "medwhole_cms"."enum_partners_status";
  DROP TYPE "medwhole_cms"."enum__partners_v_version_status";
  DROP TYPE "medwhole_cms"."enum_resources_status";
  DROP TYPE "medwhole_cms"."enum__resources_v_version_status";
  DROP TYPE "medwhole_cms"."enum_jobs_status";
  DROP TYPE "medwhole_cms"."enum__jobs_v_version_status";
  DROP TYPE "medwhole_cms"."enum_contact_submissions_status";
  DROP TYPE "medwhole_cms"."enum_volunteer_applications_status";
  DROP TYPE "medwhole_cms"."enum_partnership_applications_status";
  DROP TYPE "medwhole_cms"."enum_newsletter_subscribers_status";
  DROP TYPE "medwhole_cms"."enum_event_registrations_status";
  DROP TYPE "medwhole_cms"."enum_donation_intents_currency";
  DROP TYPE "medwhole_cms"."enum_donation_intents_frequency";
  DROP TYPE "medwhole_cms"."enum_donation_intents_status";
  DROP TYPE "medwhole_cms"."enum_donation_payments_status";
  DROP TYPE "medwhole_cms"."enum_email_deliveries_status";
  DROP TYPE "medwhole_cms"."enum_homepage_status";
  DROP TYPE "medwhole_cms"."enum__homepage_v_version_status";`)
}
