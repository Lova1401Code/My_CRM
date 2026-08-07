import { useCallback, useState } from 'react';
import {
  ListCustomersUseCase,
  CreateCustomerUseCase,
  UpdateCustomerUseCase,
  DeleteCustomerUseCase,
} from '../../application/customers/CustomerUseCases.js';
import { GetCustomerUseCase } from '../../application/customers/CustomerUseCases.js';

export function useCustomers() {
  const [loading, setLoading] = useState(false);

  const list = useCallback(async (params) => {
    setLoading(true);
    try {
      const useCase = new ListCustomersUseCase();
      return await useCase.execute(params || {});
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(async ({ actor, id }) => {
    setLoading(true);
    try {
      const useCase = new GetCustomerUseCase();
      return await useCase.execute({ actor, id });
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async ({ actor, data }) => {
    setLoading(true);
    try {
      const useCase = new CreateCustomerUseCase();
      return await useCase.execute({ actor, data });
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async ({ actor, id, data }) => {
    setLoading(true);
    try {
      const useCase = new UpdateCustomerUseCase();
      return await useCase.execute({ actor, id, data });
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async ({ actor, id }) => {
    setLoading(true);
    try {
      const useCase = new DeleteCustomerUseCase();
      return await useCase.execute({ actor, id });
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, list, get, create, update, remove };
}