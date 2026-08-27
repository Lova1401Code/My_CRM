import { httpClient } from '../httpClient.js';
import { Result } from '../../../shared/utils/result.js';
import { createUser, toPublicUser } from '../../../core/domain/entities/User.js';

export class HttpUserRepository {
  async findById(id) {
    const result = await httpClient.get(`/users/${id}`);
    return result.map((data) => (data ? createUser(data) : null));
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {} } = {}) {
    const result = await httpClient.get('/users', {
      page, limit, search,
      ...(filters.role ? { role: filters.role } : {}),
    });
    return result.map((data) => ({
      items: (data.items || []).map((u) => createUser(u)),
      total: data.total || 0,
    }));
  }

  async create(data) {
    const result = await httpClient.post('/users', data);
    return result.map((u) => createUser(u));
  }

  async update(id, data) {
    const result = await httpClient.patch(`/users/${id}`, data);
    return result.map((u) => createUser(u));
  }

  async remove(id) {
    return httpClient.del(`/users/${id}`);
  }

  async findByEmail(email) {
    // Not exposed via backend API — users list with search is used instead.
    const result = await httpClient.get('/users', { search: email });
    return result.map((data) => {
      const found = (data.items || []).find((u) => u.email === email);
      return found ? createUser(found) : null;
    });
  }

  async isEmailUnique(email, excludeId) {
    const result = await httpClient.get('/users', { search: email });
    return result.map((data) => {
      const matches = (data.items || []).filter((u) => u.email === email && u.id !== excludeId);
      return matches.length === 0;
    });
  }
}