// Maps a domain Result.failure into a user-friendly message.
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  DomainError,
} from '../../core/domain/errors/index.js';

export function errorMessage(result) {
  const err = result.error;
  if (!err) return 'Une erreur est survenue.';
  if (err instanceof ValidationError) return err.message;
  if (err instanceof NotFoundError) return err.message;
  if (err instanceof UnauthorizedError) return err.message;
  if (err instanceof ConflictError) return err.message;
  if (err instanceof DomainError) return err.message;
  return err.message || 'Une erreur est survenue.';
}

export function fieldErrors(result) {
  const err = result.error;
  if (err instanceof ValidationError) return err.errors || {};
  return {};
}