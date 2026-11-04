import type { CommunityStoryItem } from "@/components/community-dossier"

// These user-approved photographs illustrate MedWHOLE's wider work; their
// source files do not verify that they were taken in the named communities.
export const defaultCommunityStories: CommunityStoryItem[] = [
  {
    id: "gosa",
    number: "01",
    name: "Gosa",
    kicker: "Community Hub",
    location: "Gosa · Since 2021",
    headline: "Our first community, and where everything was built.",
    description:
      "Five years of a free Summer School programme, free health outreaches, and an innovation challenge run by Gosa's own young adults.",
    tags: ["MedWHOLE Academy", "450+ at Summer School", "Since 2021"],
    imageSrc: "/images/library/img-5581.webp",
    imageAlt: "Illustrative community photograph: a MedWHOLE facilitator addressing children beside a building",
    href: "/communities/gosa",
    ctaLabel: "Learn more",
  },
  {
    id: "kunyami",
    number: "02",
    name: "Kunyami",
    kicker: "Community Hub",
    location: "Kunyami · Since Feb 2026",
    headline: "A farming community of more than three thousand, with no health facility of its own.",
    description:
      "In one year we opened a weekly club, a summer school and a skills cohort here.",
    tags: ["Health outreach", "Summer School", "ComPart"],
    imageSrc: "/images/library/img-6009.webp",
    imageAlt: "Illustrative community photograph: a facilitator and children raising their hands outdoors",
    href: "/communities/kunyami",
    ctaLabel: "Learn more",
  },
  {
    id: "toge",
    number: "03",
    name: "Toge",
    kicker: "Community Hub",
    location: "Toge · Since Jun 2026",
    headline: "",
    description:
      "Around four thousand people, a few primary schools, no secondary school and no hospital. We began with school health in June 2026 and are working out what comes next with the people who live there.",
    tags: ["School health", "196 pupils screened", "Since June 2026"],
    imageSrc: "/images/library/mg-9201.webp",
    imageAlt: "Illustrative outreach photograph: a MedWHOLE team member attending to a family at a table",
    href: "/communities/toge",
    ctaLabel: "Learn more",
  },
  {
    id: "corridor-ahead",
    number: "04",
    name: "And other locations",
    kicker: "Expansion & Opportunity",
    location: "Gosa, Kunyami and Toge",
    headline: "",
    description:
      "Gosa, Kunyami and Toge are where we started. We have begun work in other communities, and each one gets a page here once there is enough behind it to say something true.",
    tags: ["Community-led", "Long-term presence", "Partner with us"],
    imageSrc: "/images/library/dsc08053.webp",
    imageAlt: "Illustrative service photograph: two MedWHOLE team members carrying a box of supplies",
    href: "/partner",
    ctaLabel: "Talk to us about a new community",
    isExpansion: true,
  },
]
