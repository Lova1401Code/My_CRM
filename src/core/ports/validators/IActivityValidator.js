/**
 * @typedef {Object} IActivityValidator
 * @property {(data: Partial<import('../../domain/entities/Activity.js').Activity>, {partial?: boolean}) => Result<import('../../domain/entities/Activity.js').Activity>} validate
 */
export const IActivityValidator = Symbol('IActivityValidator');
