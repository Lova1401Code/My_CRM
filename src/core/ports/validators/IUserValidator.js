/**
 * @typedef {Object} IUserValidator
 * @property {(data: Partial<User>, {partial?: boolean}) => Result<User>} validate
 */
export const IUserValidator = Symbol('IUserValidator');