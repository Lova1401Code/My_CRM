// Mock implementation of IActivityRepository.
import { db } from '../db/MockDatabase.js';
import { createActivity } from '../../../core/domain/entities/Activity.js';
import { Result } from '../../../shared/utils/result.js';
import { NotFoundError } from '../../../core/domain/errors/index.js';
import { delay, uid, matchSearch } from '../helpers.js';

const SEARCH_FIELDS = ['subject', 'description'];

export class MockActivityRepository {
  async findById(id) {
    await delay();
    const found = db.activities.find((a) => a.id === id);
    return Result.ok(found ? createActivity(found) : null);
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {} } = {}) {
    await delay();
    let items = [...db.activities];

    if (search) items = matchSearch(items, search, SEARCH_FIELDS);
    if (filters.relatedType) items = items.filter((a) => a.relatedType === filters.relatedType);
    if (filters.relatedId) items = items.filter((a) => a.relatedId === filters.relatedId);
    if (filters.ownerId) items = items.filter((a) => a.ownerId === filters.ownerId);
    if (filters.type) items = items.filter((a) => a.type === filters.type);

    items.sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));

    const total = items.length;
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit).map(createActivity);

    return Result.ok({ items: paged, total });
  }

  async create(data) {
    await delay();
    const record = createActivity({
      id: uid('a'),
      ...data,
      occurredAt: data.occurredAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
    db.activities.push({ ...record });
    db.save();
    return Result.ok(record);
  }

  async remove(id) {
    await delay();
    const idx = db.activities.findIndex((a) => a.id === id);
    if (idx === -1) return Result.fail(new NotFoundError('Activité introuvable'));
    db.activities.splice(idx, 1);
    db.save();
    return Result.ok();
  }
}
