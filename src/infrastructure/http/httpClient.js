import { Result } from '../../shared/utils/result.js';
import {
  DomainError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from '../../core/domain/errors/index.js';
import { APP } from '../../core/config/constants.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem(APP.TOKEN_KEY) || null;
}

function mapError(status, body) {
  const message = body?.message || 'Erreur inconnue';
  switch (status) {
    case 400:
      return new ValidationError(message, { errors: body?.details || {} });
    case 401:
      return new UnauthorizedError(message);
    case 403:
      return new UnauthorizedError(message);
    case 404:
      return new NotFoundError(message);
    case 409:
      return new ConflictError(message);
    default:
      return new DomainError(message, body?.code || 'HTTP_ERROR', body?.details || {});
  }
}

async function request(method, path, { params, body } = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
      localStorage.removeItem(APP.TOKEN_KEY);
      localStorage.removeItem(APP.USER_KEY);
    }

    const text = await response.text();
    const parsed = text ? JSON.parse(text) : null;

    if (!response.ok) {
      return Result.fail(mapError(response.status, parsed));
    }

    return Result.ok(parsed);
  } catch (err) {
    if (err instanceof DomainError) return Result.fail(err);
    return Result.fail(new DomainError(err.message || 'Erreur réseau', 'NETWORK_ERROR', {}));
  }
}

export const httpClient = {
  get: (path, params) => request('GET', path, { params }),
  post: (path, body) => request('POST', path, { body }),
  patch: (path, body) => request('PATCH', path, { body }),
  del: (path) => request('DELETE', path),
};