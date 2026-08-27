import { describe, it, expect } from 'vitest';
import {
  toDateString,
  isOverdue,
  isToday,
  getDueBucket,
} from './dateHelpers.js';

describe('toDateString', () => {
  it('formats a Date as YYYY-MM-DD', () => {
    expect(toDateString(new Date(2026, 7, 9))).toBe('2026-08-09');
  });

  it('pads month and day', () => {
    expect(toDateString(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('isOverdue', () => {
  const today = new Date(2026, 7, 24, 15, 30);

  it('returns true for a past date', () => {
    expect(isOverdue('2026-08-23', today)).toBe(true);
  });

  it('returns false for same day regardless of time', () => {
    expect(isOverdue('2026-08-24', today)).toBe(false);
  });

  it('returns false for future dates', () => {
    expect(isOverdue('2026-08-25', today)).toBe(false);
  });

  it('returns false for empty input', () => {
    expect(isOverdue('', today)).toBe(false);
    expect(isOverdue(null, today)).toBe(false);
  });
});

describe('isToday', () => {
  const today = new Date(2026, 7, 24, 15, 30);

  it('returns true for the same day', () => {
    expect(isToday('2026-08-24', today)).toBe(true);
  });

  it('returns false for other days', () => {
    expect(isToday('2026-08-23', today)).toBe(false);
  });

  it('returns false for empty input', () => {
    expect(isToday('', today)).toBe(false);
  });
});

describe('getDueBucket', () => {
  const today = new Date(2026, 7, 24, 15, 30);

  it('classifies past dates as overdue', () => {
    expect(getDueBucket('2026-08-20', today)).toBe('overdue');
  });

  it('classifies the current day as today', () => {
    expect(getDueBucket('2026-08-24', today)).toBe('today');
  });

  it('classifies future dates as upcoming', () => {
    expect(getDueBucket('2026-08-30', today)).toBe('upcoming');
  });

  it('returns none without due date', () => {
    expect(getDueBucket(null, today)).toBe('none');
    expect(getDueBucket('', today)).toBe('none');
  });
});
