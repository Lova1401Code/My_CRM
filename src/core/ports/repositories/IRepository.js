// Base repository contract (CRUD + pagination/search).
// JSDoc interface — implementations must satisfy these methods.

/**
 * @template T
 * @typedef {Object} IRepository
 * @property {(id: string) => Promise<Result<T|null>>} findById
 * @property {(opts?: {page?: number, limit?: number, search?: string, filters?: Record<string, unknown>}) => Promise<Result<{items: T[], total: number}>>} findMany
 * @property {(data: Partial<T>) => Promise<Result<T>>} create
 * @property {(id: string, data: Partial<T>) => Promise<Result<T>>} update
 * @property {(id: string) => Promise<Result<void>>} remove
 */

// Marker symbol so implementations can be type-checked at runtime if needed.
export const IRepository = Symbol('IRepository');