// Default search service — pure in-memory multi-field search.
import { matchSearch } from '../helpers.js';

export class DefaultSearchService {
  search(items, query, fields) {
    return matchSearch(items, query, fields);
  }
}

export const searchService = new DefaultSearchService();