import { httpClient } from '../httpClient.js';
import { Result } from '../../../shared/utils/result.js';
import { ValidationError } from '../../../core/domain/errors/index.js';
import { createUser, toPublicUser } from '../../../core/domain/entities/User.js';

export class HttpAuthService {
  async login(email, password) {
    if (!email || !password) {
      return Result.fail(new ValidationError('Email et mot de passe requis'));
    }
    const result = await httpClient.post('/auth/login', { email, password });
    return result.map((data) => ({
      token: data.token,
      user: toPublicUser(createUser(data.user)),
    }));
  }

  async logout() {
    await httpClient.post('/auth/logout');
    return Result.ok();
  }

  async getProfile(token) {
    const result = await httpClient.get('/auth/profile');
    if (result.isFailure) return Result.ok(null);
    if (!result.value) return Result.ok(null);
    return Result.ok(toPublicUser(createUser(result.value)));
  }
}