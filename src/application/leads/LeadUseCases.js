import { UseCase } from '../UseCase.js';
import { Result } from '../../shared/utils/result.js';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../core/domain/errors/index.js';
import { TOKENS, useService } from '../../infrastructure/container/ServiceContainer.js';
import { Role } from '../../core/domain/enums/Role.js';
import { LeadStatus } from '../../core/domain/enums/LeadStatus.js';

export class ListLeadsUseCase extends UseCase {
  async execute({ actor, page, limit, search, filters } = {}) {
    const repo = useService(TOKENS.LeadRepository);
    const effectiveFilters = { ...filters };
    if (actor && actor.role === Role.COMMERCIAL) {
      effectiveFilters.ownerId = actor.id;
    }
    return repo.findMany({ page, limit, search, filters: effectiveFilters });
  }
}

export class GetLeadUseCase extends UseCase {
  async execute({ actor, id }) {
    const repo = useService(TOKENS.LeadRepository);
    const result = await repo.findById(id);
    if (result.isFailure) return result;
    if (!result.value) return Result.fail(new NotFoundError('Prospect introuvable'));
    if (actor && actor.role === Role.COMMERCIAL && result.value.ownerId !== actor.id) {
      return Result.fail(new UnauthorizedError('Accès refusé à ce prospect'));
    }
    return result;
  }
}

export class CreateLeadUseCase extends UseCase {
  async execute({ actor, data }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const validator = useService(TOKENS.LeadValidator);
    const repo = useService(TOKENS.LeadRepository);
    const validation = validator.validate(data);
    if (validation.isFailure) return validation;
    const ownerId = actor.role === Role.COMMERCIAL ? actor.id : data.ownerId || actor.id;
    return repo.create({ ...validation.value, ownerId });
  }
}

export class UpdateLeadUseCase extends UseCase {
  async execute({ actor, id, data }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const validator = useService(TOKENS.LeadValidator);
    const repo = useService(TOKENS.LeadRepository);

    const existing = await repo.findById(id);
    if (existing.isFailure) return existing;
    if (!existing.value) return Result.fail(new NotFoundError('Prospect introuvable'));
    if (actor.role === Role.COMMERCIAL && existing.value.ownerId !== actor.id) {
      return Result.fail(new UnauthorizedError('Accès refusé à ce prospect'));
    }

    const validation = validator.validate(data, { partial: true });
    if (validation.isFailure) return validation;
    const payload = { ...validation.value };
    if (actor.role === Role.COMMERCIAL) delete payload.ownerId;
    return repo.update(id, payload);
  }
}

export class DeleteLeadUseCase extends UseCase {
  async execute({ actor, id }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const repo = useService(TOKENS.LeadRepository);
    const existing = await repo.findById(id);
    if (existing.isFailure) return existing;
    if (!existing.value) return Result.fail(new NotFoundError('Prospect introuvable'));
    if (actor.role === Role.COMMERCIAL && existing.value.ownerId !== actor.id) {
      return Result.fail(new UnauthorizedError('Accès refusé à ce prospect'));
    }
    return repo.remove(id);
  }
}

// Convert a lead to a customer (business rule).
export class ConvertLeadToCustomerUseCase extends UseCase {
  async execute({ actor, leadId }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const leadRepo = useService(TOKENS.LeadRepository);
    const customerRepo = useService(TOKENS.CustomerRepository);

    const leadResult = await leadRepo.findById(leadId);
    if (leadResult.isFailure) return leadResult;
    const lead = leadResult.value;
    if (!lead) return Result.fail(new NotFoundError('Prospect introuvable'));
    if (actor.role === Role.COMMERCIAL && lead.ownerId !== actor.id) {
      return Result.fail(new UnauthorizedError('Accès refusé à ce prospect'));
    }
    if (lead.status === LeadStatus.CONVERTED) {
      return Result.fail(new ValidationError('Ce prospect est déjà converti'));
    }

    // Create customer from lead.
    const customerResult = await customerRepo.create({
      firstname: lead.firstname,
      lastname: lead.lastname,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      address: '',
      city: '',
      country: '',
      ownerId: lead.ownerId,
    });
    if (customerResult.isFailure) return customerResult;

    // Mark lead as converted.
    await leadRepo.update(leadId, { status: LeadStatus.CONVERTED });

    return Result.ok({ customer: customerResult.value });
  }
}