import { afterEach, describe, expect, it, vi } from 'vitest'
vi.mock('server-only', () => ({}))

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.resetModules() })

describe('Payload REST write contract', () => {
  it('unwraps the saved document for form, finance-create and finance-update responses', async () => {
    vi.stubEnv('PAYLOAD_CMS_URL', 'https://cms.example.com')
    vi.stubEnv('PAYLOAD_CMS_WEBSITE_API_KEY', 'test-website-key')
    vi.stubEnv('PAYLOAD_CMS_FINANCE_API_KEY', 'test-finance-key')
    const transport = vi.fn().mockImplementation(async () => Response.json({ doc: { id: 42, reference: 'TEST-42' }, message: 'Saved' }))
    vi.stubGlobal('fetch', transport)
    const cms = await import('../lib/cms/payload')
    expect(await cms.createWebsiteSubmission('contact-submissions', { fullName: 'Test' })).toMatchObject({ id: 42 })
    expect(await cms.createPrivatePayloadDocument('donation-payments', { reference: 'TEST-42' })).toMatchObject({ id: 42 })
    expect(await cms.updatePrivatePayloadDocument('donation-payments', '42', { status: 'paid' })).toMatchObject({ id: 42 })
    expect(transport.mock.calls[0][1].headers.Authorization).toBe('administrators API-Key test-website-key')
    expect(transport.mock.calls[1][1].headers.Authorization).toBe('administrators API-Key test-finance-key')
  })
})
