export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; label: string; text: string }

export type LegalSection = {
  id: string
  title: string
  blocks: LegalBlock[]
}

export type LegalDocument = {
  title: string
  eyebrow: string
  effectiveLabel: string
  effectiveDate: string
  introduction: string
  sections: LegalSection[]
  closing?: string
}
