// Lead detail page: info header + activities, tasks and notes + conversion.
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Mail, Pencil, Phone, Repeat, Tag, Trash2 } from 'lucide-react';
import { useLeads } from '../../adapters/hooks/useLeads.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Spinner } from '../components/ui/Feedback.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { ActivityTimeline } from '../components/entities/ActivityTimeline.jsx';
import { TaskListPanel } from '../components/entities/TaskListPanel.jsx';
import { NotesPanel } from '../components/entities/NotesPanel.jsx';
import { errorMessage } from '../../shared/utils/errors.js';
import { formatDate, formatPhone } from '../../shared/utils/formatters.js';
import {
  LeadStatus,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_STYLES,
} from '../../core/domain/enums/LeadStatus.js';
import { RelatedEntityType } from '../../core/domain/enums/RelatedEntityType.js';

export function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { get, remove, convert, loading } = useLeads();
  const toast = useToast();

  const [lead, setLead] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchLead = useCallback(async () => {
    setFetching(true);
    const result = await get({ actor: user, id });
    setFetching(false);
    if (result.isSuccess && result.value) {
      setLead(result.value);
    } else if (result.isFailure) {
      if (!lead) setNotFound(true);
      toast.error(errorMessage(result));
    }
  }, [user, id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchLead();
  }, [fetchLead]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    setBusy(true);
    const result = await remove({ actor: user, id });
    setBusy(false);
    setConfirmOpen(false);
    if (result.isSuccess) {
      toast.success('Prospect supprimé');
      navigate('/leads');
    } else {
      toast.error(errorMessage(result));
    }
  };

  const handleConvert = async () => {
    setBusy(true);
    const result = await convert({ actor: user, leadId: id });
    setBusy(false);
    setConvertOpen(false);
    if (result.isSuccess) {
      toast.success('Prospect converti en client');
      navigate(`/customers/${result.value.customer.id}`);
    } else {
      toast.error(errorMessage(result));
    }
  };

  if (fetching && !lead) return <Spinner className="py-20" />;

  if (notFound || !lead) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Prospect introuvable.</p>
        <Button variant="secondary" onClick={() => navigate('/leads')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Link
          to="/leads"
          className="inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Prospects
        </Link>
      </div>

      <div className="rounded-lg bg-white p-5 ring-1 ring-slate-200 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
              {(lead.firstname?.[0] || '') + (lead.lastname?.[0] || '')}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {lead.firstname} {lead.lastname}
              </h1>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Building2 className="h-4 w-4" />
                {lead.company || '—'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
                {lead.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-slate-400" />
                    {lead.email}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {formatPhone(lead.phone)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-slate-400" />
                  Source : {lead.source || '—'}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge className={LEAD_STATUS_STYLES[lead.status]}>
                  {LEAD_STATUS_LABELS[lead.status]}
                </Badge>
                <Badge className="bg-slate-100 text-slate-700 ring-slate-600/20">
                  Créé le {formatDate(lead.createdAt)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {lead.status !== LeadStatus.CONVERTED && (
              <Button size="sm" onClick={() => setConvertOpen(true)}>
                <Repeat className="h-4 w-4" />
                Convertir en client
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/leads/${lead.id}/edit`)}
            >
              <Pencil className="h-4 w-4" />
              Modifier
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ActivityTimeline relatedType={RelatedEntityType.LEAD} relatedId={lead.id} />
        <TaskListPanel
          title="Tâches liées"
          filters={{ relatedType: RelatedEntityType.LEAD, relatedId: lead.id }}
          relatedType={RelatedEntityType.LEAD}
          relatedId={lead.id}
        />
      </div>
      <NotesPanel relatedType={RelatedEntityType.LEAD} relatedId={lead.id} />

      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer le prospect"
        message="Cette action est irréversible. Voulez-vous vraiment supprimer ce prospect ?"
        confirmLabel="Supprimer"
        loading={busy || loading}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
      <ConfirmDialog
        open={convertOpen}
        title="Convertir en client"
        message="Ce prospect deviendra un client et son statut passera à « Converti ». Continuer ?"
        confirmLabel="Convertir"
        variant="primary"
        loading={busy || loading}
        onConfirm={handleConvert}
        onCancel={() => setConvertOpen(false)}
      />
    </div>
  );
}
