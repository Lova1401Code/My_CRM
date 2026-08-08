import { useCallback, useState } from 'react';
import {
  GetDashboardStatsUseCase,
  GetDashboardEvolutionUseCase,
} from '../../application/dashboard/DashboardUseCases.js';

export function useDashboard() {
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (useCase) => {
    setLoading(true);
    try {
      return await useCase.execute();
    } finally {
      setLoading(false);
    }
  }, []);

  const getStats = useCallback(() => run(new GetDashboardStatsUseCase()), [run]);
  const getEvolution = useCallback(
    () => run(new GetDashboardEvolutionUseCase()),
    [run],
  );

  return { loading, getStats, getEvolution };
}