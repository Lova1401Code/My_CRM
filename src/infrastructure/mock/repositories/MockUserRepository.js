// Mock implementation of IUserRepository.
import { db } from '../db/MockDatabase.js';
import { createUser, toPublicUser } from '../../../core/domain/entities/User.js';
import { Result } from '../../../shared/utils/result.js';
import { NotFoundError, ConflictError } from '../../../core/domain/errors/index.js';
import { delay, uid, matchSearch } from '../helpers.js';
import { UserStatus } from '../../../core/domain/enums/UserStatus.js';

const SEARCH_FIELDS = ['firstname', 'lastname', 'email', 'phone'];

export class MockUserRepository {
  async findById(id) {
    await delay();
    const found = db.users.find((u) => u.id === id);
    return Result.ok(found ? toPublicUser(createUser(found)) : null);
  }

  async findByEmail(email) {
    await delay();
    const found = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return Result.ok(found ? createUser(found) : null);
  }

  async isEmailUnique(email, excludeId = null) {
    await delay(100);
    const exists = db.users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== excludeId,
    );
    return Result.ok(!exists);
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {} } = {}) {
    await delay();
    let items = [...db.users];

    if (search) items = matchSearch(items, search, SEARCH_FIELDS);

    if (filters.role) items = items.filter((u) => u.role === filters.role);
    if (filters.status) items = items.filter((u) => u.status === filters.status);

    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = items.length;
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit).map((u) => toPublicUser(createUser(u)));

    return Result.ok({ items: paged, total });
  }

  async create(data) {
    await delay();
    const record = createUser({
      id: uid('u'),
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      phone: data.phone || '',
      role: data.role,
      status: data.status || UserStatus.ACTIVE,
      password: data.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    db.users.push({ ...record });
    db.save();
    return Result.ok(toPublicUser(record));
  }

  async update(id, data) {
    await delay();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return Result.fail(new NotFoundError('Utilisateur introuvable'));
    const current = db.users[idx];
    const updated = {
      ...current,
      ...data,
      password: data.password || current.password,
      updatedAt: new Date().toISOString(),
    };
    db.users[idx] = updated;
    db.save();
    return Result.ok(toPublicUser(createUser(updated)));
  }

  // Internal: returns full user including password (used only by AuthService).
  async findByIdWithCredentials(id) {
    await delay(50);
    const found = db.users.find((u) => u.id === id);
    return Result.ok(found ? createUser(found) : null);
  }

  async remove(id) {
    await delay();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return Result.fail(new NotFoundError('Utilisateur introuvable'));
    db.users.splice(idx, 1);
    db.save();
    return Result.ok();
  }

  async count() {
    await delay(50);
    return Result.ok(db.users.length);
  }
}