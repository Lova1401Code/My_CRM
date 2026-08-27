import { useCallback, useState } from 'react';
import {
  ListTasksUseCase,
  GetTaskUseCase,
  CreateTaskUseCase,
  UpdateTaskUseCase,
  ToggleTaskCompleteUseCase,
  DeleteTaskUseCase,
} from '../../application/tasks/TaskUseCases.js';

export function useTasks() {
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (useCase, params) => {
    setLoading(true);
    try {
      return await useCase.execute(params || {});
    } finally {
      setLoading(false);
    }
  }, []);

  const list = useCallback((params) => run(new ListTasksUseCase(), params), [run]);
  const get = useCallback((params) => run(new GetTaskUseCase(), params), [run]);
  const create = useCallback((params) => run(new CreateTaskUseCase(), params), [run]);
  const update = useCallback((params) => run(new UpdateTaskUseCase(), params), [run]);
  const toggleComplete = useCallback(
    (params) => run(new ToggleTaskCompleteUseCase(), params),
    [run],
  );
  const remove = useCallback((params) => run(new DeleteTaskUseCase(), params), [run]);

  return { loading, list, get, create, update, toggleComplete, remove };
}
