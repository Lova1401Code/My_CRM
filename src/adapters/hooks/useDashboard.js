import { useCallback, useState } from 'react';
import { GetDashboardStatsUseCase } from '../../application/dashboard/DashboardUseCases.js';

export function useDashboard() {
  const [loading, setLoading] = useState(false);

  const getStats = useCallback(async () => {
    setLoading(true);
    try {
      const useCase = new GetDashboardStatsUseCase();
      return await useCase.execute();
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, getStats };
}