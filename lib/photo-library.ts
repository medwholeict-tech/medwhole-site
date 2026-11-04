// Original photographs supplied by MedWHOLE through its shared Drive library.
// Folder labels provide provenance, not verified programme dates or locations.
// Alt text describes visible activity without assigning an unconfirmed event.
export type LibraryPhoto = {
  name: string
  alt: string
  category: "health" | "empowerment" | "community" | "service"
}

export const libraryPhotos: LibraryPhoto[] = [
  { name: "mg-9074-copy", alt: "A MedWHOLE health worker examining a child's upper arm", category: "health" },
  { name: "dsc08737", alt: "Participants working at sewing machines during a practical training session", category: "empowerment" },
  { name: "img-6009", alt: "A facilitator and children raising their hands during an outdoor activity", category: "community" },
  { name: "dsc08053", alt: "Two MedWHOLE team members carrying a box of supplies between vehicles", category: "service" },
  { name: "mg-9136-copy", alt: "A health worker leaning towards a child during a consultation", category: "health" },
  { name: "dsc09359", alt: "Participants watching a hands-on screen-printing demonstration", category: "empowerment" },
  { name: "img-5581", alt: "A MedWHOLE facilitator addressing children gathered beside a building", category: "community" },
  { name: "mg-9253", alt: "Outreach team members organising medicine and supplies on a table", category: "health" },
  { name: "dsc08761", alt: "A facilitator speaking to participants seated at sewing machines", category: "empowerment" },
  { name: "img-5318", alt: "Children and adults gathered with a MedWHOLE facilitator in a green-walled room", category: "community" },
  { name: "mg-9076", alt: "A MedWHOLE team member listening to a woman across a consultation table", category: "health" },
  { name: "dsc09287", alt: "A participant writing in a notebook during a group training session", category: "empowerment" },
  { name: "img-5746", alt: "A MedWHOLE facilitator speaking into a microphone at a community gathering", category: "community" },
  { name: "mg-9161", alt: "A MedWHOLE team member speaking with a woman seated across from him", category: "health" },
  { name: "dsc08735", alt: "Participants and a facilitator discussing their work during a training session", category: "empowerment" },
  { name: "mg-9412", alt: "A MedWHOLE health worker reaching across an outreach table to assist a visitor", category: "health" },
  { name: "img-5341", alt: "A facilitator leading a discussion with children and adults seated around her", category: "community" },
  { name: "dsc08753", alt: "A woman speaking to seated participants during a training session", category: "empowerment" },
  { name: "mg-9162", alt: "A MedWHOLE team member in a red headwrap speaking with a visitor", category: "health" },
  { name: "dsc09325", alt: "A facilitator holding an open booklet beside seated participants", category: "empowerment" },
  { name: "img-5171", alt: "Children standing at the front of a room beneath a Christian convention banner", category: "community" },
  { name: "mg-9400", alt: "A MedWHOLE team member speaking with visitors at an outdoor outreach", category: "health" },
  { name: "dsc09327", alt: "A facilitator discussing a worksheet with a seated participant", category: "empowerment" },
  { name: "mg-9201", alt: "A MedWHOLE team member in a red headwrap attending to a family at a table", category: "health" },
  { name: "dsc08763", alt: "A participant holding fabric during a practical training session", category: "empowerment" },
  { name: "dsc09283", alt: "Participants seated together during a group training session", category: "empowerment" },
  { name: "mg-9231", alt: "Families and MedWHOLE team members gathered at an outreach consultation table", category: "health" },
  { name: "dsc09337", alt: "Facilitators and participants working together in a training room", category: "empowerment" },
  { name: "dsc09375", alt: "A facilitator leaning towards a participant during a small-group session", category: "empowerment" },
  { name: "dsc09383", alt: "Participants and facilitators discussing their work around tables", category: "empowerment" },
  { name: "dsc09439", alt: "A facilitator addressing seated participants during a training session", category: "empowerment" },
  { name: "20260315-172131", alt: "A facilitator presenting projected slides to seated participants", category: "empowerment" },
]

export const libraryPhotoSrc = (name: string) => `/images/library/${name}.webp`

export const libraryPhotoHref = (category: LibraryPhoto["category"]) => {
  if (category === "health") return "/our-work/health"
  if (category === "empowerment") return "/our-work/empowerment"
  if (category === "service") return "/get-involved"
  return "/impact"
}
