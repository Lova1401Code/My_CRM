/**
 * @typedef {Object} IDealValidator
 * @property {(data: Partial<Deal>, {partial?: boolean}) => Result<Deal>} validate
 */
export const IDealValidator = Symbol('IDealValidator');
