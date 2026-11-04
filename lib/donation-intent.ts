import { z } from "zod"

export const donationCurrencies = ["NGN", "USD", "GBP"] as const
export type DonationCurrency = (typeof donationCurrencies)[number]

export const donationFrequencies = ["one-time", "monthly"] as const
export type DonationFrequency = (typeof donationFrequencies)[number]

export const donationProgrammes = [
  "where-needed",
  "health",
  "literacy",
  "empowerment",
] as const
export type DonationProgramme = (typeof donationProgrammes)[number]

export const donationProgrammeLabels: Record<DonationProgramme, string> = {
  "where-needed": "Where it is needed most",
  health: "Health",
  literacy: "Literacy",
  empowerment: "Empowerment",
}

export const donationIntentSchema = z
  .object({
    currency: z.enum(donationCurrencies),
    frequency: z.enum(donationFrequencies),
    amount: z
      .string()
      .trim()
      .min(1, "Enter an intended amount")
      .max(12, "Enter a smaller amount")
      .regex(/^\d+(?:\.\d{1,2})?$/, "Enter a valid amount")
      .refine((value) => Number(value) > 0, "Amount must be greater than zero"),
    programme: z.enum(donationProgrammes),
    designation: z.string().trim().max(160, "Designation is too long").optional(),
    sourcePath: z
      .string()
      .trim()
      .max(240, "Source path is too long")
      .regex(/^\/[a-zA-Z0-9/_-]*$/, "Enter a valid source path")
      .optional(),
    fullName: z.string().trim().min(2, "Enter your full name").max(100),
    country: z.string().trim().min(2, "Enter your country").max(80),
    email: z
      .union([z.literal(""), z.string().trim().email("Enter a valid email address").max(254)]),
    phone: z.string().trim().max(30, "Enter a shorter phone number"),
    expectedTransferDate: z.union([
      z.literal(""),
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid transfer date"),
    ]),
    consent: z.boolean().refine((value) => value, {
      message: "Consent is required so we can follow up about this donation",
    }),
    website: z.string().max(0).optional(),
  })
  .superRefine((value, context) => {
    if (!value.email && !value.phone) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Add an email address or phone number",
      })
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Add a phone number or email address",
      })
    }
  })

export type DonationIntentInput = z.infer<typeof donationIntentSchema>

export type TransferDetail = {
  label: string
  value: string
}

export type TransferDetailGroup = {
  title: string
  details: TransferDetail[]
}

export type TransferRoute = {
  label: string
  description: string
  groups: TransferDetailGroup[]
}

export const transferRoutes: Record<DonationCurrency, TransferRoute> = {
  NGN: {
    label: "Naira transfer",
    description: "For transfers from a Nigerian bank account.",
    groups: [
      {
        title: "Beneficiary",
        details: [
          { label: "Bank", value: "Fidelity Bank PLC" },
          { label: "Account name", value: "MEDWHOLE ALLIANCE FOR HEALTH AND DEVELOPMENT" },
          { label: "Account number", value: "4011482641" },
        ],
      },
    ],
  },
  USD: {
    label: "US dollar inward transfer",
    description: "For international transfers sent in US dollars.",
    groups: [
      {
        title: "Correspondent bank",
        details: [
          { label: "Bank", value: "CITIBANK, NA, P.O. BOX 336 STRAND, LONDON, WCR 1HB, ENGLAND" },
          { label: "SWIFT code", value: "CITIGB2L" },
          { label: "Sort code", value: "18-50-08" },
        ],
      },
      {
        title: "Beneficiary bank",
        details: [
          { label: "Bank", value: "FIDELITY BANK PLC NIGERIA" },
          { label: "SWIFT code", value: "FIDTNGLA" },
          { label: "IBAN", value: "GB71CITI18500810407909" },
        ],
      },
      {
        title: "Final beneficiary",
        details: [
          { label: "Account name", value: "MEDWHOLE ALLIANCE FOR HEALTH AND DEVELOPMENT" },
          { label: "USD account number", value: "5250381250" },
        ],
      },
    ],
  },
  GBP: {
    label: "British pound inward transfer",
    description: "For international transfers sent in British pounds.",
    groups: [
      {
        title: "Correspondent bank",
        details: [
          { label: "Bank", value: "CITIBANK, NA, P.O. BOX 336 STRAND, LONDON, WCR 1HB, ENGLAND" },
          { label: "SWIFT code", value: "CITIGB2L" },
          { label: "Sort code", value: "18-50-08" },
        ],
      },
      {
        title: "Beneficiary bank",
        details: [
          { label: "Bank", value: "FIDELITY BANK PLC NIGERIA" },
          { label: "SWIFT code", value: "FIDTNGLA" },
          { label: "IBAN", value: "GB71CITI18500810407909" },
        ],
      },
      {
        title: "Final beneficiary",
        details: [
          { label: "Account name", value: "MEDWHOLE ALLIANCE FOR HEALTH AND DEVELOPMENT" },
          { label: "GBP account number", value: "5250381346" },
        ],
      },
    ],
  },
}

export const suggestedAmounts: Record<DonationCurrency, string[]> = {
  NGN: ["5000", "10000", "25000", "50000"],
  USD: ["25", "50", "100", "250"],
  GBP: ["20", "50", "100", "250"],
}

export function formatDonationAmount(amount: string | number, currency: DonationCurrency) {
  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount)) return `${currency} —`

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numericAmount)
}

export function getTransferNarration(reference: string) {
  return `Donation ${reference}`
}
