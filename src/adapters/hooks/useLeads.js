import { useCallback, useState } from 'react';
import {
  ListLeadsUseCase,
  GetLeadUseCase,
  CreateLeadUseCase,
  UpdateLeadUseCase,
  DeleteLeadUseCase,
  ConvertLeadToCustomerUseCase,
} from '../../application/leads/LeadUseCases.js';
import { TOKENS, useService } from '../../infrastructure/container/ServiceContainer.js';

export function useLeads() {
  const [loading, setLoading] = useState(false);

  const list = useCallback(async (params) => {
    setLoading(true);
    try {
      const useCase = new ListLeadsUseCase();
      return await useCase.execute(params || {});
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(async ({ actor, id }) => {
    setLoading(true);
    try {
      const useCase = new GetLeadUseCase();
      return await useCase.execute({ actor, id });
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async ({ actor, data }) => {
    setLoading(true);
    try {
      const useCase = new CreateLeadUseCase();
      return await useCase.execute({ actor, data });
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async ({ actor, id, data }) => {
    setLoading(true);
    try {
      const useCase = new UpdateLeadUseCase();
      return await useCase.execute({ actor, id, data });
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async ({ actor, id }) => {
    setLoading(true);
    try {
      const useCase = new DeleteLeadUseCase();
      return await useCase.execute({ actor, id });
    } finally {
      setLoading(false);
    }
  }, []);

  const convert = useCallback(async ({ actor, leadId }) => {
    setLoading(true);
    try {
      const useCase = new ConvertLeadToCustomerUseCase();
      return await useCase.execute({ actor, leadId });
    } finally {
      setLoading(false);
    }
  }, []);

  const exportCsv = useCallback(async () => {
    const repo = useService(TOKENS.LeadRepository);
    return repo.export();
  }, []);

  return { loading, list, get, create, update, remove, convert, exportCsv };
}