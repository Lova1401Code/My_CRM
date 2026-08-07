import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus, UserPlus } from 'lucide-react';
import { useCustomers } from '../../adapters/hooks/useCustomers.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Table } from '../components/ui/Table.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { SearchBar } from '../components/ui/SearchBar.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Spinner, EmptyState } from '../components/ui/Feedback.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { errorMessage } from '../../shared/utils/errors.js';
import { formatDate, formatPhone } from '../../shared/utils/formatters.js';
import { PAGINATION } from '../../core/config/constants.js';

export function CustomersListPage() {
  const { user, isAdmin } = useAuth();
  const { list, remove, loading } = useCustomers();
  const toast = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [removing, setRemoving] = useState(false);

  const fetch = useCallback(async () => {
    const result = await list({ actor: user, page, limit, search });
    if (result.isSuccess) setData(result.value);
    else toast.error(errorMessage(result));
  }, [user, page, limit, search, list, toast]);

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
    { key: 'name', header: 'Nom', render: (c) => (
      <div className="font-medium text-slate-900">{c.firstname} {c.lastname}</div>
    ) },
    { key: 'company', header: 'Société', render: (c) => c.company || '-' },
    { key: 'email', header: 'Email', render: (c) => c.email || '-' },
    { key: 'phone', header: 'Téléphone', render: (c) => formatPhone(c.phone) },
    { key: 'city', header: 'Ville', render: (c) => c.city || '-' },
    { key: 'createdAt', header: 'Créé le', render: (c) => formatDate(c.createdAt) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="mt-1 text-sm text-slate-500">{data.total} client(s) au total</p>
        </div>
        <Button onClick={() => navigate('/customers/new')}>
          <Plus className="h-4 w-4" /> Nouveau client
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={handleSearch} placeholder="Rechercher un client..." />
      </div>

      {loading && data.items.length === 0 ? (
        <Spinner className="py-20" />
      ) : data.items.length === 0 ? (
        <div className="rounded-lg bg-white p-8 ring-1 ring-slate-200">
          <EmptyState
            icon={<UserPlus className="h-10 w-10" />}
            title="Aucun client"
            description="Commencez par créer votre premier client."
            action={<Button onClick={() => navigate('/customers/new')}><Plus className="h-4 w-4" /> Nouveau client</Button>}
          />
        </div>
      ) : (
        <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
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