import { describe, it, expect } from 'vitest'
import { errorMessage, fieldErrors } from './errors.js'
import { Result } from './result.js'
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  DomainError,
} from '../../core/domain/errors/index.js'

describe('errorMessage', () => {
  it('returns the message of a ValidationError', () => {
    const r = Result.fail(new ValidationError('Champs invalides'))
    expect(errorMessage(r)).toBe('Champs invalides')
  })

  it('returns the message of a NotFoundError', () => {
    const r = Result.fail(new NotFoundError('Client introuvable'))
    expect(errorMessage(r)).toBe('Client introuvable')
  })

  it('returns the message of an UnauthorizedError', () => {
    const r = Result.fail(new UnauthorizedError('Accès refusé'))
    expect(errorMessage(r)).toBe('Accès refusé')
  })

  it('returns the message of a ConflictError', () => {
    const r = Result.fail(new ConflictError('Email déjà utilisé'))
    expect(errorMessage(r)).toBe('Email déjà utilisé')
  })

  it('returns the message of a generic DomainError', () => {
    const r = Result.fail(new DomainError('Erreur domaine'))
    expect(errorMessage(r)).toBe('Erreur domaine')
  })

  it('returns the default message when there is no error (ok Result)', () => {
    const r = Result.ok()
    expect(errorMessage(r)).toBe('Une erreur est survenue.')
  })

  it('returns the default message when error is null', () => {
    const r = Result.fail(null)
    expect(errorMessage(r)).toBe('Une erreur est survenue.')
  })

  it('returns the error message for a plain Error', () => {
    const r = Result.fail(new Error('quelque chose'))
    expect(errorMessage(r)).toBe('quelque chose')
  })

  it('returns the default message for a non-Error with no message', () => {
    const r = Result.fail({ code: 'X' })
    expect(errorMessage(r)).toBe('Une erreur est survenue.')
  })
})

describe('fieldErrors', () => {
  it('returns the errors map of a ValidationError', () => {
    const errors = { email: ' requis', name: 'trop court' }
    const r = Result.fail(new ValidationError('Invalid', { errors }))
    expect(fieldErrors(r)).toEqual(errors)
  })

  it('defaults to {} when ValidationError has no errors field', () => {
    const r = Result.fail(new ValidationError('Invalid'))
    expect(fieldErrors(r)).toEqual({})
  })

  it('returns {} for a non-ValidationError', () => {
    expect(fieldErrors(Result.fail(new NotFoundError('x')))).toEqual({})
    expect(fieldErrors(Result.fail(new DomainError('x')))).toEqual({})
  })

  it('returns {} for a successful Result', () => {
    expect(fieldErrors(Result.ok())).toEqual({})
  })
})