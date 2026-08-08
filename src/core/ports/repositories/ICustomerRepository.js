import { IRepository } from './IRepository.js';

/**
 * @typedef {IRepository<import('../../domain/entities/Customer.js').Customer>} ICustomerRepository
 * @property {(ownerId: string) => Promise<Result<number>>} countByOwner
 * @property {() => Promise<Result<import('../../domain/entities/Customer.js').Customer[]>>} findAll
 */

export const ICustomerRepository = Symbol('ICustomerRepository');