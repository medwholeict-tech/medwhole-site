import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_gLyMUJxfA32P@ep-muddy-sun-b4hyyv75-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

async function main() {
  console.log('Finalizing globals seeding in medwhole_cms...');

  const existingHomepageV = await sql`SELECT id FROM medwhole_cms._homepage_v LIMIT 1`;
  if (existingHomepageV.length === 0) {
    await sql`
      INSERT INTO medwhole_cms._homepage_v (
        id, version_hero_heading, version_hero_description,
        version_hero_primary_cta_label, version_hero_primary_cta_href,
        version_hero_secondary_cta_label, version_hero_secondary_cta_href,
        version__status, latest, autosave, created_at, updated_at
      ) VALUES (
        1,
        'Whole People. Lasting Impact.',
        'A Christ-centred development organisation advancing Health, Literacy, and Empowerment across underserved communities.',
        'Our Programmes', '/programmes',
        'Get Involved', '/volunteer',
        'published', true, false, NOW(), NOW()
      )
    `;
    console.log('Seeded _homepage_v');
  }

  // Check counts
  const counts = await Promise.all([
    sql`SELECT count(*)::int as n FROM medwhole_cms.pages WHERE _status = 'published'`,
    sql`SELECT count(*)::int as n FROM medwhole_cms.programmes WHERE _status = 'published'`,
    sql`SELECT count(*)::int as n FROM medwhole_cms.events WHERE _status = 'published'`,
    sql`SELECT count(*)::int as n FROM medwhole_cms.news WHERE _status = 'published'`,
    sql`SELECT count(*)::int as n FROM medwhole_cms.media WHERE _status = 'published'`,
    sql`SELECT count(*)::int as n FROM medwhole_cms.site_settings`,
    sql`SELECT count(*)::int as n FROM medwhole_cms.navigation`,
    sql`SELECT count(*)::int as n FROM medwhole_cms.homepage WHERE _status = 'published'`,
  ]);

  console.log({
    publishedPages: counts[0][0].n,
    publishedProgrammes: counts[1][0].n,
    publishedEvents: counts[2][0].n,
    publishedNews: counts[3][0].n,
    publishedMedia: counts[4][0].n,
    siteSettingsRows: counts[5][0].n,
    navigationRows: counts[6][0].n,
    homepagePublishedRows: counts[7][0].n,
  });
}

main().catch(console.error);
