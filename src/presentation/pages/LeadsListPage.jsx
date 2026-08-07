import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus, UserPlus, UserCheck } from 'lucide-react';
import { useLeads } from '../../adapters/hooks/useLeads.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Table } from '../components/ui/Table.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { SearchBar } from '../components/ui/SearchBar.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Spinner, EmptyState } from '../components/ui/Feedback.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { errorMessage } from '../../shared/utils/errors.js';
import { formatDate } from '../../shared/utils/formatters.js';
import { PAGINATION } from '../../core/config/constants.js';
import { LeadStatus, LEAD_STATUS_LABELS, LEAD_STATUS_STYLES } from '../../core/domain/enums/LeadStatus.js';

export function LeadsListPage() {
  const { user } = useAuth();
  const { list, remove, convert, loading } = useLeads();
  const toast = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [convertId, setConvertId] = useState(null);
  const [busy, setBusy] = useState(false);

  const fetch = useCallback(async () => {
    const filters = statusFilter ? { status: statusFilter } : {};
    const result = await list({ actor: user, page, limit, search, filters });
    if (result.isSuccess) setData(result.value);
    else toast.error(errorMessage(result));
  }, [user, page, limit, search, statusFilter, list, toast]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleLimit = (value) => {
    setLimit(value);
    setPage(1);
  };

  const handleDelete = async () => {
    setBusy(true);
    const result = await remove({ actor: user, id: confirmId });
    setBusy(false);
    setConfirmId(null);
    if (result.isSuccess) {
      toast.success('Prospect supprimé');
      fetch();
    } else toast.error(errorMessage(result));
  };

  const handleConvert = async () => {
    setBusy(true);
    const result = await convert({ actor: user, leadId: convertId });
    setBusy(false);
    setConvertId(null);
    if (result.isSuccess) {
      toast.success('Prospect converti en client');
      fetch();
    } else toast.error(errorMessage(result));
  };

  const columns = [
    { key: 'name', header: 'Nom', render: (l) => (
      <div className="font-medium text-slate-900">{l.firstname} {l.lastname}</div>
    ) },
    { key: 'company', header: 'Société', render: (l) => l.company || '-' },
    { key: 'email', header: 'Email', render: (l) => l.email || '-' },
    { key: 'source', header: 'Source', render: (l) => l.source || '-' },
    {
      key: 'status',
      header: 'Statut',
      render: (l) => (
        <Badge className={LEAD_STATUS_STYLES[l.status]}>
          {LEAD_STATUS_LABELS[l.status]}
        </Badge>
      ),
    },
    { key: 'createdAt', header: 'Créé le', render: (l) => formatDate(l.createdAt) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Prospects</h1>
          <p className="mt-1 text-sm text-slate-500">{data.total} prospect(s) au total</p>
        </div>
        <Button onClick={() => navigate('/leads/new')}>
          <Plus className="h-4 w-4" /> Nouveau prospect
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={handleSearch} placeholder="Rechercher un prospect..." />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-md border-0 bg-white px-3 py-2 text-sm ring-1 ring-slate-300 focus:ring-2 focus:ring-indigo-600"
        >
          <option value="">Tous les statuts</option>
          {Object.values(LeadStatus).map((s) => (
            <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {loading && data.items.length === 0 ? (
        <Spinner className="py-20" />
      ) : data.items.length === 0 ? (
        <div className="rounded-lg bg-white p-8 ring-1 ring-slate-200">
          <EmptyState
            icon={<UserCheck className="h-10 w-10" />}
            title="Aucun prospect"
            description="Commencez par créer votre premier prospect."
            action={<Button onClick={() => navigate('/leads/new')}><Plus className="h-4 w-4" /> Nouveau prospect</Button>}
          />
        </div>
      ) : (
        <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
          <Table
            columns={columns}
            data={data.items}
            renderActions={(l) => (
              <div className="flex justify-end gap-1">
                {l.status !== LeadStatus.CONVERTED && (
                  <button
                    type="button"
                    onClick={() => setConvertId(l.id)}
                    className="rounded p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                    aria-label="Convertir en client"
                    title="Convertir en client"
                  >
                    <UserPlus className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate(`/leads/${l.id}/edit`)}
                  className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                  aria-label="Modifier"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmId(l.id)}
                  className="rounded p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          />
          <Pagination
            page={page}
            limit={limit}
            total={data.total}
            onPageChange={setPage}
            onLimitChange={handleLimit}
          />
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        title="Supprimer le prospect"
        message="Cette action est irréversible. Voulez-vous vraiment supprimer ce prospect ?"
        confirmLabel="Supprimer"
        loading={busy}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />

      <ConfirmDialog
        open={!!convertId}
        title="Convertir en client"
        message="Ce prospect sera transformé en client. Son statut passera à « Converti »."
        confirmLabel="Convertir"
        variant="primary"
        loading={busy}
        onConfirm={handleConvert}
        onCancel={() => setConvertId(null)}
      />
    </div>
  );
}