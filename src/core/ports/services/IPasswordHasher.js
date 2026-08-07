/**
 * @typedef {Object} IPasswordHasher
 * @property {(plain: string) => Promise<string>} hash
 * @property {(plain: string, hashed: string) => Promise<boolean>} compare
 */
export const IPasswordHasher = Symbol('IPasswordHasher');