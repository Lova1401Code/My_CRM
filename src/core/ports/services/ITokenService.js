/**
 * @typedef {Object} ITokenService
 * @property {(payload: Record<string, unknown>) => string} encode
 * @property {(token: string) => Record<string, unknown>|null} decode
 */
export const ITokenService = Symbol('ITokenService');