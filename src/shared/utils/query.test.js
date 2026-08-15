import { describe, it, expect } from 'vitest'
import {
  parseQuery,
  buildQuery,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZES,
} from './query.js'

describe('parseQuery', () => {
  it('parses key=value pairs into an object', () => {
    expect(parseQuery('page=1&q=foo')).toEqual({ page: '1', q: 'foo' })
  })

  it('returns an empty object for an empty string', () => {
    expect(parseQuery('')).toEqual({})
  })

  it('returns an empty object for null/undefined', () => {
    expect(parseQuery(null)).toEqual({})
    expect(parseQuery(undefined)).toEqual({})
  })

  it('handles a single param', () => {
    expect(parseQuery('page=2')).toEqual({ page: '2' })
  })

  it('decodes URL-encoded values', () => {
    expect(parseQuery('q=hello%20world')).toEqual({ q: 'hello world' })
  })
})

describe('buildQuery', () => {
  it('builds a query string from an object', () => {
    expect(buildQuery({ page: 1, limit: 10 })).toBe('page=1&limit=10')
  })

  it('skips null, undefined and empty string values', () => {
    expect(buildQuery({ page: 1, q: '', x: null, y: undefined })).toBe('page=1')
  })

  it('returns an empty string for an empty object', () => {
    expect(buildQuery({})).toBe('')
  })

  it('returns an empty string for null/undefined input', () => {
    expect(buildQuery(null)).toBe('')
    expect(buildQuery(undefined)).toBe('')
  })

  it('stringifies numeric values', () => {
    expect(buildQuery({ page: 2, size: 25 })).toBe('page=2&size=25')
  })

  it('URL-encodes special characters', () => {
    expect(buildQuery({ q: 'hello world' })).toBe('q=hello+world')
  })
})

describe('constants', () => {
  it('exports DEFAULT_PAGE_SIZE = 10', () => {
    expect(DEFAULT_PAGE_SIZE).toBe(10)
  })

  it('exports PAGE_SIZES = [10, 25, 50]', () => {
    expect(PAGE_SIZES).toEqual([10, 25, 50])
  })
})