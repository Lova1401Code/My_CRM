import { DomainError } from './DomainError.js';

export class UnauthorizedError extends DomainError {
  constructor(message = 'Unauthorized', details = {}) {
    super(message, 'UNAUTHORIZED', details);
    this.name = 'UnauthorizedError';
  }
}