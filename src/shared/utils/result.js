// Result<T> monad for explicit error handling without exceptions at the application boundary.

export class Result {
  constructor(value, error) {
    this._value = value;
    this._error = error;
  }

  static ok(value = null) {
    return new Result(value, null);
  }

  static fail(error) {
    return new Result(null, error);
  }

  get isSuccess() {
    return this._error === null && this._error !== undefined;
  }

  get isFailure() {
    return !this.isSuccess;
  }

  get value() {
    if (this.isFailure) {
      throw new Error('Cannot retrieve value from a failed Result.');
    }
    return this._value;
  }

  get error() {
    return this._error;
  }

  map(fn) {
    if (this.isFailure) return this;
    return Result.ok(fn(this._value));
  }

  mapError(fn) {
    if (this.isSuccess) return this;
    return Result.fail(fn(this._error));
  }

  fold(onSuccess, onFailure) {
    return this.isSuccess ? onSuccess(this._value) : onFailure(this._error);
  }
}