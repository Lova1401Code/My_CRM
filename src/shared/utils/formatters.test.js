import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatDateTime,
  formatPhone,
  formatCurrency,
  initials,
} from './formatters.js'

// Normalizes narrow no-break space (U+202F) and regular no-break space (U+00A0)
// to a regular space, so currency formatting is stable across Node/ICU versions.
function norm(s) {
  return s.replace(/[\u202F\u00A0]/g, ' ')
}

describe('formatDate', () => {
  it('returns "-" for null/undefined/empty', () => {
    expect(formatDate(null)).toBe('-')
    expect(formatDate(undefined)).toBe('-')
    expect(formatDate('')).toBe('-')
  })

  it('returns "-" for an invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('-')
  })

  it('formats a valid ISO date string as dd/mm/yyyy', () => {
    expect(formatDate('2026-08-15')).toBe('15/08/2026')
  })

  it('formats a Date instance', () => {
    expect(formatDate(new Date('2026-01-07'))).toBe('07/01/2026')
  })
})

describe('formatDateTime', () => {
  it('returns "-" for null/undefined/empty', () => {
    expect(formatDateTime(null)).toBe('-')
    expect(formatDateTime('')).toBe('-')
  })

  it('returns "-" for an invalid date', () => {
    expect(formatDateTime('foo')).toBe('-')
  })

  it('formats a valid datetime as dd/mm/yyyy hh:mm', () => {
    expect(formatDateTime('2026-08-15T14:30:00')).toBe('15/08/2026 14:30')
  })
})

describe('formatPhone', () => {
  it('returns "-" for null/undefined/empty', () => {
    expect(formatPhone(null)).toBe('-')
    expect(formatPhone(undefined)).toBe('-')
    expect(formatPhone('')).toBe('-')
  })

  it('groups digits by two', () => {
    expect(formatPhone('0612345678')).toBe('06 12 34 56 78')
  })

  it('removes existing spaces before grouping', () => {
    expect(formatPhone('06 12 34 56 78')).toBe('06 12 34 56 78')
  })

  it('handles an odd number of digits', () => {
    expect(formatPhone('12345')).toBe('12 34 5')
  })
})

describe('formatCurrency', () => {
  it('returns "-" for null/undefined/NaN', () => {
    expect(formatCurrency(null)).toBe('-')
    expect(formatCurrency(undefined)).toBe('-')
    expect(formatCurrency('abc')).toBe('-')
  })

  it('formats a number as EUR with no decimals', () => {
    expect(norm(formatCurrency(1500))).toBe('1 500 €')
  })

  it('formats a numeric string', () => {
    expect(norm(formatCurrency('25000'))).toBe('25 000 €')
  })

  it('formats 0', () => {
    expect(norm(formatCurrency(0))).toBe('0 €')
  })
})

describe('initials', () => {
  it('returns uppercase first letters of firstname and lastname', () => {
    expect(initials('Jean', 'Dupont')).toBe('JD')
  })

  it('lowercase input is uppercased', () => {
    expect(initials('alice', 'bob')).toBe('AB')
  })

  it('defaults to empty strings when args missing', () => {
    expect(initials()).toBe('')
  })

  it('handles one empty name', () => {
    expect(initials('Jean', '')).toBe('J')
  })
})