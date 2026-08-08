import { useEffect, useState } from 'react';
import { useDashboard } from '../../adapters/hooks/useDashboard.js';
import { StatCard } from '../components/ui/StatCard.jsx';
import { Spinner } from '../components/ui/Feedback.jsx';
import { ChartCard } from '../components/charts/ChartCard.jsx';
import { EvolutionChart } from '../components/charts/EvolutionChart.jsx';
import { LeadsStatusChart } from '../components/charts/LeadsStatusChart.jsx';
import { LeadsSourceChart } from '../components/charts/LeadsSourceChart.jsx';
import { errorMessage } from '../../shared/utils/errors.js';
import { useToast } from '../context/ToastContext.jsx';

export function DashboardPage() {
  const { getStats, getEvolution, loading } = useDashboard();
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [evolution, setEvolution] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [statsResult, evolutionResult] = await Promise.all([getStats(), getEvolution()]);
      if (!active) return;
      if (statsResult.isSuccess) setStats(statsResult.value);
      else toast.error(errorMessage(statsResult));
      if (evolutionResult.isSuccess) setEvolution(evolutionResult.value);
      else toast.error(errorMessage(evolutionResult));
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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard
            title="Évolution mensuelle"
            subtitle="Prospects et clients créés par mois (12 derniers mois)"
          >
            <EvolutionChart data={evolution?.evolution ?? []} />
          </ChartCard>
        </div>
        <ChartCard title="Prospects par statut" subtitle="Répartition de votre pipeline">
          <LeadsStatusChart data={evolution?.leadsByStatus ?? []} />
        </ChartCard>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Prospects par source" subtitle="D'où viennent vos prospects">
          <LeadsSourceChart data={evolution?.leadsBySource ?? []} />
        </ChartCard>
      </div>
    </div>
  );
}
