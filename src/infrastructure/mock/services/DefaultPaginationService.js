// Default pagination service.
export class DefaultPaginationService {
  paginate(items, page = 1, limit = 10) {
    const total = items.length;
    const safeLimit = Math.max(1, Number(limit) || 10);
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
    const start = (safePage - 1) * safeLimit;
    return {
      items: items.slice(start, start + safeLimit),
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
    };
  }
}

export const paginationService = new DefaultPaginationService();