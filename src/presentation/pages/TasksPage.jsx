// Global tasks page with status and due-date filters.
import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { TaskListPanel } from '../components/entities/TaskListPanel.jsx';
import { TaskFormModal } from '../components/entities/TaskFormModal.jsx';
import { toDateString } from '../../shared/utils/dateHelpers.js';

const STATUS_TABS = [
  { value: '', label: 'Toutes' },
  { value: 'OPEN', label: 'À faire' },
  { value: 'DONE', label: 'Terminées' },
];

const DUE_TABS = [
  { value: '', label: 'Toutes échéances' },
  { value: 'overdue', label: 'En retard' },
  { value: 'today', label: "Aujourd'hui" },
  { value: 'upcoming', label: 'À venir' },
];

function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

export function TasksPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [dueFilter, setDueFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [total, setTotal] = useState(null);

  // Translate UI tabs into repository-level filters.
  const filters = useMemo(() => {
    if (statusFilter === 'DONE') return { status: 'DONE' };
    if (statusFilter === 'OPEN') {
      if (!dueFilter) return { status: 'OPEN' };
    }
    const f = {};
    const today = toDateString(new Date());
    if (statusFilter) f.status = statusFilter;
    if (dueFilter === 'overdue') {
      f.status = 'OPEN';
      f.dueTo = addDays(today, -1);
    } else if (dueFilter === 'today') {
      f.status = 'OPEN';
      f.dueFrom = today;
      f.dueTo = today;
    } else if (dueFilter === 'upcoming') {
      f.status = 'OPEN';
      f.dueFrom = addDays(today, 1);
    }
    return f;
  }, [statusFilter, dueFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tâches</h1>
          <p className="mt-1 text-sm text-slate-500">
            {total === null ? 'Chargement…' : `${total} tâche(s)`}
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" /> Nouvelle tâche
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex rounded-md bg-slate-100 p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                statusFilter === tab.value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <select
          value={dueFilter}
          onChange={(e) => setDueFilter(e.target.value)}
          disabled={statusFilter === 'DONE'}
          className="rounded-md border-0 bg-white px-3 py-2 text-sm ring-1 ring-slate-300 focus:ring-2 focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-50"
        >
          {DUE_TABS.map((tab) => (
            <option key={tab.value} value={tab.value}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      <TaskListPanel
        title="Mes tâches"
        subtitle="Tâches et rappels, les plus urgentes en premier"
        filters={filters}
        limit={100}
        onLoaded={(count) => setTotal(count)}
      />

      <TaskFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
