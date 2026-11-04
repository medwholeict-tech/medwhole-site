import { defineField, defineType } from "sanity"

export const donationPaymentSchema = defineType({
  name: "donationPayment", title: "Paystack donations", type: "document", readOnly: true,
  fields: [
    ...["reference", "parentReference", "fullName", "email", "currency", "frequency", "designation", "community", "status", "planCode"].map((name) => defineField({ name, type: "string", title: name })),
    defineField({ name: "amount", title: "Amount in kobo", type: "number" }),
    defineField({ name: "submittedAt", title: "Submitted at", type: "datetime" }),
    defineField({ name: "paidAt", title: "Paid at", type: "datetime" }),
    defineField({ name: "receiptSent", title: "Receipt sent", type: "boolean" }),
  ],
})
