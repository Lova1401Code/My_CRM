import { httpClient } from '../httpClient.js';
import { Result } from '../../../shared/utils/result.js';
import { createCustomer } from '../../../core/domain/entities/Customer.js';

export class HttpCustomerRepository {
  async findById(id) {
    const result = await httpClient.get(`/customers/${id}`);
    return result.map((data) => (data ? createCustomer(data) : null));
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {} } = {}) {
    const result = await httpClient.get('/customers', {
      page, limit, search,
      ...(filters.ownerId ? { ownerId: filters.ownerId } : {}),
    });
    return result.map((data) => ({
      items: (data.items || []).map(createCustomer),
      total: data.total || 0,
    }));
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