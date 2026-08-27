// Reusable task list panel with due-date highlighting.
// Used on detail pages (scoped to one entity) and the dashboard.
import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Circle, Pencil, Plus, Trash2, ListTodo } from 'lucide-react';
import { useTasks } from '../../../adapters/hooks/useTasks.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.jsx';
import { Spinner, EmptyState } from '../ui/Feedback.jsx';
import { PanelCard } from './PanelCard.jsx';
import { TaskFormModal } from './TaskFormModal.jsx';
import { errorMessage } from '../../../shared/utils/errors.js';
import { formatDate } from '../../../shared/utils/formatters.js';
import { getDueBucket } from '../../../shared/utils/dateHelpers.js';
import {
  TaskStatus,
  TASK_STATUS_LABELS,
  TASK_STATUS_STYLES,
} from '../../../core/domain/enums/TaskStatus.js';
import {
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_STYLES,
} from '../../../core/domain/enums/TaskPriority.js';

const DUE_BUCKET_STYLES = {
  overdue: 'text-rose-600 font-medium',
  today: 'text-amber-600 font-medium',
  upcoming: 'text-slate-500',
};

const DUE_BUCKET_LABELS = {
  overdue: 'En retard',
  today: "Aujourd'hui",
};

function DueLabel({ task }) {
  const bucket = getDueBucket(task.status === TaskStatus.DONE ? null : task.dueDate);
  if (bucket === 'none') return <span className="text-xs text-slate-400">{formatDate(task.dueDate)}</span>;
  return (
    <span className={`text-xs ${DUE_BUCKET_STYLES[bucket]}`}>
      {bucket === 'upcoming' ? formatDate(task.dueDate) : DUE_BUCKET_LABELS[bucket]}
      {' · '}
      {formatDate(task.dueDate)}
    </span>
  );
}

export function TaskListPanel({
  title = 'Tâches',
  filters = {},
  relatedType,
  relatedId,
  limit = 50,
  onLoaded,
}) {
  const { user, isAdmin } = useAuth();
  const { list, toggleComplete, remove, loading } = useTasks();
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [busy, setBusy] = useState(false);

  const fetch = useCallback(async () => {
    setFetching(true);
    const result = await list({ actor: user, page: 1, limit, filters });
    setFetching(false);
    if (result.isSuccess) {
      setItems(result.value.items);
      onLoaded?.(result.value.total);
    } else {
      toast.error(errorMessage(result));
    }
  }, [user, list, toast, JSON.stringify(filters), limit, onLoaded]);

  useEffect(() => {
    fetch();
  }, [fetch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = async (task) => {
    const result = await toggleComplete({ actor: user, id: task.id });
    if (result.isSuccess) {
      fetch();
    } else {
      toast.error(errorMessage(result));
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    const result = await remove({ actor: user, id: confirmId });
    setBusy(false);
    setConfirmId(null);
    if (result.isSuccess) {
      toast.success('Tâche supprimée');
      fetch();
    } else {
      toast.error(errorMessage(result));
    }
  };

  return (
    <PanelCard
      title={title}
      subtitle={relatedId ? undefined : 'Vos tâches et rappels'}
      action={
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      }
    >
      {fetching || loading ? (
        <Spinner className="py-8" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<ListTodo className="h-8 w-8" />}
          title="Aucune tâche"
          description="Créez une tâche pour ne rien oublier."
        />
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((task) => {
            const isDone = task.status === TaskStatus.DONE;
            const canManage = isAdmin || task.ownerId === user?.id;
            return (
              <li key={task.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => handleToggle(task)}
                  disabled={!canManage}
                  className="mt-0.5 shrink-0 text-slate-400 transition hover:text-emerald-600 disabled:cursor-not-allowed"
                  aria-label={isDone ? 'Rouvrir la tâche' : 'Marquer comme terminée'}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm ${
                      isDone ? 'text-slate-400 line-through' : 'font-medium text-slate-900'
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && !isDone && (
                    <p className="mt-0.5 truncate text-xs text-slate-500">{task.description}</p>
                  )}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <DueLabel task={task} />
                    {!isDone && (
                      <>
                        <Badge className={TASK_PRIORITY_STYLES[task.priority]}>
                          {TASK_PRIORITY_LABELS[task.priority]}
                        </Badge>
                        {getDueBucket(task.dueDate) === 'overdue' && (
                          <Badge className="bg-rose-50 text-rose-700 ring-rose-600/20">
                            En retard
                          </Badge>
                        )}
                      </>
                    )}
                    {isDone && (
                      <Badge className={TASK_STATUS_STYLES[task.status]}>
                        {TASK_STATUS_LABELS[task.status]}
                      </Badge>
                    )}
                  </div>
                </div>
                {canManage && (
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingTask(task)}
                      className="rounded p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      aria-label="Modifier la tâche"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(task.id)}
                      className="rounded p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Supprimer la tâche"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <TaskFormModal
        open={formOpen || Boolean(editingTask)}
        onClose={() => {
          setFormOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        defaultRelated={
          relatedId ? { relatedType, relatedId } : null
        }
        onSaved={() => {
          setEditingTask(null);
          fetch();
        }}
      />
      <ConfirmDialog
        open={Boolean(confirmId)}
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="Supprimer la tâche"
        message="Cette tâche sera définitivement supprimée. Continuer ?"
        loading={busy}
      />
    </PanelCard>
  );
}
