export interface SocialFeedItem {
  id: string
  platform: "youtube" | "instagram" | "news"
  title: string
  url: string
  publishedAt: string
  thumbnailUrl: string
  description?: string
  category?: string
  author?: string
}

const YOUTUBE_CHANNEL_ID = "UCE4pi2L2ztpUVv9D4cCSIYg"
const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`

/**
 * Parses the official YouTube Atom XML feed into normalized items.
 */
function parseYouTubeXml(xml: string): SocialFeedItem[] {
  const items: SocialFeedItem[] = []
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
  let match: RegExpExecArray | null

  while ((match = entryRegex.exec(xml)) !== null) {
    const entryXml = match[1]
    const id = (entryXml.match(/<yt:videoId>(.*?)<\/yt:videoId>/) || [])[1] || ""
    const title = (entryXml.match(/<title>(.*?)<\/title>/) || [])[1] || ""
    const link =
      (entryXml.match(/<link rel=["']alternate["'] href=["'](.*?)["']/) || [])[1] ||
      (id ? `https://www.youtube.com/watch?v=${id}` : "")
    const published = (entryXml.match(/<published>(.*?)<\/published>/) || [])[1] || ""
    const thumbnail =
      (entryXml.match(/<media:thumbnail url=["'](.*?)["']/) || [])[1] ||
      (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "")
    const description =
      (entryXml.match(/<media:description>([\s\S]*?)<\/media:description>/) || [])[1] || ""

    if (id && title) {
      // Decode HTML entities
      const cleanTitle = title
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")

      items.push({
        id: `yt-${id}`,
        platform: "youtube",
        title: cleanTitle,
        url: link,
        publishedAt: published,
        thumbnailUrl: thumbnail,
        description: description.slice(0, 180).trim(),
        category: "Video",
        author: "MedWHOLE Alliance",
      })
    }
  }

  return items
}

/**
 * Fetches latest YouTube videos from the official channel RSS feed.
 */
export async function getYouTubeFeed(limit = 8): Promise<SocialFeedItem[]> {
  try {
    const res = await fetch(YOUTUBE_FEED_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        "User-Agent": "MedWHOLE-Website/1.0 (+https://medwhole.org)",
      },
    })

    if (!res.ok) {
      console.warn(`YouTube feed responded with status ${res.status}`)
      return getFallbackYouTubeItems().slice(0, limit)
    }

    const xml = await res.text()
    const parsed = parseYouTubeXml(xml)
    return parsed.length > 0 ? parsed.slice(0, limit) : getFallbackYouTubeItems().slice(0, limit)
  } catch (error) {
    console.warn("Failed to fetch YouTube feed:", error)
    return getFallbackYouTubeItems().slice(0, limit)
  }
}

/**
 * Fetches Instagram posts (via official Meta Graph API if configured, or curated field dispatches).
 */
export async function getInstagramFeed(limit = 6): Promise<SocialFeedItem[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN

  if (token) {
    try {
      const res = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`,
        { next: { revalidate: 3600 } }
      )
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data?.data)) {
          return data.data.slice(0, limit).map((post: any) => ({
            id: `ig-${post.id}`,
            platform: "instagram",
            title: post.caption ? post.caption.slice(0, 80) + "..." : "Field Update from MedWHOLE",
            url: post.permalink || "https://www.instagram.com/medwholealliance/",
            publishedAt: post.timestamp || new Date().toISOString(),
            thumbnailUrl: post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url,
            description: post.caption?.slice(0, 160) || "",
            category: "Instagram",
            author: "@medwholealliance",
          }))
        }
      }
    } catch (err) {
      console.warn("Error fetching Instagram Graph API:", err)
    }
  }

  // Curated field dispatches matching MedWHOLE official Instagram feed
  return getCuratedInstagramItems().slice(0, limit)
}

/**
 * Combines YouTube and Instagram items, sorted chronologically.
 */
export async function getCombinedSocialFeed(limit = 8): Promise<SocialFeedItem[]> {
  const [youtube, instagram] = await Promise.all([getYouTubeFeed(limit), getInstagramFeed(limit)])

  const combined = [...youtube, ...instagram].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return combined.slice(0, limit)
}

function getFallbackYouTubeItems(): SocialFeedItem[] {
  return [
    {
      id: "yt-QG7XWlVGBBk",
      platform: "youtube",
      title: "Meet our 2026 Summer School Skill Acquisition Students",
      url: "https://www.youtube.com/shorts/QG7XWlVGBBk",
      publishedAt: "2026-08-18T14:52:05+00:00",
      thumbnailUrl: "https://i2.ytimg.com/vi/QG7XWlVGBBk/hqdefault.jpg",
      description: "Beyond the classroom, we’re building skills for life. At MedWHOLE Summer School in Gosa and Kunyami, learning goes beyond reading, writing and mathematics.",
      category: "Video",
      author: "MedWHOLE Alliance",
    },
    {
      id: "yt-IfOnFOXxjwo",
      platform: "youtube",
      title: "MedWHOLE Academy Summer School",
      url: "https://www.youtube.com/shorts/IfOnFOXxjwo",
      publishedAt: "2026-08-03T17:38:10+00:00",
      thumbnailUrl: "https://i2.ytimg.com/vi/IfOnFOXxjwo/hqdefault.jpg",
      description: "The holiday has started, but learning doesn’t have to stop. Summer School brings the joy of learning back to Gosa with books, laughter, and foundational skills.",
      category: "Video",
      author: "MedWHOLE Alliance",
    },
    {
      id: "yt-rVlCN3Ju18s",
      platform: "youtube",
      title: "Toge Primary School Outreach",
      url: "https://www.youtube.com/watch?v=rVlCN3Ju18s",
      publishedAt: "2026-07-23T10:33:55+00:00",
      thumbnailUrl: "https://i3.ytimg.com/vi/rVlCN3Ju18s/hqdefault.jpg",
      description: "Educational and health outreach in Toge community along the Airport Road corridor, FCT Abuja.",
      category: "Video",
      author: "MedWHOLE Alliance",
    },
  ]
}

function getCuratedInstagramItems(): SocialFeedItem[] {
  return [
    {
      id: "ig-summer-school-teachers",
      platform: "instagram",
      title: "Mathematics & Foundational Skills at MedWHOLE Summer School 2026",
      url: "https://www.instagram.com/medwholealliance/",
      publishedAt: "2026-08-26T10:00:00+00:00",
      thumbnailUrl: "/IMG-20260805-WA0001.jpg",
      description: "Our volunteer teachers delivering tuition-free academic instruction in mathematics, English, and civic values for secondary students in Gosa.",
      category: "Literacy",
      author: "@medwholealliance",
    },
    {
      id: "ig-pediatric-outreach",
      platform: "instagram",
      title: "Essential Medicines & Pediatric Care at Gosa Community Outreach",
      url: "https://www.instagram.com/medwholealliance/",
      publishedAt: "2026-08-24T14:30:00+00:00",
      thumbnailUrl: "/IMG-20260805-WA0002.jpg",
      description: "Providing vital antimalarials, vitamins, and pediatric consultations directly to families along the Airport Road corridor.",
      category: "Health",
      author: "@medwholealliance",
    },
    {
      id: "ig-infant-consultation",
      platform: "instagram",
      title: "One-on-One Maternal & Infant Health Assessments",
      url: "https://www.instagram.com/medwholealliance/",
      publishedAt: "2026-08-20T09:15:00+00:00",
      thumbnailUrl: "/IMG-20260805-WA0003.jpg",
      description: "Clinical precision with compassionate care: our doctors conducting infant health screenings and maternal education.",
      category: "Health",
      author: "@medwholealliance",
    },
    {
      id: "ig-girls-education",
      platform: "instagram",
      title: "Building Confidence and Literacy for Young Girls in Kunyami",
      url: "https://www.instagram.com/medwholealliance/",
      publishedAt: "2026-08-16T11:00:00+00:00",
      thumbnailUrl: "/IMG-20260805-WA0005.jpg",
      description: "Mentorship and encouragement for primary students, creating safe learning spaces where every girl can thrive.",
      category: "Literacy",
      author: "@medwholealliance",
    },
    {
      id: "ig-medical-briefing",
      platform: "instagram",
      title: "Clinical Team Morning Briefing Before Community Outreaches",
      url: "https://www.instagram.com/medwholealliance/",
      publishedAt: "2026-08-12T08:00:00+00:00",
      thumbnailUrl: "/IMG-20260805-WA0006.jpg",
      description: "Coordinating clinical protocols, triage priorities, and referral pathways before opening clinic doors in rural FCT.",
      category: "Health",
      author: "@medwholealliance",
    },
    {
      id: "ig-medical-logistics",
      platform: "instagram",
      title: "Delivering Quality Pharmaceuticals Directly to the Field",
      url: "https://www.instagram.com/medwholealliance/",
      publishedAt: "2026-08-08T13:00:00+00:00",
      thumbnailUrl: "/IMG-20260805-WA0007.jpg",
      description: "Uncompromising standards: delivering NAFDAC-certified medications and medical supplies directly to point-of-need.",
      category: "Health",
      author: "@medwholealliance",
    },
    {
      id: "ig-community-partnership",
      platform: "instagram",
      title: "Walking Alongside Community Elders and Local Leaders",
      url: "https://www.instagram.com/medwholealliance/",
      publishedAt: "2026-08-04T15:00:00+00:00",
      thumbnailUrl: "/IMG-20260805-WA0009.jpg",
      description: "Sustainable community transformation begins with deep listening, respectful partnership, and shared ownership.",
      category: "Community",
      author: "@medwholealliance",
    },
    {
      id: "ig-youth-cohort",
      platform: "instagram",
      title: "Our 2026 Youth Fellowship and Leadership Cohort",
      url: "https://www.instagram.com/medwholealliance/",
      publishedAt: "2026-07-28T16:00:00+00:00",
      thumbnailUrl: "/IMG-20260805-WA0010.jpg",
      description: "Discipling and equipping the next generation of community leaders, mentors, and changemakers in Abuja.",
      category: "Empowerment",
      author: "@medwholealliance",
    },
    {
      id: "ig-mission-force",
      platform: "instagram",
      title: "The MedWHOLE Mission Force in Action",
      url: "https://www.instagram.com/medwholealliance/",
      publishedAt: "2026-07-20T12:00:00+00:00",
      thumbnailUrl: "/IMG-20260805-WA0011.jpg",
      description: "Doctors, teachers, students, and professionals united by a shared conviction: Whole People Create Lasting Impact.",
      category: "Mission",
      author: "@medwholealliance",
    },
    {
      id: "ig-kunyami-summer-school",
      platform: "instagram",
      title: "Joyful Learning at Kunyami Summer Learning Centre",
      url: "https://www.instagram.com/medwholealliance/",
      publishedAt: "2026-07-15T10:30:00+00:00",
      thumbnailUrl: "/IMG-20260805-WA0000.jpg",
      description: "Classrooms filled with curiosity, peer mentorship, and foundational learning throughout the summer break.",
      category: "Literacy",
      author: "@medwholealliance",
    },
    {
      id: "ig-digital-skills",
      platform: "instagram",
      title: "Practical Digital and Vocational Skills for Young Adults",
      url: "https://www.instagram.com/medwholealliance/",
      publishedAt: "2026-06-25T14:00:00+00:00",
      thumbnailUrl: "/images/field-notes/empowerment-training.jpg",
      description: "Empowering youth with market-relevant digital literacy and creative skills to unlock sustainable livelihoods.",
      category: "Empowerment",
      author: "@medwholealliance",
    },
    {
      id: "ig-summer-school-scholars",
      platform: "instagram",
      title: "Celebrating Character and Academic Growth in Gosa",
      url: "https://www.instagram.com/medwholealliance/",
      publishedAt: "2026-06-10T11:00:00+00:00",
      thumbnailUrl: "/images/field-notes/summer-school.jpg",
      description: "Honoring students who demonstrated exceptional commitment, character, and scholastic diligence.",
      category: "Literacy",
      author: "@medwholealliance",
    },
  ]
}
