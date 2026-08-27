import { httpClient } from '../httpClient.js';
import { Result } from '../../../shared/utils/result.js';
import { createNote } from '../../../core/domain/entities/Note.js';

export class HttpNoteRepository {
  async findById(id) {
    const result = await httpClient.get(`/notes/${id}`);
    return result.map((data) => (data ? createNote(data) : null));
  }

  async findMany({ page = 1, limit = 10, search = '', filters = {} } = {}) {
    const result = await httpClient.get('/notes', {
      page, limit, search,
      ...(filters.relatedType ? { relatedType: filters.relatedType } : {}),
      ...(filters.relatedId ? { relatedId: filters.relatedId } : {}),
      ...(filters.authorId ? { authorId: filters.authorId } : {}),
    });
    return result.map((data) => ({
      items: (data.items || []).map(createNote),
      total: data.total || 0,
    }));
  }

  async create(data) {
    const result = await httpClient.post('/notes', data);
    return result.map(createNote);
  }

  async update(id, data) {
    const result = await httpClient.patch(`/notes/${id}`, data);
    return result.map(createNote);
  }

  async remove(id) {
    return httpClient.del(`/notes/${id}`);
  }
}