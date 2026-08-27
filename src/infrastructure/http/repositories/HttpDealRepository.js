import { httpClient } from '../httpClient.js';
import { Result } from '../../../shared/utils/result.js';
import { createDeal } from '../../../core/domain/entities/Deal.js';

export class HttpDealRepository {
  async findById(id) {
    const result = await httpClient.get(`/deals/${id}`);
    return result.map((data) => (data ? createDeal(data) : null));
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {} } = {}) {
    const result = await httpClient.get('/deals', {
      page, limit, search,
      ...(filters.ownerId ? { ownerId: filters.ownerId } : {}),
      ...(filters.stage ? { stage: filters.stage } : {}),
    });
    return result.map((data) => ({
      items: (data.items || []).map(createDeal),
      total: data.total || 0,
    }));
  }

  async create(data) {
    const result = await httpClient.post('/deals', data);
    return result.map(createDeal);
  }

  async update(id, data) {
    const result = await httpClient.patch(`/deals/${id}`, data);
    return result.map(createDeal);
  }

  async remove(id) {
    return httpClient.del(`/deals/${id}`);
  }
}