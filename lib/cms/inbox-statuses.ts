export function inboxStatuses(collection: string): string[] {
  if (collection === "email-deliveries") return ["queued", "sent", "failed", "retry"]
  if (collection === "newsletter-subscribers") return ["active", "unsubscribed", "archived"]
  if (collection === "donation-intents") return ["new", "instructions-sent", "in_review", "resolved", "archived"]
  if (collection === "donation-payments") return ["pending", "paid", "failed", "cancelled", "archived"]
  return ["new", "in_review", "replied", "resolved", "archived"]
}
