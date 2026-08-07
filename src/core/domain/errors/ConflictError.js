import { DomainError } from './DomainError.js';

export class ConflictError extends DomainError {
  constructor(message = 'Conflict', details = {}) {
    super(message, 'CONFLICT', details);
    this.name = 'ConflictError';
  }
}