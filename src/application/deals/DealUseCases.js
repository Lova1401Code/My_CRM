import { UseCase } from '../UseCase.js';
import { Result } from '../../shared/utils/result.js';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../core/domain/errors/index.js';
import { TOKENS, useService } from '../../infrastructure/container/ServiceContainer.js';
import { Role } from '../../core/domain/enums/Role.js';

async function assertCustomerAccess(actor, customerId) {
  const customerRepo = useService(TOKENS.CustomerRepository);
  const customerResult = await customerRepo.findById(customerId);
  if (customerResult.isFailure) return customerResult;
  const customer = customerResult.value;
  if (!customer) return Result.fail(new ValidationError('Client introuvable'));
  if (actor.role === Role.COMMERCIAL && customer.ownerId !== actor.id) {
    return Result.fail(new UnauthorizedError('Ce client ne vous appartient pas'));
  }
  return Result.ok();
}

export class ListDealsUseCase extends UseCase {
  async execute({ actor, page, limit, search, filters } = {}) {
    const repo = useService(TOKENS.DealRepository);
    const effectiveFilters = { ...filters };
    if (actor && actor.role === Role.COMMERCIAL) {
      effectiveFilters.ownerId = actor.id;
    }
    return repo.findMany({ page, limit, search, filters: effectiveFilters });
  }
}

export class GetDealUseCase extends UseCase {
  async execute({ actor, id }) {
    const repo = useService(TOKENS.DealRepository);
    const result = await repo.findById(id);
    if (result.isFailure) return result;
    if (!result.value) return Result.fail(new NotFoundError('Affaire introuvable'));
    if (actor && actor.role === Role.COMMERCIAL && result.value.ownerId !== actor.id) {
      return Result.fail(new UnauthorizedError('Accès refusé à cette affaire'));
    }
    return result;
  }
}

export class CreateDealUseCase extends UseCase {
  async execute({ actor, data }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const validator = useService(TOKENS.DealValidator);
    const repo = useService(TOKENS.DealRepository);

    const validation = validator.validate(data);
    if (validation.isFailure) return validation;

    const access = await assertCustomerAccess(actor, validation.value.customerId);
    if (access.isFailure) return access;

    const ownerId = actor.role === Role.COMMERCIAL ? actor.id : data.ownerId || actor.id;
    return repo.create({ ...validation.value, ownerId });
  }
}

export class UpdateDealUseCase extends UseCase {
  async execute({ actor, id, data }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const validator = useService(TOKENS.DealValidator);
    const repo = useService(TOKENS.DealRepository);

    const existing = await repo.findById(id);
    if (existing.isFailure) return existing;
    if (!existing.value) return Result.fail(new NotFoundError('Affaire introuvable'));
    if (actor.role === Role.COMMERCIAL && existing.value.ownerId !== actor.id) {
      return Result.fail(new UnauthorizedError('Accès refusé à cette affaire'));
    }

    const validation = validator.validate(data, { partial: true });
    if (validation.isFailure) return validation;

    if (validation.value.customerId) {
      const access = await assertCustomerAccess(actor, validation.value.customerId);
      if (access.isFailure) return access;
    }

    const payload = { ...validation.value };
    if (actor.role === Role.COMMERCIAL) delete payload.ownerId;
    return repo.update(id, payload);
  }
}

export class DeleteDealUseCase extends UseCase {
  async execute({ actor, id }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const repo = useService(TOKENS.DealRepository);
    const existing = await repo.findById(id);
    if (existing.isFailure) return existing;
    if (!existing.value) return Result.fail(new NotFoundError('Affaire introuvable'));
    if (actor.role === Role.COMMERCIAL && existing.value.ownerId !== actor.id) {
      return Result.fail(new UnauthorizedError('Accès refusé à cette affaire'));
    }
    return repo.remove(id);
  }
}
