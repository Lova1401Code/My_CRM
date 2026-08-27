// Mock implementation of INoteRepository.
import { db } from '../db/MockDatabase.js';
import { createNote } from '../../../core/domain/entities/Note.js';
import { Result } from '../../../shared/utils/result.js';
import { NotFoundError } from '../../../core/domain/errors/index.js';
import { delay, uid, matchSearch } from '../helpers.js';

const SEARCH_FIELDS = ['content'];

export class MockNoteRepository {
  async findById(id) {
    await delay();
    const found = db.notes.find((n) => n.id === id);
    return Result.ok(found ? createNote(found) : null);
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {} } = {}) {
    await delay();
    let items = [...db.notes];

    if (search) items = matchSearch(items, search, SEARCH_FIELDS);
    if (filters.relatedType) items = items.filter((n) => n.relatedType === filters.relatedType);
    if (filters.relatedId) items = items.filter((n) => n.relatedId === filters.relatedId);
    if (filters.authorId) items = items.filter((n) => n.authorId === filters.authorId);

    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = items.length;
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit).map(createNote);

    return Result.ok({ items: paged, total });
  }

  async create(data) {
    await delay();
    const record = createNote({
      id: uid('n'),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    db.notes.push({ ...record });
    db.save();
    return Result.ok(record);
  }

  async update(id, data) {
    await delay();
    const idx = db.notes.findIndex((n) => n.id === id);
    if (idx === -1) return Result.fail(new NotFoundError('Note introuvable'));
    const updated = {
      ...db.notes[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    db.notes[idx] = updated;
    db.save();
    return Result.ok(createNote(updated));
  }

  async remove(id) {
    await delay();
    const idx = db.notes.findIndex((n) => n.id === id);
    if (idx === -1) return Result.fail(new NotFoundError('Note introuvable'));
    db.notes.splice(idx, 1);
    db.save();
    return Result.ok();
  }
}
