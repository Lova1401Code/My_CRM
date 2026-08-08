// Mock implementation of ICustomerRepository.
import { db } from '../db/MockDatabase.js';
import { createCustomer } from '../../../core/domain/entities/Customer.js';
import { Result } from '../../../shared/utils/result.js';
import { NotFoundError } from '../../../core/domain/errors/index.js';
import { delay, uid, matchSearch } from '../helpers.js';

const SEARCH_FIELDS = ['firstname', 'lastname', 'email', 'phone', 'company'];

export class MockCustomerRepository {
  async findById(id) {
    await delay();
    const found = db.customers.find((c) => c.id === id);
    return Result.ok(found ? createCustomer(found) : null);
  }

  async findAll() {
    await delay();
    return Result.ok(db.customers.map(createCustomer));
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {} } = {}) {
    await delay();
    let items = [...db.customers];

    if (search) items = matchSearch(items, search, SEARCH_FIELDS);
    if (filters.ownerId) items = items.filter((c) => c.ownerId === filters.ownerId);

    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = items.length;
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit).map(createCustomer);

    return Result.ok({ items: paged, total });
  }

  async create(data) {
    await delay();
    const record = createCustomer({
      id: uid('c'),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    db.customers.push({ ...record });
    db.save();
    return Result.ok(record);
  }

  async update(id, data) {
    await delay();
    const idx = db.customers.findIndex((c) => c.id === id);
    if (idx === -1) return Result.fail(new NotFoundError('Client introuvable'));
    const updated = { ...db.customers[idx], ...data, updatedAt: new Date().toISOString() };
    db.customers[idx] = updated;
    db.save();
    return Result.ok(createCustomer(updated));
  }

  async remove(id) {
    await delay();
    const idx = db.customers.findIndex((c) => c.id === id);
    if (idx === -1) return Result.fail(new NotFoundError('Client introuvable'));
    db.customers.splice(idx, 1);
    db.save();
    return Result.ok();
  }

  async count() {
    await delay(50);
    return Result.ok(db.customers.length);
  }

  async countByOwner(ownerId) {
    await delay(50);
    return Result.ok(db.customers.filter((c) => c.ownerId === ownerId).length);
  }
}