// Infrastructure helpers for the mock layer.
import { APP } from '../../core/config/constants.js';

export function delay(ms = APP.SIMULATED_LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Generic in-memory search across multiple fields (case-insensitive).
export function matchSearch(items, query, fields) {
  if (!query) return items;
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) =>
    fields.some((f) => {
      const value = item[f];
      return value && String(value).toLowerCase().includes(q);
    }),
  );
}