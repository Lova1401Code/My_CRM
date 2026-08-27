/**
 * @typedef {Object} INoteValidator
 * @property {(data: Partial<import('../../domain/entities/Note.js').Note>, {partial?: boolean}) => Result<import('../../domain/entities/Note.js').Note>} validate
 */
export const INoteValidator = Symbol('INoteValidator');
