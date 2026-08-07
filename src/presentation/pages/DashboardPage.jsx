import { useEffect, useState } from 'react';
import { useDashboard } from '../../adapters/hooks/useDashboard.js';
import { StatCard } from '../components/ui/StatCard.jsx';
import { Spinner } from '../components/ui/Feedback.jsx';
import { errorMessage } from '../../shared/utils/errors.js';
import { useToast } from '../context/ToastContext.jsx';

export function DashboardPage() {
  const { getStats, loading } = useDashboard();
  const toast = useToast();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await getStats();
      if (!active) return;
      if (result.isSuccess) setStats(result.value);
      else toast.error(errorMessage(result));
    })();
    return () => {
      active = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && !stats) {
    return <Spinner className="py-20" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-slate-500">Vue d'ensemble de votre activité commerciale</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard type="customers" label="Clients" value={stats?.customersCount ?? 0} />
        <StatCard type="leads" label="Prospects" value={stats?.leadsCount ?? 0} />
        <StatCard type="users" label="Utilisateurs" value={stats?.usersCount ?? 0} />
        <StatCard type="converted" label="Prospects convertis" value={stats?.convertedLeadsCount ?? 0} />
      </div>
    </div>
  );
}