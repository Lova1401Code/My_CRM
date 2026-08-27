import { httpClient } from '../httpClient.js';
import { Result } from '../../../shared/utils/result.js';
import { createTask } from '../../../core/domain/entities/Task.js';

export class HttpTaskRepository {
  async findById(id) {
    const result = await httpClient.get(`/tasks/${id}`);
    return result.map((data) => (data ? createTask(data) : null));
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {} } = {}) {
    const result = await httpClient.get('/tasks', {
      page, limit, search,
      ...(filters.ownerId ? { ownerId: filters.ownerId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.relatedType ? { relatedType: filters.relatedType } : {}),
      ...(filters.relatedId ? { relatedId: filters.relatedId } : {}),
    });
    return result.map((data) => ({
      items: (data.items || []).map(createTask),
      total: data.total || 0,
    }));
  }

  async create(data) {
    const result = await httpClient.post('/tasks', data);
    return result.map(createTask);
  }

  async update(id, data) {
    const result = await httpClient.patch(`/tasks/${id}`, data);
    return result.map(createTask);
  }

  async toggle(id) {
    const result = await httpClient.post(`/tasks/${id}/toggle`);
    return result.map(createTask);
  }

  async remove(id) {
    return httpClient.del(`/tasks/${id}`);
  }
}