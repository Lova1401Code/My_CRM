import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus, Handshake, LayoutGrid, List } from 'lucide-react';
import { useDeals } from '../../adapters/hooks/useDeals.js';
import { useCustomers } from '../../adapters/hooks/useCustomers.js';
import { useUsers } from '../../adapters/hooks/useUsers.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Table } from '../components/ui/Table.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { SearchBar } from '../components/ui/SearchBar.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { StatCard } from '../components/ui/StatCard.jsx';
import { Spinner, EmptyState } from '../components/ui/Feedback.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { DealBoard } from '../components/entities/DealBoard.jsx';
import { errorMessage } from '../../shared/utils/errors.js';
import { formatDate, formatCurrency } from '../../shared/utils/formatters.js';
import { PAGINATION } from '../../core/config/constants.js';
import {
  DealStage,
  DEAL_STAGE_LABELS,
  DEAL_STAGE_STYLES,
  DEAL_STAGE_PROBABILITY,
} from '../../core/domain/enums/DealStage.js';

export function DealsListPage() {
  const { user, isAdmin } = useAuth();
  const { list, remove, update, loading } = useDeals();
  const { list: listCustomers } = useCustomers();
  const { list: listUsers } = useUsers();
  const toast = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState({ items: [], total: 0 });
  const [all, setAll] = useState([]);
  const [view, setView] = useState('list');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [busy, setBusy] = useState(false);

  const [customerMap, setCustomerMap] = useState({});
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    let active = true;
    (async () => {
      const customersRes = await listCustomers({ actor: user, page: 1, limit: 1000 });
      if (!active) return;
      if (customersRes.isSuccess) {
        const map = {};
        customersRes.value.items.forEach((c) => {
          map[c.id] = c;
        });
        setCustomerMap(map);
      }
      if (isAdmin) {
        const usersRes = await listUsers({ page: 1, limit: 100 });
        if (usersRes.isSuccess) {
          const map = {};
          usersRes.value.items.forEach((u) => {
            map[u.id] = u;
          });
          setUserMap(map);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filters = useMemo(() => (stageFilter ? { stage: stageFilter } : {}), [stageFilter]);
  const boardMode = view === 'board';

  const fetch = useCallback(async () => {
    const [result, allResult] = await Promise.all([
      list({
        actor: user,
        page,
        limit,
        search: boardMode ? '' : search,
        filters: boardMode ? {} : filters,
      }),
      list({
        actor: user,
        page: 1,
        limit: 10000,
        search: boardMode ? '' : search,
        filters: boardMode ? {} : filters,
      }),
    ]);
    if (result.isSuccess) setData(result.value);
    else toast.error(errorMessage(result));
    if (allResult.isSuccess) setAll(allResult.value.items);
    else toast.error(errorMessage(allResult));
  }, [user, page, limit, search, filters, boardMode, list, toast]);

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
      toast.success('Affaire supprimée');
      fetch();
    } else toast.error(errorMessage(result));
  };

  const handleStageChange = async (dealId, stage) => {
    const result = await update({ actor: user, id: dealId, data: { stage } });
    if (result.isSuccess) {
      fetch();
    } else {
      toast.error(errorMessage(result));
    }
  };

  const kpis = useMemo(() => {
    let wonRevenue = 0;
    let forecast = 0;
    for (const deal of all) {
      if (deal.stage === DealStage.WON) wonRevenue += deal.amount;
      else if (deal.stage !== DealStage.LOST) {
        forecast += (deal.amount * (DEAL_STAGE_PROBABILITY[deal.stage] || 0)) / 100;
      }
    }
    const openDeals = all.filter(
      (d) => d.stage !== DealStage.WON && d.stage !== DealStage.LOST,
    ).length;
    return { wonRevenue, forecast, openDeals };
  }, [all]);

  const columns = [
    {
      key: 'title',
      header: 'Affaire',
      render: (d) => <div className="font-medium text-slate-900">{d.title}</div>,
    },
    {
      key: 'customer',
      header: 'Client',
      render: (d) => customerMap[d.customerId]?.company || '-',
    },
    {
      key: 'amount',
      header: 'Montant',
      render: (d) => <span className="font-semibold text-slate-900">{formatCurrency(d.amount)}</span>,
    },
    {
      key: 'stage',
      header: 'Étape',
      render: (d) => (
        <Badge className={DEAL_STAGE_STYLES[d.stage]}>{DEAL_STAGE_LABELS[d.stage]}</Badge>
      ),
    },
    {
      key: 'expectedCloseDate',
      header: 'Échéance',
      render: (d) => (d.expectedCloseDate ? formatDate(d.expectedCloseDate) : '-'),
    },
    { key: 'createdAt', header: 'Créé le', render: (d) => formatDate(d.createdAt) },
    ...(isAdmin
      ? [
          {
            key: 'owner',
            header: 'Commercial',
            render: (d) => {
              const u = userMap[d.ownerId];
              return u ? `${u.firstname} ${u.lastname}` : '-';
            },
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pipeline de ventes</h1>
          <p className="mt-1 text-sm text-slate-500">{data.total} affaire(s) au total</p>
        </div>
        <Button onClick={() => navigate('/deals/new')}>
          <Plus className="h-4 w-4" /> Nouvelle affaire
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard type="revenue" label="CA gagné" value={formatCurrency(kpis.wonRevenue)} />
        <StatCard type="forecast" label="Prévision pondérée" value={formatCurrency(kpis.forecast)} />
        <StatCard type="deals" label="Deals ouverts" value={kpis.openDeals} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {boardMode ? (
          <p className="text-sm text-slate-500">
            Glissez-déposez une carte pour changer l'étape d'une affaire.
          </p>
        ) : (
          <>
            <SearchBar value={search} onChange={handleSearch} placeholder="Rechercher une affaire..." />
            <select
              value={stageFilter}
              onChange={(e) => {
                setStageFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-md border-0 bg-white px-3 py-2 text-sm ring-1 ring-slate-300 focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">Toutes les étapes</option>
              {Object.values(DealStage).map((s) => (
                <option key={s} value={s}>{DEAL_STAGE_LABELS[s]}</option>
              ))}
            </select>
          </>
        )}
        <div className="flex shrink-0 rounded-md bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setView('list')}
            className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition ${
              view === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <List className="h-4 w-4" />
            Liste
          </button>
          <button
            type="button"
            onClick={() => setView('board')}
            className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition ${
              view === 'board' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Kanban
          </button>
        </div>
      </div>

      {loading && data.items.length === 0 ? (
        <Spinner className="py-20" />
      ) : all.length === 0 ? (
        <div className="rounded-lg bg-white p-8 ring-1 ring-slate-200">
          <EmptyState
            icon={<Handshake className="h-10 w-10" />}
            title="Aucune affaire"
            description="Créez votre première opportunité commerciale."
            action={<Button onClick={() => navigate('/deals/new')}><Plus className="h-4 w-4" /> Nouvelle affaire</Button>}
          />
        </div>
      ) : boardMode ? (
        <DealBoard deals={all} customerMap={customerMap} onStageChange={handleStageChange} />
      ) : (
        <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
          <Table
            columns={columns}
            data={data.items}
            renderActions={(d) => (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  onClick={() => navigate(`/deals/${d.id}/edit`)}
                  className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                  aria-label="Modifier"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmId(d.id)}
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
        title="Supprimer l'affaire"
        message="Cette action est irréversible. Voulez-vous vraiment supprimer cette affaire ?"
        confirmLabel="Supprimer"
        loading={busy}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
