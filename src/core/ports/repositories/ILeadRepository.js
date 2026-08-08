import { IRepository } from './IRepository.js';

/**
 * @typedef {IRepository<import('../../domain/entities/Lead.js').Lead>} ILeadRepository
 * @property {(status: string) => Promise<Result<number>>} countByStatus
 * @property {() => Promise<Result<number>>} countConverted
 * @property {() => Promise<Result<import('../../domain/entities/Lead.js').Lead[]>>} findAll
 */

export const ILeadRepository = Symbol('ILeadRepository');