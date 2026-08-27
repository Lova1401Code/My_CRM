// Mock implementation of ITaskRepository.
import { db } from '../db/MockDatabase.js';
import { createTask } from '../../../core/domain/entities/Task.js';
import { Result } from '../../../shared/utils/result.js';
import { NotFoundError } from '../../../core/domain/errors/index.js';
import { delay, uid, matchSearch } from '../helpers.js';
import { TaskStatus } from '../../../core/domain/enums/TaskStatus.js';

const SEARCH_FIELDS = ['title', 'description'];

export class MockTaskRepository {
  async findById(id) {
    await delay();
    const found = db.tasks.find((t) => t.id === id);
    return Result.ok(found ? createTask(found) : null);
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {} } = {}) {
    await delay();
    let items = [...db.tasks];

    if (search) items = matchSearch(items, search, SEARCH_FIELDS);
    if (filters.status) items = items.filter((t) => t.status === filters.status);
    if (filters.ownerId) items = items.filter((t) => t.ownerId === filters.ownerId);
    if (filters.priority) items = items.filter((t) => t.priority === filters.priority);
    if (filters.relatedType) items = items.filter((t) => t.relatedType === filters.relatedType);
    if (filters.relatedId) items = items.filter((t) => t.relatedId === filters.relatedId);
    if (filters.dueFrom) {
      items = items.filter((t) => !t.dueDate || t.dueDate >= filters.dueFrom);
    }
    if (filters.dueTo) {
      const to = `${filters.dueTo}T23:59:59.999`;
      items = items.filter(
        (t) => t.dueDate && new Date(`${t.dueDate}T23:59:59.999`) <= new Date(to),
      );
    }

    // Open tasks first (most urgent due date first), then done tasks.
    items.sort((a, b) => {
      if (a.status !== b.status) return a.status === TaskStatus.OPEN ? -1 : 1;
      if (a.status === TaskStatus.OPEN) {
        return String(a.dueDate).localeCompare(String(b.dueDate));
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    const total = items.length;
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit).map(createTask);

    return Result.ok({ items: paged, total });
  }

  async create(data) {
    await delay();
    const record = createTask({
      id: uid('t'),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    db.tasks.push({ ...record });
    db.save();
    return Result.ok(record);
  }

  async update(id, data) {
    await delay();
    const idx = db.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return Result.fail(new NotFoundError('Tâche introuvable'));
    const updated = {
      ...db.tasks[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    db.tasks[idx] = updated;
    db.save();
    return Result.ok(createTask(updated));
  }

  async remove(id) {
    await delay();
    const idx = db.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return Result.fail(new NotFoundError('Tâche introuvable'));
    db.tasks.splice(idx, 1);
    db.save();
    return Result.ok();
  }
}
