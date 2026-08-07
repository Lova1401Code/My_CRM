import { useCallback, useState } from 'react';
import {
  ListUsersUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '../../application/users/UserUseCases.js';

export function useUsers() {
  const [loading, setLoading] = useState(false);

  const list = useCallback(async (params) => {
    setLoading(true);
    try {
      const useCase = new ListUsersUseCase();
      return await useCase.execute(params || {});
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async ({ actor, data }) => {
    setLoading(true);
    try {
      const useCase = new CreateUserUseCase();
      return await useCase.execute({ actor, data });
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async ({ actor, id, data }) => {
    setLoading(true);
    try {
      const useCase = new UpdateUserUseCase();
      return await useCase.execute({ actor, id, data });
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async ({ actor, id }) => {
    setLoading(true);
    try {
      const useCase = new DeleteUserUseCase();
      return await useCase.execute({ actor, id });
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, list, create, update, remove };
}