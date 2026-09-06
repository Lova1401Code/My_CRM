import { httpClient } from '../httpClient.js';
import { Result } from '../../../shared/utils/result.js';
import { createDeal } from '../../../core/domain/entities/Deal.js';

export class HttpDealRepository {
  async findById(id) {
    const result = await httpClient.get(`/deals/${id}`);
    return result.map((data) => (data ? createDeal(data) : null));
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {}, sortBy, sortOrder, dateFrom, dateTo } = {}) {
    const result = await httpClient.get('/deals', {
      page, limit, search,
      ...(filters.ownerId ? { ownerId: filters.ownerId } : {}),
      ...(filters.stage ? { stage: filters.stage } : {}),
      ...(sortBy ? { sortBy } : {}),
      ...(sortOrder ? { sortOrder } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    });
    return result.map((data) => ({
      items: (data.items || []).map(createDeal),
      total: data.total || 0,
    }));
  }

  async export() {
    const token = localStorage.getItem('crm_token');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
    const res = await fetch(`${baseUrl}/deals/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Export failed');
    return res.text();
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