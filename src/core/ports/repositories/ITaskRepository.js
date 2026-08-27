import { IRepository } from './IRepository.js';

/**
 * @typedef {IRepository<import('../../domain/entities/Task.js').Task>} ITaskRepository
 */
export const ITaskRepository = Symbol('ITaskRepository');
