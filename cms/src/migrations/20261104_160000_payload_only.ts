import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const editorial = ['programmes', 'events', 'news', 'communities', 'impact_stories', 'team_members', 'partners', 'resources', 'jobs']
  const operational = ['contact_submissions', 'volunteer_applications', 'partnership_applications', 'newsletter_subscribers', 'event_registrations', 'donation_intents', 'donation_payments', 'email_deliveries']
  // Keep the previous columns for rollback compatibility; all current code uses sourceId.
  for (const table of ['media', ...editorial]) {
    await db.execute(sql.raw(`ALTER TABLE medwhole_cms.${table} ADD COLUMN IF NOT EXISTS source_id varchar; UPDATE medwhole_cms.${table} SET source_id=source_sanity_id WHERE source_id IS NULL; CREATE UNIQUE INDEX IF NOT EXISTS ${table}_source_id_idx ON medwhole_cms.${table}(source_id); ALTER TABLE medwhole_cms._${table}_v ADD COLUMN IF NOT EXISTS version_source_id varchar; UPDATE medwhole_cms._${table}_v SET version_source_id=version_source_sanity_id WHERE version_source_id IS NULL; CREATE INDEX IF NOT EXISTS _${table}_v_version_version_source_id_idx ON medwhole_cms._${table}_v(version_source_id);`))
  }
  for (const table of editorial) {
    await db.execute(sql.raw(`ALTER TABLE medwhole_cms.${table} ADD COLUMN IF NOT EXISTS details jsonb; ALTER TABLE medwhole_cms.${table} ADD COLUMN IF NOT EXISTS content jsonb; ALTER TABLE medwhole_cms._${table}_v ADD COLUMN IF NOT EXISTS version_details jsonb; ALTER TABLE medwhole_cms._${table}_v ADD COLUMN IF NOT EXISTS version_content jsonb;`))
  }
  for (const table of operational) {
    await db.execute(sql.raw(`ALTER TABLE medwhole_cms.${table} ADD COLUMN IF NOT EXISTS external_id varchar; ALTER TABLE medwhole_cms.${table} ADD COLUMN IF NOT EXISTS details jsonb; CREATE UNIQUE INDEX IF NOT EXISTS ${table}_external_id_idx ON medwhole_cms.${table}(external_id);`))
  }
  await db.execute(sql`
    ALTER TABLE medwhole_cms.newsletter_subscribers ADD COLUMN IF NOT EXISTS interests jsonb;
    ALTER TABLE medwhole_cms.event_registrations ALTER COLUMN full_name DROP NOT NULL;
    ALTER TABLE medwhole_cms.event_registrations ALTER COLUMN email DROP NOT NULL;
    ALTER TABLE medwhole_cms.event_registrations ALTER COLUMN event_id DROP NOT NULL;
    ALTER TABLE medwhole_cms.donation_intents ALTER COLUMN email DROP NOT NULL;
    ALTER TABLE medwhole_cms.donation_intents ADD COLUMN IF NOT EXISTS country varchar;
    ALTER TABLE medwhole_cms.donation_intents ADD COLUMN IF NOT EXISTS designation varchar;
    ALTER TABLE medwhole_cms.donation_intents ADD COLUMN IF NOT EXISTS expected_transfer_date timestamptz;
    ALTER TABLE medwhole_cms.donation_intents ADD COLUMN IF NOT EXISTS email_status varchar;
    ALTER TABLE medwhole_cms.donation_payments ADD COLUMN IF NOT EXISTS full_name varchar;
    ALTER TABLE medwhole_cms.donation_payments ADD COLUMN IF NOT EXISTS email varchar;
    ALTER TABLE medwhole_cms.donation_payments ADD COLUMN IF NOT EXISTS frequency varchar;
    ALTER TABLE medwhole_cms.donation_payments ADD COLUMN IF NOT EXISTS designation varchar;
    ALTER TABLE medwhole_cms.donation_payments ADD COLUMN IF NOT EXISTS community varchar;
    ALTER TABLE medwhole_cms.donation_payments ADD COLUMN IF NOT EXISTS plan_code varchar;
    CREATE INDEX IF NOT EXISTS donation_payments_plan_code_idx ON medwhole_cms.donation_payments(plan_code);
  `)
  for (const [type, values] of Object.entries({
    enum_newsletter_subscribers_status: ['active', 'unsubscribed'],
    enum_donation_intents_status: ['instructions-sent'],
    enum_donation_payments_status: ['pending', 'paid', 'failed', 'cancelled'],
  })) {
    for (const value of values) await db.execute(sql.raw(`ALTER TYPE medwhole_cms.${type} ADD VALUE IF NOT EXISTS '${value}';`))
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  throw new Error('This additive migration retains imported records. Restore a reviewed backup instead of dropping migrated data.')
}
