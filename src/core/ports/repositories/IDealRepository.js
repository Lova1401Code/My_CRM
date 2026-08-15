import { IRepository } from './IRepository.js';

/**
 * @typedef {IRepository<import('../../domain/entities/Deal.js').Deal>} IDealRepository
 * @property {(stage: string) => Promise<Result<number>>} countByStage
 * @property {() => Promise<Result<import('../../domain/entities/Deal.js').Deal[]>>} findAll
 */

export const IDealRepository = Symbol('IDealRepository');
