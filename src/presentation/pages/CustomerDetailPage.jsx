// Customer detail page: info header + activities, tasks and notes.
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Mail, MapPin, Pencil, Phone, Trash2 } from 'lucide-react';
import { useCustomers } from '../../adapters/hooks/useCustomers.js';
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
import { RelatedEntityType } from '../../core/domain/enums/RelatedEntityType.js';

export function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { get, remove, loading } = useCustomers();
  const toast = useToast();

  const [customer, setCustomer] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchCustomer = useCallback(async () => {
    setFetching(true);
    const result = await get({ actor: user, id });
    setFetching(false);
    if (result.isSuccess && result.value) {
      setCustomer(result.value);
    } else if (result.isFailure) {
      if (!customer) setNotFound(true);
      toast.error(errorMessage(result));
    }
  }, [user, id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    setBusy(true);
    const result = await remove({ actor: user, id });
    setBusy(false);
    setConfirmOpen(false);
    if (result.isSuccess) {
      toast.success('Client supprimé');
      navigate('/customers');
    } else {
      toast.error(errorMessage(result));
    }
  };

  if (fetching && !customer) return <Spinner className="py-20" />;

  if (notFound || !customer) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Client introuvable.</p>
        <Button variant="secondary" onClick={() => navigate('/customers')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Link
          to="/customers"
          className="inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Clients
        </Link>
      </div>

      <div className="rounded-lg bg-white p-5 ring-1 ring-slate-200 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {(customer.firstname?.[0] || '') + (customer.lastname?.[0] || '')}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {customer.firstname} {customer.lastname}
              </h1>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                <Building2 className="h-4 w-4" />
                {customer.company || '—'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
                {customer.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-slate-400" />
                    {customer.email}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {formatPhone(customer.phone)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {[customer.address, customer.city, customer.country].filter(Boolean).join(', ') || '—'}
                </span>
              </div>
              <Badge className="mt-3 bg-slate-100 text-slate-700 ring-slate-600/20">
                Client depuis le {formatDate(customer.createdAt)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/customers/${customer.id}/edit`)}
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
        <ActivityTimeline
          relatedType={RelatedEntityType.CUSTOMER}
          relatedId={customer.id}
        />
        <TaskListPanel
          title="Tâches liées"
          filters={{ relatedType: RelatedEntityType.CUSTOMER, relatedId: customer.id }}
          relatedType={RelatedEntityType.CUSTOMER}
          relatedId={customer.id}
        />
      </div>
      <NotesPanel
        relatedType={RelatedEntityType.CUSTOMER}
        relatedId={customer.id}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer le client"
        message="Cette action est irréversible. Voulez-vous vraiment supprimer ce client ?"
        confirmLabel="Supprimer"
        loading={busy || loading}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
