import { IRepository } from './IRepository.js';

/**
 * @typedef {IRepository<import('../../domain/entities/Activity.js').Activity>} IActivityRepository
 */
export const IActivityRepository = Symbol('IActivityRepository');
