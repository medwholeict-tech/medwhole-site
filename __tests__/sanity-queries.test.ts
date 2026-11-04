import { vi, describe, it, expect, beforeEach } from 'vitest'

// Use relative imports to avoid needing TS path aliases in tests
import * as queries from '../lib/sanity-queries'

// Mock the Sanity client module used by the queries file
vi.mock('../lib/sanity', () => {
  return {
    client: {
      fetch: vi.fn(),
    },
  }
})

import { client } from '../lib/sanity'

beforeEach(() => {
  vi.resetAllMocks()
})

describe('sanity-queries (unit)', () => {
  it('getNews calls client.fetch and returns results', async () => {
    const fakeNews = [
      { _id: '1', title: 'News 1', slug: { current: 'news-1' }, excerpt: 'Ex1' },
      { _id: '2', title: 'News 2', slug: { current: 'news-2' }, excerpt: 'Ex2' },
    ]
    ;(client.fetch as unknown as vi.Mock).mockResolvedValueOnce(fakeNews)

    const result = await queries.getNews(undefined, 2)

    expect(client.fetch).toHaveBeenCalled()
    expect(result).toEqual(fakeNews)
  })

  it('getEvents calls client.fetch and returns results', async () => {
    const fakeEvents = [
      { _id: 'e1', title: 'Event 1', slug: { current: 'e-1' }, description: 'D1' },
    ]
    ;(client.fetch as unknown as vi.Mock).mockResolvedValueOnce(fakeEvents)

    const result = await queries.getEvents(undefined, 1)

    expect(client.fetch).toHaveBeenCalled()
    expect(result).toEqual(fakeEvents)
  })

  it('getTeamMembers calls client.fetch and returns results', async () => {
    const fakeTeam = [
      { _id: 't1', name: 'Alice', role: 'Lead' },
    ]
    ;(client.fetch as unknown as vi.Mock).mockResolvedValueOnce(fakeTeam)

    const result = await queries.getTeamMembers('lead')

    expect(client.fetch).toHaveBeenCalled()
    expect(result).toEqual(fakeTeam)
  })

  it('getGalleryImages calls client.fetch and returns results', async () => {
    const fakeGallery = [
      { _id: 'g1', title: 'Image 1', image: { _type: 'image' } },
    ]
    ;(client.fetch as unknown as vi.Mock).mockResolvedValueOnce(fakeGallery)

    const result = await queries.getGalleryImages(undefined, 5)

    expect(client.fetch).toHaveBeenCalled()
    expect(result).toEqual(fakeGallery)
  })
})

// Optional integration test that runs only if SANITY config is present
const hasSanityEnv = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET)

;(hasSanityEnv ? describe : describe.skip)('sanity-queries (integration)', () => {
  it('fetches real data from Sanity (integration, requires env vars)', async () => {
    // This will call the real client.fetch because we didn't mock in this block
    // The queries module imports client from ../lib/sanity which reads env vars
    const news = await queries.getNews(undefined, 1)
    expect(Array.isArray(news)).toBe(true)
  })
})
