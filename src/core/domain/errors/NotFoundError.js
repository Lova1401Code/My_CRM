import { DomainError } from './DomainError.js';

export class NotFoundError extends DomainError {
  constructor(message = 'Resource not found', details = {}) {
    super(message, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}