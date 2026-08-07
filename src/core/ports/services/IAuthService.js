/**
 * @typedef {Object} IAuthService
 * @property {(email: string, password: string) => Promise<Result<{token: string, user: User}>>} login
 * @property {() => Promise<Result<void>>} logout
 * @property {(token: string) => Promise<Result<User|null>>} getProfile
 */
export const IAuthService = Symbol('IAuthService');