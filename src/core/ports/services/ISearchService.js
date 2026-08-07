/**
 * @typedef {Object} ISearchService
 * @property {(items: Array, query: string, fields: string[]) => Array} search
 */
export const ISearchService = Symbol('ISearchService');