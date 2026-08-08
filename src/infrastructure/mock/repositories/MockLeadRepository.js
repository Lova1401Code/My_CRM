// Mock implementation of ILeadRepository.
import { db } from '../db/MockDatabase.js';
import { createLead } from '../../../core/domain/entities/Lead.js';
import { Result } from '../../../shared/utils/result.js';
import { NotFoundError } from '../../../core/domain/errors/index.js';
import { delay, uid, matchSearch } from '../helpers.js';
import { LeadStatus } from '../../../core/domain/enums/LeadStatus.js';

const SEARCH_FIELDS = ['firstname', 'lastname', 'email', 'phone', 'company'];

export class MockLeadRepository {
  async findById(id) {
    await delay();
    const found = db.leads.find((l) => l.id === id);
    return Result.ok(found ? createLead(found) : null);
  }

  async findAll() {
    await delay();
    return Result.ok(db.leads.map(createLead));
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {} } = {}) {
    await delay();
    let items = [...db.leads];

    if (search) items = matchSearch(items, search, SEARCH_FIELDS);
    if (filters.ownerId) items = items.filter((l) => l.ownerId === filters.ownerId);
    if (filters.status) items = items.filter((l) => l.status === filters.status);

    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = items.length;
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit).map(createLead);

    return Result.ok({ items: paged, total });
  }

  async create(data) {
    await delay();
    const record = createLead({
      id: uid('l'),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    db.leads.push({ ...record });
    db.save();
    return Result.ok(record);
  }

  async update(id, data) {
    await delay();
    const idx = db.leads.findIndex((l) => l.id === id);
    if (idx === -1) return Result.fail(new NotFoundError('Prospect introuvable'));
    const updated = { ...db.leads[idx], ...data, updatedAt: new Date().toISOString() };
    db.leads[idx] = updated;
    db.save();
    return Result.ok(createLead(updated));
  }

  async remove(id) {
    await delay();
    const idx = db.leads.findIndex((l) => l.id === id);
    if (idx === -1) return Result.fail(new NotFoundError('Prospect introuvable'));
    db.leads.splice(idx, 1);
    db.save();
    return Result.ok();
  }

  async count() {
    await delay(50);
    return Result.ok(db.leads.length);
  }

  async countByStatus(status) {
    await delay(50);
    return Result.ok(db.leads.filter((l) => l.status === status).length);
  }

  async countConverted() {
    return this.countByStatus(LeadStatus.CONVERTED);
  }
}