import { IRepository } from './IRepository.js';

/**
 * @typedef {IRepository<import('../../domain/entities/Customer.js').Customer>} ICustomerRepository
 * @property {(ownerId: string) => Promise<Result<number>>} countByOwner
 */

export const ICustomerRepository = Symbol('ICustomerRepository');