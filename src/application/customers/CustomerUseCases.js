import { UseCase } from '../UseCase.js';
import { Result } from '../../shared/utils/result.js';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../core/domain/errors/index.js';
import { TOKENS, useService } from '../../infrastructure/container/ServiceContainer.js';
import { Role } from '../../core/domain/enums/Role.js';

export class ListCustomersUseCase extends UseCase {
  async execute({ actor, page, limit, search, filters, sortBy, sortOrder, dateFrom, dateTo } = {}) {
    const repo = useService(TOKENS.CustomerRepository);
    const effectiveFilters = { ...filters };
    if (actor && actor.role === Role.COMMERCIAL) {
      effectiveFilters.ownerId = actor.id;
    }
    return repo.findMany({ page, limit, search, filters: effectiveFilters, sortBy, sortOrder, dateFrom, dateTo });
  }
}

export class GetCustomerUseCase extends UseCase {
  async execute({ actor, id }) {
    const repo = useService(TOKENS.CustomerRepository);
    const result = await repo.findById(id);
    if (result.isFailure) return result;
    if (!result.value) return Result.fail(new NotFoundError('Client introuvable'));
    if (actor && actor.role === Role.COMMERCIAL && result.value.ownerId !== actor.id) {
      return Result.fail(new UnauthorizedError('Accès refusé à ce client'));
    }
    return result;
  }
}

export class CreateCustomerUseCase extends UseCase {
  async execute({ actor, data }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const validator = useService(TOKENS.CustomerValidator);
    const repo = useService(TOKENS.CustomerRepository);
    const validation = validator.validate(data);
    if (validation.isFailure) return validation;
    // Force ownerId to current user if commercial (admin can assign).
    const ownerId = actor.role === Role.COMMERCIAL ? actor.id : data.ownerId || actor.id;
    return repo.create({ ...validation.value, ownerId });
  }
}

export class UpdateCustomerUseCase extends UseCase {
  async execute({ actor, id, data }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const validator = useService(TOKENS.CustomerValidator);
    const repo = useService(TOKENS.CustomerRepository);

    const existing = await repo.findById(id);
    if (existing.isFailure) return existing;
    if (!existing.value) return Result.fail(new NotFoundError('Client introuvable'));
    if (actor.role === Role.COMMERCIAL && existing.value.ownerId !== actor.id) {
      return Result.fail(new UnauthorizedError('Vous ne pouvez modifier que vos clients'));
    }

    const validation = validator.validate(data, { partial: true });
    if (validation.isFailure) return validation;
    // Commercial cannot reassign ownership.
    const payload = { ...validation.value };
    if (actor.role === Role.COMMERCIAL) delete payload.ownerId;
    return repo.update(id, payload);
  }
}

export class DeleteCustomerUseCase extends UseCase {
  async execute({ actor, id }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const repo = useService(TOKENS.CustomerRepository);
    const existing = await repo.findById(id);
    if (existing.isFailure) return existing;
    if (!existing.value) return Result.fail(new NotFoundError('Client introuvable'));
    if (actor.role === Role.COMMERCIAL && existing.value.ownerId !== actor.id) {
      return Result.fail(new UnauthorizedError('Vous ne pouvez supprimer que vos clients'));
    }
    return repo.remove(id);
  }
}