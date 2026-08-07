import { DomainError } from './DomainError.js';

export class ValidationError extends DomainError {
  constructor(message = 'Validation failed', details = {}) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
    this.errors = details.errors || {};
  }
}