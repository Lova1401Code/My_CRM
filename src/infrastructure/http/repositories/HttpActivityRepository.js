import { httpClient } from '../httpClient.js';
import { Result } from '../../../shared/utils/result.js';
import { createActivity } from '../../../core/domain/entities/Activity.js';

export class HttpActivityRepository {
  async findById(id) {
    const result = await httpClient.get(`/activities/${id}`);
    return result.map((data) => (data ? createActivity(data) : null));
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {} } = {}) {
    const result = await httpClient.get('/activities', {
      page, limit, search,
      ...(filters.ownerId ? { ownerId: filters.ownerId } : {}),
      ...(filters.relatedType ? { relatedType: filters.relatedType } : {}),
      ...(filters.relatedId ? { relatedId: filters.relatedId } : {}),
    });
    return result.map((data) => ({
      items: (data.items || []).map(createActivity),
      total: data.total || 0,
    }));
  }

  async create(data) {
    const result = await httpClient.post('/activities', data);
    return result.map(createActivity);
  }

  async update(id, data) {
    const result = await httpClient.patch(`/activities/${id}`, data);
    return result.map(createActivity);
  }

  async remove(id) {
    return httpClient.del(`/activities/${id}`);
  }
}