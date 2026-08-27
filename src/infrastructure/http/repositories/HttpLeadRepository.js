import { httpClient } from '../httpClient.js';
import { Result } from '../../../shared/utils/result.js';
import { createLead } from '../../../core/domain/entities/Lead.js';

export class HttpLeadRepository {
  async findById(id) {
    const result = await httpClient.get(`/leads/${id}`);
    return result.map((data) => (data ? createLead(data) : null));
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {} } = {}) {
    const result = await httpClient.get('/leads', {
      page, limit, search,
      ...(filters.ownerId ? { ownerId: filters.ownerId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    });
    return result.map((data) => ({
      items: (data.items || []).map(createLead),
      total: data.total || 0,
    }));
  }

  async create(data) {
    const result = await httpClient.post('/leads', data);
    return result.map(createLead);
  }

  async update(id, data) {
    const result = await httpClient.patch(`/leads/${id}`, data);
    return result.map(createLead);
  }

  async remove(id) {
    return httpClient.del(`/leads/${id}`);
  }

  async convertToCustomer(leadId) {
    const result = await httpClient.post(`/leads/${leadId}/convert`);
    return result.map((data) => data);
  }
}