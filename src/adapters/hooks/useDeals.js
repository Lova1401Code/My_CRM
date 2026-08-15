import { useCallback, useState } from 'react';
import {
  ListDealsUseCase,
  GetDealUseCase,
  CreateDealUseCase,
  UpdateDealUseCase,
  DeleteDealUseCase,
} from '../../application/deals/DealUseCases.js';

export function useDeals() {
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (useCase, params) => {
    setLoading(true);
    try {
      return await useCase.execute(params || {});
    } finally {
      setLoading(false);
    }
  }, []);

  const list = useCallback((params) => run(new ListDealsUseCase(), params), [run]);
  const get = useCallback((params) => run(new GetDealUseCase(), params), [run]);
  const create = useCallback((params) => run(new CreateDealUseCase(), params), [run]);
  const update = useCallback((params) => run(new UpdateDealUseCase(), params), [run]);
  const remove = useCallback((params) => run(new DeleteDealUseCase(), params), [run]);

  return { loading, list, get, create, update, remove };
}
