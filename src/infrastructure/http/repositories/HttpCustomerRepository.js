import { httpClient } from '../httpClient.js';
import { Result } from '../../../shared/utils/result.js';
import { createCustomer } from '../../../core/domain/entities/Customer.js';

export class HttpCustomerRepository {
  async findById(id) {
    const result = await httpClient.get(`/customers/${id}`);
    return result.map((data) => (data ? createCustomer(data) : null));
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {}, sortBy, sortOrder, dateFrom, dateTo } = {}) {
    const result = await httpClient.get('/customers', {
      page, limit, search,
      ...(filters.ownerId ? { ownerId: filters.ownerId } : {}),
      ...(filters.tag ? { tag: filters.tag } : {}),
      ...(sortBy ? { sortBy } : {}),
      ...(sortOrder ? { sortOrder } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    });
    return result.map((data) => ({
      items: (data.items || []).map(createCustomer),
      total: data.total || 0,
    }));
  }

  async export() {
    const token = localStorage.getItem('crm_token');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
    const res = await fetch(`${baseUrl}/customers/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Export failed');
    return res.text();
  }

  async create(data) {
    const result = await httpClient.post('/customers', data);
    return result.map(createCustomer);
  }

  async update(id, data) {
    const result = await httpClient.patch(`/customers/${id}`, data);
    return result.map(createCustomer);
  }

  async remove(id) {
    return httpClient.del(`/customers/${id}`);
  }
}