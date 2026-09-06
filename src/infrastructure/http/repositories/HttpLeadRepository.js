import { httpClient } from '../httpClient.js';
import { Result } from '../../../shared/utils/result.js';
import { createLead } from '../../../core/domain/entities/Lead.js';

export class HttpLeadRepository {
  async findById(id) {
    const result = await httpClient.get(`/leads/${id}`);
    return result.map((data) => (data ? createLead(data) : null));
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {}, sortBy, sortOrder, dateFrom, dateTo } = {}) {
    const result = await httpClient.get('/leads', {
      page, limit, search,
      ...(filters.ownerId ? { ownerId: filters.ownerId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.source ? { source: filters.source } : {}),
      ...(filters.tag ? { tag: filters.tag } : {}),
      ...(sortBy ? { sortBy } : {}),
      ...(sortOrder ? { sortOrder } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    });
    return result.map((data) => ({
      items: (data.items || []).map(createLead),
      total: data.total || 0,
    }));
  }

  async export() {
    const token = localStorage.getItem('crm_token');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
    const res = await fetch(`${baseUrl}/leads/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Export failed');
    return res.text();
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