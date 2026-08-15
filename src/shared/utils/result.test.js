import { describe, it, expect } from 'vitest'
import { Result } from './result.js'

describe('Result', () => {
  describe('Result.ok', () => {
    it('creates a successful Result with a value', () => {
      const r = Result.ok('hello')
      expect(r.isSuccess).toBe(true)
      expect(r.isFailure).toBe(false)
      expect(r.value).toBe('hello')
      expect(r.error).toBeNull()
    })

    it('defaults value to null when no argument is passed', () => {
      const r = Result.ok()
      expect(r.isSuccess).toBe(true)
      expect(r.value).toBeNull()
    })

    it('allows falsy values (0, false, empty string)', () => {
      expect(Result.ok(0).value).toBe(0)
      expect(Result.ok(false).value).toBe(false)
      expect(Result.ok('').value).toBe('')
    })
  })

  describe('Result.fail', () => {
    it('creates a failed Result with an error', () => {
      const err = new Error('boom')
      const r = Result.fail(err)
      expect(r.isFailure).toBe(true)
      expect(r.isSuccess).toBe(false)
      expect(r.error).toBe(err)
    })

    it('allows an object as error', () => {
      const r = Result.fail({ code: 'X' })
      expect(r.isFailure).toBe(true)
      expect(r.error).toEqual({ code: 'X' })
    })
  })

  describe('value getter', () => {
    it('throws when accessed on a failed Result', () => {
      const r = Result.fail(new Error('nope'))
      expect(() => r.value).toThrow('Cannot retrieve value from a failed Result.')
    })
  })

  describe('map', () => {
    it('transforms the value on a successful Result', () => {
      const r = Result.ok(2).map((n) => n * 3)
      expect(r.isSuccess).toBe(true)
      expect(r.value).toBe(6)
    })

    it('passes through a failed Result unchanged', () => {
      const err = new Error('fail')
      const r = Result.fail(err).map((n) => n * 3)
      expect(r.isFailure).toBe(true)
      expect(r.error).toBe(err)
    })
  })

  describe('mapError', () => {
    it('transforms the error on a failed Result', () => {
      const r = Result.fail(new Error('a')).mapError((e) => new Error(e.message + 'b'))
      expect(r.isFailure).toBe(true)
      expect(r.error.message).toBe('ab')
    })

    it('passes through a successful Result unchanged', () => {
      const r = Result.ok(5).mapError((e) => new Error('x'))
      expect(r.isSuccess).toBe(true)
      expect(r.value).toBe(5)
    })
  })

  describe('fold', () => {
    it('calls onSuccess with the value on a successful Result', () => {
      const r = Result.ok(10)
      const res = r.fold(
        (v) => `ok:${v}`,
        () => 'fail',
      )
      expect(res).toBe('ok:10')
    })

    it('calls onFailure with the error on a failed Result', () => {
      const r = Result.fail(new Error('boom'))
      const res = r.fold(
        () => 'ok',
        (e) => `fail:${e.message}`,
      )
      expect(res).toBe('fail:boom')
    })
  })
})