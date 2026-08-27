// Vertical timeline of activities for a related entity.
import { useCallback, useEffect, useState } from 'react';
import { Trash2, Phone, Mail, CalendarDays, Zap, Plus } from 'lucide-react';
import { useActivities } from '../../../adapters/hooks/useActivities.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.jsx';
import { Spinner, EmptyState } from '../ui/Feedback.jsx';
import { PanelCard } from './PanelCard.jsx';
import { ActivityFormModal } from './ActivityFormModal.jsx';
import { errorMessage } from '../../../shared/utils/errors.js';
import { formatDateTime } from '../../../shared/utils/formatters.js';
import {
  ActivityType,
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_STYLES,
} from '../../../core/domain/enums/ActivityType.js';

const TYPE_ICONS = {
  [ActivityType.CALL]: Phone,
  [ActivityType.EMAIL]: Mail,
  [ActivityType.MEETING]: CalendarDays,
  [ActivityType.EVENT]: Zap,
};

export function ActivityTimeline({ relatedType, relatedId }) {
  const { user, isAdmin } = useAuth();
  const { list, remove, loading } = useActivities();
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [busy, setBusy] = useState(false);

  const fetch = useCallback(async () => {
    if (!relatedId) return;
    setFetching(true);
    const result = await list({
      actor: user,
      page: 1,
      limit: 100,
      filters: { relatedType, relatedId },
    });
    setFetching(false);
    if (result.isSuccess) setItems(result.value.items);
    else toast.error(errorMessage(result));
  }, [user, relatedType, relatedId, list, toast]);

  useEffect(() => {
    fetch();
  }, [fetch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    setBusy(true);
    const result = await remove({ actor: user, id: confirmId });
    setBusy(false);
    setConfirmId(null);
    if (result.isSuccess) {
      toast.success('Activité supprimée');
      fetch();
    } else {
      toast.error(errorMessage(result));
    }
  };

  const canDelete = (activity) => isAdmin || activity.ownerId === user?.id;

  return (
    <PanelCard
      title="Historique des activités"
      subtitle="Appels, emails, réunions et événements automatiques"
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
          icon={<Zap className="h-8 w-8" />}
          title="Aucune activité"
          description="Enregistrez un appel, un email ou une réunion pour commencer l'historique."
        />
      ) : (
        <ol className="relative space-y-5 border-l border-slate-200 pl-6">
          {items.map((activity) => {
            const Icon = TYPE_ICONS[activity.type] || Zap;
            return (
              <li key={activity.id} className="relative">
                <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white">
                  <Icon className="h-3 w-3 text-slate-500" />
                </span>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={ACTIVITY_TYPE_STYLES[activity.type]}>
                        {ACTIVITY_TYPE_LABELS[activity.type]}
                      </Badge>
                      <p className="truncate text-sm font-medium text-slate-900">
                        {activity.subject}
                      </p>
                    </div>
                    {activity.description && (
                      <p className="mt-1 text-sm text-slate-600">{activity.description}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDateTime(activity.occurredAt)}
                    </p>
                  </div>
                  {canDelete(activity) && (
                    <button
                      type="button"
                      onClick={() => setConfirmId(activity.id)}
                      className="rounded p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Supprimer l'activité"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <ActivityFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        relatedType={relatedType}
        relatedId={relatedId}
        onCreated={() => fetch()}
      />
      <ConfirmDialog
        open={Boolean(confirmId)}
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="Supprimer l'activité"
        message="Cette activité sera définitivement supprimée de l'historique. Continuer ?"
        loading={busy}
      />
    </PanelCard>
  );
}
