/**
 * @typedef {Object} IDashboardService
 * @property {() => Promise<Result<{customersCount: number, leadsCount: number, usersCount: number, convertedLeadsCount: number}>>} getStats
 */
export const IDashboardService = Symbol('IDashboardService');