import { IRepository } from './IRepository.js';

/**
 * @typedef {IRepository<import('../../domain/entities/Note.js').Note>} INoteRepository
 */
export const INoteRepository = Symbol('INoteRepository');
