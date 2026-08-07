// Base domain error. All domain errors extend this.
export class DomainError extends Error {
  constructor(message, code = 'DOMAIN_ERROR', details = {}) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    this.details = details;
  }
}