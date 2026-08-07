/**
 * @typedef {Object} IPaginationService
 * @property {(items: Array, page: number, limit: number) => {items: Array, total: number, page: number, limit: number, totalPages: number}} paginate
 */
export const IPaginationService = Symbol('IPaginationService');