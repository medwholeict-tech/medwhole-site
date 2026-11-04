export type PageVisual = {
  src: string
  alt: string
  objectPosition?: string
}

export type PageVisualSystem = {
  layout: "overview" | "health" | "literacy" | "empowerment" | "programme" | "event"
  hero: PageVisual
  story: PageVisual[]
}

const healthHero: PageVisual = {
  src: "/images/library/mg-9074-copy.webp",
  alt: "A MedWHOLE health worker examining a child's upper arm",
  objectPosition: "center",
}

const healthConsultation: PageVisual = {
  src: "/images/library/mg-9136-copy.webp",
  alt: "A health worker leaning towards a child during a consultation",
  objectPosition: "center",
}

const healthFieldPhoto: PageVisual = {
  src: "/images/library/mg-9253.webp",
  alt: "Outreach team members organising medicine and supplies on a table",
  objectPosition: "center 45%",
}

const literacyHero: PageVisual = {
  src: "/images/field-notes/literacy-anniversary.jpg",
  alt: "Children and MedWHOLE volunteers celebrating a literacy programme milestone",
  objectPosition: "center 42%",
}

const literacyLearning: PageVisual = {
  src: "/images/field-notes/literacy-learning.jpg",
  alt: "Children holding learning materials during a MedWHOLE programme",
  objectPosition: "center",
}

const summerSchool: PageVisual = {
  src: "/images/field-notes/summer-school.jpg",
  alt: "A teacher and children at a MedWHOLE summer school",
  objectPosition: "center",
}

const empowermentHero: PageVisual = {
  src: "/images/library/dsc08737.webp",
  alt: "Participants working at sewing machines during a practical training session",
  objectPosition: "center",
}

const empowermentOutcomes: PageVisual = {
  src: "/images/library/dsc09359.webp",
  alt: "Participants watching a hands-on screen-printing demonstration",
  objectPosition: "center",
}

const overviewHero: PageVisual = {
  src: "/IMG-20260805-WA0009.jpg",
  alt: "A MedWHOLE volunteer with children in the community",
  objectPosition: "center 45%",
}

function subjectForPath(path: string) {
  // The new library does not verify event dates or locations. Keep the
  // established event imagery rather than implying these are those events.
  if (path.startsWith("/events/") && path.includes("health")) {
    return {
      hero: { src: "/IMG-20260805-WA0003.jpg", alt: "A MedWHOLE clinician caring for a baby during a community health outreach" },
      story: [
        { src: "/images/field-notes/health-consultation.jpg", alt: "A MedWHOLE health worker consulting with a mother and child" },
        { src: "/images/field-notes/health-outreach.jpg", alt: "MedWHOLE clinicians serving community members during a health outreach" },
      ],
    }
  }
  if (path.startsWith("/events/") && (path.includes("compart") || path.includes("cic-"))) {
    return {
      hero: { src: "/images/field-notes/empowerment-training.jpg", alt: "Community participants learning practical skills with MedWHOLE facilitators" },
      story: [{ src: "/images/field-notes/empowerment-outcomes.jpg", alt: "Participants presenting work during a MedWHOLE empowerment programme" }],
    }
  }
  if (path.startsWith("/events/") && !/literacy|good-news|summer-school/.test(path)) {
    return {
      hero: { src: "/IMG-20260805-WA0003.jpg", alt: "A MedWHOLE clinician caring for a baby during a community health outreach" },
      story: [
        literacyHero,
        { src: "/images/field-notes/empowerment-training.jpg", alt: "Community participants learning practical skills with MedWHOLE facilitators" },
        { src: "/images/field-notes/health-consultation.jpg", alt: "A MedWHOLE health worker consulting with a mother and child" },
      ],
    }
  }
  if (path.includes("health") || path.includes("kunyami-health")) {
    return { hero: healthHero, story: [healthConsultation, healthFieldPhoto] }
  }

  if (
    path.includes("literacy") ||
    path.includes("good-news") ||
    path.includes("summer-school")
  ) {
    const hero = path.includes("summer-school") ? summerSchool : literacyHero
    return { hero, story: [literacyLearning, literacyHero, summerSchool] }
  }

  if (path.includes("empowerment") || path.includes("compart") || path.includes("cic-")) {
    return { hero: empowermentHero, story: [empowermentOutcomes, empowermentHero] }
  }

  return { hero: healthHero, story: [literacyHero, empowermentHero, healthConsultation] }
}

export function getPageVisualSystem(path: string): PageVisualSystem {
  const visual = path === "/our-work"
    ? { hero: overviewHero, story: [healthConsultation, literacyHero, empowermentHero] }
    : subjectForPath(path)
  const segmentCount = path.split("/").filter(Boolean).length

  return {
    ...visual,
    layout:
      path === "/our-work"
        ? "overview"
        : path === "/our-work/health"
          ? "health"
          : path === "/our-work/literacy"
            ? "literacy"
            : path === "/our-work/empowerment"
              ? "empowerment"
              : path.startsWith("/events/")
                ? "event"
                : segmentCount > 2
                  ? "programme"
                  : "overview",
  }
}
