import { httpClient } from '../httpClient.js';
import { Result } from '../../../shared/utils/result.js';

export class HttpDashboardService {
  async getStats() {
    const result = await httpClient.get('/dashboard/stats');
    return result.map((data) => ({
      customersCount: data.customersCount,
      leadsCount: data.leadsCount,
      usersCount: data.usersCount,
      convertedLeadsCount: data.convertedLeadsCount,
    }));
  }

  async getEvolution() {
    const result = await httpClient.get('/dashboard/evolution');
    return result.map((data) => ({
      evolution: data.evolution || [],
      leadsByStatus: data.leadsByStatus || [],
      leadsBySource: data.leadsBySource || [],
    }));
  }

  async getPipeline() {
    const result = await httpClient.get('/dashboard/pipeline');
    return result.map((data) => ({
      wonRevenue: data.wonRevenue,
      forecast: data.forecast,
      openDeals: data.openDeals,
      dealsByStage: data.dealsByStage || [],
    }));
  }
}