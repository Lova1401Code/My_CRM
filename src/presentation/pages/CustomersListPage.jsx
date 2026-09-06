import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus, UserPlus, Download, ArrowUpDown } from 'lucide-react';
import { useCustomers } from '../../adapters/hooks/useCustomers.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Table } from '../components/ui/Table.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { SearchBar } from '../components/ui/SearchBar.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Spinner, EmptyState } from '../components/ui/Feedback.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { TagBadge } from '../components/ui/TagInput.jsx';
import { downloadCsv } from '../../shared/utils/csv.js';
import { errorMessage } from '../../shared/utils/errors.js';
import { formatDate, formatPhone } from '../../shared/utils/formatters.js';
import { PAGINATION } from '../../core/config/constants.js';

export function CustomersListPage() {
  const { user, isAdmin } = useAuth();
  const { list, remove, exportCsv, loading } = useCustomers();
  const toast = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [confirmId, setConfirmId] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetch = useCallback(async () => {
    const filters = tagFilter ? { tag: tagFilter } : {};
    const result = await list({ actor: user, page, limit, search, filters, sortBy, sortOrder });
    if (result.isSuccess) setData(result.value);
    else toast.error(errorMessage(result));
  }, [user, page, limit, search, tagFilter, sortBy, sortOrder, list, toast]);

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

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const csv = await exportCsv();
      downloadCsv(csv, `clients-${Date.now()}.csv`);
      toast.success('Export CSV téléchargé');
    } catch {
      toast.error('Erreur lors de l\'export');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    setRemoving(true);
    const result = await remove({ actor: user, id: confirmId });
    setRemoving(false);
    setConfirmId(null);
    if (result.isSuccess) {
      toast.success('Client supprimé');
      fetch();
    } else {
      toast.error(errorMessage(result));
    }
  };

  const columns = [
    { key: 'name', header: (
      <button type="button" onClick={() => handleSort('lastname')} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200">
        Nom <ArrowUpDown className="h-3 w-3" />
      </button>
    ), render: (c) => (
      <button
        type="button"
        onClick={() => navigate(`/customers/${c.id}`)}
        className="text-left font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
      >
        {c.firstname} {c.lastname}
      </button>
    ) },
    { key: 'company', header: 'Société', render: (c) => c.company || '-' },
    { key: 'email', header: 'Email', render: (c) => c.email || '-' },
    { key: 'phone', header: 'Téléphone', render: (c) => formatPhone(c.phone) },
    { key: 'city', header: 'Ville', render: (c) => c.city || '-' },
    { key: 'tags', header: 'Tags', render: (c) => (
      <div className="flex flex-wrap gap-1">
        {(c.tags || []).map((t) => <TagBadge key={t} tag={t} />)}
      </div>
    ) },
    { key: 'createdAt', header: (
      <button type="button" onClick={() => handleSort('createdAt')} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200">
        Créé le <ArrowUpDown className="h-3 w-3" />
      </button>
    ), render: (c) => formatDate(c.createdAt) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Clients</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{data.total} client(s) au total</p>
        </div>
        <Button onClick={() => navigate('/customers/new')}>
          <Plus className="h-4 w-4" /> Nouveau client
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={search} onChange={handleSearch} placeholder="Rechercher un client..." />
          <input
            type="text"
            value={tagFilter}
            onChange={(e) => { setTagFilter(e.target.value); setPage(1); }}
            placeholder="Filtrer par tag..."
            className="rounded-md border-0 bg-white px-3 py-2 text-sm ring-1 ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-600"
          />
        </div>
        <Button variant="secondary" onClick={handleExport} loading={exporting}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {loading && data.items.length === 0 ? (
        <Spinner className="py-20" />
      ) : data.items.length === 0 ? (
        <div className="rounded-lg bg-white p-8 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          <EmptyState
            icon={<UserPlus className="h-10 w-10" />}
            title="Aucun client"
            description="Commencez par créer votre premier client."
            action={<Button onClick={() => navigate('/customers/new')}><Plus className="h-4 w-4" /> Nouveau client</Button>}
          />
        </div>
      ) : (
        <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          <Table
            columns={columns}
            data={data.items}
            renderActions={(c) => (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  onClick={() => navigate(`/customers/${c.id}/edit`)}
                  className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                  aria-label="Modifier"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmId(c.id)}
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
        title="Supprimer le client"
        message="Cette action est irréversible. Voulez-vous vraiment supprimer ce client ?"
        confirmLabel="Supprimer"
        loading={removing}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}