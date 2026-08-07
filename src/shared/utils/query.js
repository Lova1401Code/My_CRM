// Pure query helpers for pagination/search serialization.

export function parseQuery(searchString) {
  const params = new URLSearchParams(searchString || '');
  const obj = {};
  for (const [key, value] of params.entries()) {
    obj[key] = value;
  }
  return obj;
}

export function buildQuery(params) {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      search.append(key, String(value));
    }
  });
  return search.toString();
}

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZES = [10, 25, 50];