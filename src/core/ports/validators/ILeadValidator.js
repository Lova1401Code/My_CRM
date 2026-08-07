/**
 * @typedef {Object} ILeadValidator
 * @property {(data: Partial<Lead>, {partial?: boolean}) => Result<Lead>} validate
 */
export const ILeadValidator = Symbol('ILeadValidator');