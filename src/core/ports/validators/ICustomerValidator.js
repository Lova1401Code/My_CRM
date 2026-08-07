/**
 * @typedef {Object} ICustomerValidator
 * @property {(data: Partial<Customer>, {partial?: boolean}) => Result<Customer>} validate
 */
export const ICustomerValidator = Symbol('ICustomerValidator');