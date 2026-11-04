import { notFound } from "next/navigation"
import { EditorialCopyPage } from "@/components/editorial-copy-page"
import type { WebsiteCopyPage } from "@/lib/website-copy"
import { generateApprovedSEO } from "@/lib/approved-seo"
import { getPayloadWebsitePage } from "@/lib/cms/content"

const communityPages: Record<string, WebsiteCopyPage> = {
  gosa: {
    path: "/communities/gosa",
    pageTitle: "Gosa",
    metaDescription: "MedWHOLE's first community. Free education, health outreaches and a community innovation challenge in Gosa, Kyami District, AMAC, FCT Abuja, since 2021.",
    eyebrow: "Where we work",
    heading: "Gosa",
    subheading: "Our first community, and where everything was built. ~4,000 people · Since 2021 · Kyami District, AMAC, FCT Abuja",
    sections: [
      { heading: "The community", paragraphs: ["Gosa is a farming settlement of around four thousand people on the Nnamdi Azikiwe Airport Road, in Kyami District, AMAC. It sits at the edge of a fast-growing part of Abuja, close to major infrastructure, and the interior streets have very little of it.", "When we started working here in 2021, quality healthcare and schooling were hard to reach, housing was poor, potable water was limited, and there was almost no waste collection — including along the stream much of the community draws from.", "Five years on, Gosa is where most of what MedWHOLE does was first built and proved it worked."] },
      { heading: "Literacy", paragraphs: ["MedWHOLE Academy began here, with twenty-one children in a church hall in 2021.", "A Good News Club and a reading club now meet weekly, giving children somewhere to read and ask questions outside school hours. Every August, free Summer School runs for the whole month: mathematics, English and reading each morning, and a skills lab where children learn a trade they can actually use. In 2026 it taught more than four hundred and fifty."], figures: [{ value: "21", label: "children in 2021" }, { value: "450+", label: "at Summer School 2026" }, { value: "190", label: "at Good News Club each week" }, { value: "50+", label: "children returned to school" }], buttons: [{ label: "MedWHOLE Academy", href: "/academy" }] },
      { heading: "Health", paragraphs: ["We run free outreaches in Gosa, treat what can be treated on the day, follow up the people who need checking on, and refer what needs a hospital.", "The following-up is the part that decides whether an outreach mattered. We are now working toward sustained health provision for Gosa and the settlements around it, rather than returning with a tent every few months."], buttons: [{ label: "Medical Outreaches", href: "/our-work/health/medical-outreaches" }, { label: "Health Systems Strengthening", href: "/our-work/health/health-systems" }] },
      { heading: "Empowerment", paragraphs: ["The Community Innovation Challenge belongs to Gosa. Young adults from the community are screened, placed in teams, and supported by facilitators to take an idea from a problem they have noticed to a costed solution they can present — waste management, water access, maternal and child health.", "They are not asked to comment on their community's problems. They choose which one to work on, and they build the answer."], figures: [{ value: "18–30", label: "participant ages" }, { value: "3", label: "challenge tracks" }, { value: "₦2m", label: "per edition" }], buttons: [{ label: "Community Innovation Challenge", href: "/our-work/empowerment/community-innovation-challenge" }] },
      { heading: "Where we have got to", paragraphs: ["In Gosa, MedWHOLE is a household name — for the reading clubs, the summer school, the outreaches and the innovation challenge, and for what has happened to the children and young adults who have been through them."], quote: "Twenty-one children in a church hall. More than four hundred at Summer School five years later." },
      { heading: "Join our work in Gosa", paragraphs: ["There is always something here that needs doing. Teach a Summer School band in August. Facilitate a team through the innovation challenge. Bring a clinical skill to an outreach. Sponsor a pillar for a year, or write to us and we will tell you plainly what is short."], buttons: [{ label: "Volunteer in Gosa", href: "/volunteer?community=gosa" }, { label: "Fund our work in Gosa", href: "/give?community=gosa" }, { label: "Talk to us", href: "/contact?community=gosa" }], tone: "parchment" },
    ],
  },
  kunyami: {
    path: "/communities/kunyami",
    pageTitle: "Kunyami",
    metaDescription: "Free education, health outreaches and skills training in Kunyami, Kyami District, AMAC, FCT Abuja. Our second community, since February 2026.",
    eyebrow: "Where we work",
    heading: "Kunyami",
    subheading: "Where we found out whether any of this works anywhere else. 3,000+ people · Since February 2026 · Kyami District, AMAC, FCT Abuja",
    sections: [
      { heading: "The community", paragraphs: ["Kunyami is a short distance from Gosa, on the same Airport Road, in the same district. It is a farming community of more than three thousand people, built on sloping ground with poor roads, and a large share of its population are children and young people.", "It has no health facility. Care has meant travelling elsewhere or going without, and most households have no potable water, which shows up in the water-borne infections we see. Non-communicable disease is on record here too. Schooling is hard for children and young people to hold on to.", "We came in February 2026 with programmes we had already spent five years building in Gosa."] },
      { heading: "Health", paragraphs: ["Our first day here was a free medical outreach on 14 February 2026. Five hundred and six people were seen: registration and triage, then consultation, laboratory, nursing, eye care, counselling and pharmacy.", "Seven people were found to need surgery. All seven were referred to Gibonna Women's Hospital in Garki, all seven were operated on, and all seven recovered without complications. That chain — outreach to referral to recovery — is what we mean by following through.", "We are working toward sustained, accessible provision here rather than periodic visits."], figures: [{ value: "506", label: "people seen in one day" }, { value: "697", label: "clinical services delivered" }, { value: "7", label: "surgeries, 7 recoveries, 0 complications" }], buttons: [{ label: "Medical Outreaches", href: "/our-work/health/medical-outreaches" }, { label: "Continuity of Care", href: "/our-work/health/continuity-of-care" }] },
      { heading: "Literacy", paragraphs: ["Good News Club opened in Kunyami on 6 February 2026 and drew 168 children on its first Friday. Summer School followed in August, the first time it had ever run outside Gosa.", "It started with 122 children on the Monday and reached 240 by the Thursday, and it kept climbing — across the month it averaged 280 a day. Children who had fallen behind were given study support, which has made going back to class easier to sustain."], figures: [{ value: "168", label: "at the first club meeting" }, { value: "280", label: "a day at the first Summer School" }, { value: "122 → 240", label: "across its first four mornings" }], buttons: [{ label: "MedWHOLE Academy", href: "/academy" }, { label: "Summer School — Kunyami 2026", href: "/events/summer-school-kunyami-2026" }] },
      { heading: "Empowerment", paragraphs: ["The young people from Kunyami who worked the service units at the February outreach became the first ComPart cohort. They met fortnightly from February to June, training in graphics and media, printing and branding, or public health.", "Twelve completed it. At the graduation they presented work they can show to a client, and the public health stream went on to plan and run a community sanitation project themselves."], figures: [{ value: "12", label: "graduates" }, { value: "3", label: "learning streams" }, { value: "5", label: "months" }], buttons: [{ label: "ComPart", href: "/our-work/empowerment/compart" }] },
      { heading: "What this year proved", paragraphs: ["Good News Club and Summer School were both built in Gosa over five years. Both opened in Kunyami inside twelve months, and both worked immediately.", "That is the answer to the question anyone funding scale asks first: does this work anywhere other than where you built it."], quote: "Five years proving it in one community. One year moving it into the next." },
      { heading: "Join our work in Kunyami", paragraphs: ["Kunyami is a year old and growing faster than anything we have run before. It needs teachers each August, facilitators for the next ComPart cohort, clinical volunteers for the outreaches, and funding for a community that still has no health facility of its own."], buttons: [{ label: "Volunteer in Kunyami", href: "/volunteer?community=kunyami" }, { label: "Fund our work in Kunyami", href: "/give?community=kunyami" }, { label: "Talk to us", href: "/contact?community=kunyami" }], tone: "parchment" },
    ],
  },
  toge: {
    path: "/communities/toge",
    pageTitle: "Toge",
    metaDescription: "School health, screening and deworming in Toge, Kyami District, AMAC, FCT Abuja. Our newest community, since June 2026.",
    eyebrow: "Where we work",
    heading: "Toge",
    subheading: "Our newest community. We are at the beginning here. ~4,000 people · 1,000+ households · Since June 2026 · Kyami District, AMAC, FCT Abuja",
    sections: [
      { heading: "The community", paragraphs: ["Toge is about the same size as Gosa — more than a thousand households, around four people to a home, so roughly four thousand people in all. Most of them are women and children.", "There are a few primary schools and no secondary school, so a child who finishes primary here has nowhere in the community to go next. There is no hospital serving the settlement."] },
      { heading: "Health", paragraphs: ["We have run outreaches in Toge, and in June 2026 we took a full health programme into LEA Primary School: a general assembly, then separate sessions by age and sex, then screening and deworming.", "One hundred and ninety-six pupils were screened and 193 dewormed. Eighteen were undernourished, five times more often among boys than girls. Nine teachers were screened and one was referred for high blood pressure.", "The older girls' session covered hygiene and how to identify, resist and report abuse. The boys' session covered hygiene, safe toilet practice, and the risks of swimming in the river — drowning, and the schistosomiasis we had already found in neighbouring Kunyami."], figures: [{ value: "196", label: "pupils screened" }, { value: "193", label: "dewormed" }, { value: "18", label: "undernourished" }, { value: "9", label: "teachers screened" }, { value: "1", label: "referral" }], buttons: [{ label: "School Health Interventions", href: "/our-work/health/school-health" }, { label: "Nutrition", href: "/our-work/health/nutrition" }] },
      { heading: "What comes next", paragraphs: ["We are talking to the people who hold things together here — school leadership, the local education authority, community leaders — about what a longer presence should look like. Water, sanitation, hygiene and river safety are the priorities on record.", "We would rather agree that with Toge than arrive with a plan."] },
      { heading: "Join our work in Toge", paragraphs: ["Toge is the community where you can still shape what we do, because very little of it is fixed. We are working out with its leaders what a longer presence should look like, and water, sanitation, hygiene and river safety are the priorities on record.", "A partner or volunteer who comes in now helps set the direction rather than staffing a plan that already exists."], buttons: [{ label: "Partner with us in Toge", href: "/partner?community=toge" }, { label: "Volunteer in Toge", href: "/volunteer?community=toge" }, { label: "Talk to us", href: "/contact?community=toge" }], tone: "parchment" },
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(communityPages).map((slug) => ({ slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page =
    (await getPayloadWebsitePage(`/communities/${params.slug}`)) ?? communityPages[params.slug]
  if (!page) return generateApprovedSEO(`/communities/${params.slug}`, { noindex: true })
  return generateApprovedSEO(page.path)
}

export default async function CommunityPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page =
    (await getPayloadWebsitePage(`/communities/${params.slug}`)) ?? communityPages[params.slug]
  if (!page) notFound()
  return <EditorialCopyPage page={page} />
}
