// Pagination controls.
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PAGINATION } from '../../../core/config/constants.js';

export function Pagination({ page, limit, total, onPageChange, onLimitChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-1 py-3 sm:flex-row">
      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
        <span>
          {from}-{to} sur {total}
        </span>
        {onLimitChange && (
          <label className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">par page</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="rounded-md border-0 bg-white px-2 py-1 text-sm ring-1 ring-slate-300 focus:ring-2 focus:ring-indigo-600 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-600"
            >
              {PAGINATION.PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center rounded-md p-1.5 text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-300 dark:ring-slate-600 dark:hover:bg-slate-800"
          aria-label="Page précédente"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm text-slate-700 dark:text-slate-200">
          Page {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center rounded-md p-1.5 text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-300 dark:ring-slate-600 dark:hover:bg-slate-800"
          aria-label="Page suivante"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}