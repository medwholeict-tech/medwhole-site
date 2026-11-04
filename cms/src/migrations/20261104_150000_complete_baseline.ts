import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Complete schema additions previously provisioned through development pushes.
// IF NOT EXISTS preserves existing production content and navigation.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
CREATE TABLE IF NOT EXISTS "medwhole_cms"."navigation" (
  "id" serial PRIMARY KEY NOT NULL,
  "header_cta_label" varchar DEFAULT 'Give',
  "header_cta_href" varchar DEFAULT '/give',
  "updated_at" timestamp(3) with time zone,
  "created_at" timestamp(3) with time zone
);
CREATE TABLE IF NOT EXISTS "medwhole_cms"."navigation_header_groups" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "label" varchar NOT NULL,
  "href" varchar NOT NULL,
  "description" varchar,
  CONSTRAINT "navigation_header_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."navigation" ("id") ON DELETE cascade ON UPDATE no action
);
CREATE INDEX IF NOT EXISTS "navigation_header_groups_order_idx" ON "medwhole_cms"."navigation_header_groups" ("_order");
CREATE INDEX IF NOT EXISTS "navigation_header_groups_parent_id_idx" ON "medwhole_cms"."navigation_header_groups" ("_parent_id");
CREATE TABLE IF NOT EXISTS "medwhole_cms"."navigation_header_groups_items" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "label" varchar NOT NULL,
  "href" varchar NOT NULL,
  "description" varchar,
  CONSTRAINT "navigation_header_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."navigation_header_groups" ("id") ON DELETE cascade ON UPDATE no action
);
CREATE INDEX IF NOT EXISTS "navigation_header_groups_items_order_idx" ON "medwhole_cms"."navigation_header_groups_items" ("_order");
CREATE INDEX IF NOT EXISTS "navigation_header_groups_items_parent_id_idx" ON "medwhole_cms"."navigation_header_groups_items" ("_parent_id");
CREATE TABLE IF NOT EXISTS "medwhole_cms"."navigation_footer_navigation" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "label" varchar NOT NULL,
  "href" varchar NOT NULL,
  "description" varchar,
  CONSTRAINT "navigation_footer_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."navigation" ("id") ON DELETE cascade ON UPDATE no action
);
CREATE INDEX IF NOT EXISTS "navigation_footer_navigation_order_idx" ON "medwhole_cms"."navigation_footer_navigation" ("_order");
CREATE INDEX IF NOT EXISTS "navigation_footer_navigation_parent_id_idx" ON "medwhole_cms"."navigation_footer_navigation" ("_parent_id");
CREATE TABLE IF NOT EXISTS "medwhole_cms"."navigation_legal_navigation" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "label" varchar NOT NULL,
  "href" varchar NOT NULL,
  "description" varchar,
  CONSTRAINT "navigation_legal_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "medwhole_cms"."navigation" ("id") ON DELETE cascade ON UPDATE no action
);
CREATE INDEX IF NOT EXISTS "navigation_legal_navigation_order_idx" ON "medwhole_cms"."navigation_legal_navigation" ("_order");
CREATE INDEX IF NOT EXISTS "navigation_legal_navigation_parent_id_idx" ON "medwhole_cms"."navigation_legal_navigation" ("_parent_id");
ALTER TABLE medwhole_cms."media" ADD COLUMN IF NOT EXISTS "prefix" varchar;
ALTER TABLE medwhole_cms."media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;
ALTER TABLE medwhole_cms."_media_v" ADD COLUMN IF NOT EXISTS "version_prefix" varchar;
ALTER TABLE medwhole_cms."_media_v" ADD COLUMN IF NOT EXISTS "version__objectkey" varchar;
ALTER TABLE medwhole_cms."pages" ADD COLUMN IF NOT EXISTS "page_content" jsonb;
ALTER TABLE medwhole_cms."_pages_v" ADD COLUMN IF NOT EXISTS "version_page_content" jsonb;
ALTER TABLE medwhole_cms."homepage" ADD COLUMN IF NOT EXISTS "content" jsonb;
ALTER TABLE medwhole_cms."_homepage_v" ADD COLUMN IF NOT EXISTS "version_content" jsonb;
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  throw new Error('Restore a reviewed backup instead of dropping existing navigation or media metadata.')
}
