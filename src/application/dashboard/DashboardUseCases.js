import { UseCase } from '../UseCase.js';
import { TOKENS, useService } from '../../infrastructure/container/ServiceContainer.js';

export class GetDashboardStatsUseCase extends UseCase {
  async execute() {
    const service = useService(TOKENS.DashboardService);
    return service.getStats();
  }
}

export class GetDashboardEvolutionUseCase extends UseCase {
  async execute() {
    const service = useService(TOKENS.DashboardService);
    return service.getEvolution();
  }
}

export class GetDashboardPipelineUseCase extends UseCase {
  async execute() {
    const service = useService(TOKENS.DashboardService);
    return service.getPipeline();
  }
}