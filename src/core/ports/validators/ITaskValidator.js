/**
 * @typedef {Object} ITaskValidator
 * @property {(data: Partial<import('../../domain/entities/Task.js').Task>, {partial?: boolean}) => Result<import('../../domain/entities/Task.js').Task>} validate
 */
export const ITaskValidator = Symbol('ITaskValidator');
