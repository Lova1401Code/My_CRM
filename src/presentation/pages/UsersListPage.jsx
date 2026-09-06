import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus, Users as UsersIcon, Ban, CheckCircle2 } from 'lucide-react';
import { useUsers } from '../../adapters/hooks/useUsers.js';
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
import { Role, ROLE_LABELS } from '../../core/domain/enums/Role.js';
import { UserStatus, USER_STATUS_LABELS, USER_STATUS_STYLES } from '../../core/domain/enums/UserStatus.js';

export function UsersListPage() {
  const { user } = useAuth();
  const { list, remove, update, loading } = useUsers();
  const toast = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [busy, setBusy] = useState(false);

  const fetch = useCallback(async () => {
    const result = await list({ page, limit, search });
    if (result.isSuccess) setData(result.value);
    else toast.error(errorMessage(result));
  }, [page, limit, search, list, toast]);

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
      toast.success('Utilisateur supprimé');
      fetch();
    } else toast.error(errorMessage(result));
  };

  const toggleStatus = async (u) => {
    const next = u.status === UserStatus.ACTIVE ? UserStatus.DISABLED : UserStatus.ACTIVE;
    const result = await update({ actor: user, id: u.id, data: { status: next } });
    if (result.isSuccess) {
      toast.success(next === UserStatus.ACTIVE ? 'Utilisateur activé' : 'Utilisateur désactivé');
      fetch();
    } else toast.error(errorMessage(result));
  };

  const columns = [
    { key: 'name', header: 'Nom', render: (u) => (
      <div className="font-medium text-slate-900">{u.firstname} {u.lastname}</div>
    ) },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Téléphone' },
    { key: 'role', header: 'Rôle', render: (u) => (
      <Badge className={u.role === Role.ADMIN ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20' : 'bg-slate-100 text-slate-700 ring-slate-600/20'}>
        {ROLE_LABELS[u.role]}
      </Badge>
    ) },
    { key: 'status', header: 'Statut', render: (u) => (
      <Badge className={USER_STATUS_STYLES[u.status]}>{USER_STATUS_LABELS[u.status]}</Badge>
    ) },
    { key: 'createdAt', header: 'Créé le', render: (u) => formatDate(u.createdAt) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Utilisateurs</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{data.total} utilisateur(s) au total</p>
        </div>
        <Button onClick={() => navigate('/users/new')}>
          <Plus className="h-4 w-4" /> Nouvel utilisateur
        </Button>
      </div>

      <SearchBar value={search} onChange={handleSearch} placeholder="Rechercher un utilisateur..." />

      {loading && data.items.length === 0 ? (
        <Spinner className="py-20" />
      ) : data.items.length === 0 ? (
        <div className="rounded-lg bg-white p-8 ring-1 ring-slate-200">
          <EmptyState
            icon={<UsersIcon className="h-10 w-10" />}
            title="Aucun utilisateur"
            description="Ajoutez votre premier utilisateur."
            action={<Button onClick={() => navigate('/users/new')}><Plus className="h-4 w-4" /> Nouvel utilisateur</Button>}
          />
        </div>
      ) : (
        <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
          <Table
            columns={columns}
            data={data.items}
            renderActions={(u) => (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  onClick={() => toggleStatus(u)}
                  className={`rounded p-1.5 hover:bg-slate-100 ${u.status === UserStatus.ACTIVE ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                  title={u.status === UserStatus.ACTIVE ? 'Désactiver' : 'Activer'}
                  aria-label="Changer le statut"
                  disabled={u.id === user.id}
                >
                  {u.status === UserStatus.ACTIVE ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/users/${u.id}/edit`)}
                  className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                  aria-label="Modifier"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                {u.id !== user.id && (
                  <button
                    type="button"
                    onClick={() => setConfirmId(u.id)}
                    className="rounded p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
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
        title="Supprimer l'utilisateur"
        message="Cette action est irréversible. Voulez-vous vraiment supprimer cet utilisateur ?"
        confirmLabel="Supprimer"
        loading={busy}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}