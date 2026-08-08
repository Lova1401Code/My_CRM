/**
 * @typedef {Object} IDashboardService
 * @property {() => Promise<Result<{customersCount: number, leadsCount: number, usersCount: number, convertedLeadsCount: number}>>} getStats
 * @property {() => Promise<Result<{
 *   evolution: Array<{month: string, label: string, leads: number, customers: number}>,
 *   leadsByStatus: Array<{status: string, count: number}>,
 *   leadsBySource: Array<{source: string, count: number}>,
 * }>>} getEvolution
 */
export const IDashboardService = Symbol('IDashboardService');