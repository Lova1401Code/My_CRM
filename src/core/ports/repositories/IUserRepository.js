import { IRepository } from './IRepository.js';

/**
 * @typedef {IRepository<import('../../domain/entities/User.js').User>} IUserRepository
 * @property {(email: string) => Promise<Result<User|null>>} findByEmail
 * @property {(email: string, excludeId?: string) => Promise<Result<boolean>>} isEmailUnique
 */

export const IUserRepository = Symbol('IUserRepository');