// Mock implementation of IDealRepository.
import { db } from '../db/MockDatabase.js';
import { createDeal } from '../../../core/domain/entities/Deal.js';
import { Result } from '../../../shared/utils/result.js';
import { NotFoundError } from '../../../core/domain/errors/index.js';
import { delay, uid, matchSearch } from '../helpers.js';

const SEARCH_FIELDS = ['title'];

export class MockDealRepository {
  async findById(id) {
    await delay();
    const found = db.deals.find((d) => d.id === id);
    return Result.ok(found ? createDeal(found) : null);
  }

  async findAll() {
    await delay();
    return Result.ok(db.deals.map(createDeal));
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {} } = {}) {
    await delay();
    let items = [...db.deals];

    if (search) items = matchSearch(items, search, SEARCH_FIELDS);
    if (filters.customerId) items = items.filter((d) => d.customerId === filters.customerId);
    if (filters.ownerId) items = items.filter((d) => d.ownerId === filters.ownerId);
    if (filters.stage) items = items.filter((d) => d.stage === filters.stage);
    if (filters.createdFrom) {
      items = items.filter((d) => new Date(d.createdAt) >= new Date(filters.createdFrom));
    }
    if (filters.createdTo) {
      items = items.filter((d) => new Date(d.createdAt) <= new Date(`${filters.createdTo}T23:59:59.999`));
    }

    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = items.length;
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit).map(createDeal);

    return Result.ok({ items: paged, total });
  }

  async create(data) {
    await delay();
    const record = createDeal({
      id: uid('d'),
      ...data,
      amount: Number(data.amount) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    db.deals.push({ ...record });
    db.save();
    return Result.ok(record);
  }

  async update(id, data) {
    await delay();
    const idx = db.deals.findIndex((d) => d.id === id);
    if (idx === -1) return Result.fail(new NotFoundError('Affaire introuvable'));
    const updated = {
      ...db.deals[idx],
      ...data,
      amount: data.amount !== undefined ? Number(data.amount) || 0 : db.deals[idx].amount,
      updatedAt: new Date().toISOString(),
    };
    db.deals[idx] = updated;
    db.save();
    return Result.ok(createDeal(updated));
  }

  async remove(id) {
    await delay();
    const idx = db.deals.findIndex((d) => d.id === id);
    if (idx === -1) return Result.fail(new NotFoundError('Affaire introuvable'));
    db.deals.splice(idx, 1);
    db.save();
    return Result.ok();
  }

  async count() {
    await delay(50);
    return Result.ok(db.deals.length);
  }

  async countByStage(stage) {
    await delay(50);
    return Result.ok(db.deals.filter((d) => d.stage === stage).length);
  }
}
