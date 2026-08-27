import { useCallback, useState } from 'react';
import {
  ListActivitiesUseCase,
  CreateActivityUseCase,
  DeleteActivityUseCase,
} from '../../application/activities/ActivityUseCases.js';

export function useActivities() {
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (useCase, params) => {
    setLoading(true);
    try {
      return await useCase.execute(params || {});
    } finally {
      setLoading(false);
    }
  }, []);

  const list = useCallback((params) => run(new ListActivitiesUseCase(), params), [run]);
  const create = useCallback((params) => run(new CreateActivityUseCase(), params), [run]);
  const remove = useCallback((params) => run(new DeleteActivityUseCase(), params), [run]);

  return { loading, list, create, remove };
}
