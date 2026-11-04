import { beforeEach, describe, expect, it, vi } from "vitest"
vi.mock("server-only", () => ({}))
vi.mock("@/lib/rate-limit", () => ({ rateLimit: () => true }))
const backend = vi.hoisted(() => ({ createWebsiteSubmission: vi.fn(), listPrivatePayloadDocuments: vi.fn(), updatePrivatePayloadDocument: vi.fn() }))
vi.mock("@/lib/cms/payload", () => backend)
import { POST as contact } from "../app/api/contact/route"
import { POST as newsletter } from "../app/api/newsletter/subscribe/route"

beforeEach(() => { vi.resetAllMocks() })
function request(body: unknown) { return new Request("https://www.medwhole.org/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }) }

describe("Payload is the primary submission store", () => {
  it("returns the native saved contact ID only after Payload confirms persistence", async () => {
    backend.createWebsiteSubmission.mockResolvedValue({ id: "123" })
    const response = await contact(request({ name: "Ada Okafor", email: "ada@example.com", subject: "Hello", message: "Please contact me about volunteering." }))
    expect(response.status).toBe(201)
    expect(await response.json()).toMatchObject({ success: true, id: "123" })
    expect(backend.createWebsiteSubmission).toHaveBeenCalledWith("contact-submissions", expect.objectContaining({ fullName: "Ada Okafor", email: "ada@example.com" }))
  })
  it("does not report success if the primary store fails", async () => {
    backend.createWebsiteSubmission.mockRejectedValue(new Error("Service unavailable"))
    const response = await contact(request({ name: "Ada Okafor", email: "ada@example.com", subject: "Hello", message: "Please contact me about volunteering." }))
    expect(response.ok).toBe(false)
    expect(await response.json()).not.toHaveProperty("success", true)
  })
  it("reactivates a newsletter subscription in Payload without returning private record fields", async () => {
    backend.listPrivatePayloadDocuments.mockResolvedValue({ docs: [{ id: "7", status: "unsubscribed", details: { private: true } }] })
    backend.updatePrivatePayloadDocument.mockResolvedValue({ id: "7", status: "active" })
    const response = await newsletter(request({ name: "Ada", email: "ada@example.com", source: "website" }))
    expect(response.status).toBe(200)
    expect(backend.updatePrivatePayloadDocument).toHaveBeenCalledWith("newsletter-subscribers", "7", expect.objectContaining({ status: "active", unsubscribedAt: null }))
    expect((await response.json()).subscriber).toEqual({ id: "7" })
  })
  it("handles a simultaneous duplicate newsletter signup without a false success", async () => {
    backend.listPrivatePayloadDocuments.mockResolvedValueOnce({ docs: [] }).mockResolvedValueOnce({ docs: [{ id: "8" }] })
    backend.createWebsiteSubmission.mockRejectedValue(new Error("Unique email"))
    const response = await newsletter(request({ email: "ada@example.com" }))
    expect(response.status).toBe(409)
  })
})
