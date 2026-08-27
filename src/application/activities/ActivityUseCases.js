// Use cases for the activity timeline.
import { UseCase } from '../UseCase.js';
import { Result } from '../../shared/utils/result.js';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../core/domain/errors/index.js';
import { TOKENS, useService } from '../../infrastructure/container/ServiceContainer.js';
import { Role } from '../../core/domain/enums/Role.js';
import { RelatedEntityType, RELATED_ENTITY_TYPE_LABELS } from '../../core/domain/enums/RelatedEntityType.js';

// Verifies that the actor may interact with the given related entity.
export async function assertRelatedAccess(actor, relatedType, relatedId) {
  if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
  if (!relatedType || !relatedId) return Result.ok();
  const tokenByType = {
    [RelatedEntityType.CUSTOMER]: TOKENS.CustomerRepository,
    [RelatedEntityType.LEAD]: TOKENS.LeadRepository,
    [RelatedEntityType.DEAL]: TOKENS.DealRepository,
  };
  const repo = useService(tokenByType[relatedType]);
  if (!repo) return Result.fail(new ValidationError('Type d\'entité inconnu'));
  const result = await repo.findById(relatedId);
  if (result.isFailure) return result;
  const entity = result.value;
  if (!entity) return Result.fail(new NotFoundError('Entité liée introuvable'));
  if (actor.role === Role.COMMERCIAL && entity.ownerId && entity.ownerId !== actor.id) {
    return Result.fail(new UnauthorizedError('Accès refusé à cette entité'));
  }
  return Result.ok(entity);
}

// Fire-and-forget automatic activity logger used by other use cases.
// In HTTP mode, the backend handles automatic activity logging (deal create,
// stage change, lead convert). This is a no-op to avoid duplicates.
export async function logActivity({
  ownerId,
  type,
  subject,
  description = '',
  relatedType,
  relatedId,
}) {
  return Result.ok();
}

export class ListActivitiesUseCase extends UseCase {
  async execute({ actor, page, limit, search, filters } = {}) {
    const repo = useService(TOKENS.ActivityRepository);
    const effectiveFilters = { ...filters };
    if (actor && actor.role === Role.COMMERCIAL) {
      effectiveFilters.ownerId = actor.id;
    }
    return repo.findMany({ page, limit, search, filters: effectiveFilters });
  }
}

export class CreateActivityUseCase extends UseCase {
  async execute({ actor, data }) {
    const validator = useService(TOKENS.ActivityValidator);
    const repo = useService(TOKENS.ActivityRepository);

    const validation = validator.validate(data);
    if (validation.isFailure) return validation;

    const access = await assertRelatedAccess(
      actor,
      validation.value.relatedType,
      validation.value.relatedId,
    );
    if (access.isFailure) return access;

    return repo.create({ ...validation.value, ownerId: actor.id });
  }
}

export class DeleteActivityUseCase extends UseCase {
  async execute({ actor, id }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const repo = useService(TOKENS.ActivityRepository);
    const existing = await repo.findById(id);
    if (existing.isFailure) return existing;
    if (!existing.value) return Result.fail(new NotFoundError('Activité introuvable'));
    const isOwner = existing.value.ownerId === actor.id;
    if (actor.role === Role.COMMERCIAL && !isOwner) {
      return Result.fail(new UnauthorizedError('Vous ne pouvez supprimer que vos activités'));
    }
    return repo.remove(id);
  }
}

// Builds a human readable label like « Client · Acme » for UI headers.
export function relatedEntityLabel(relatedType) {
  return RELATED_ENTITY_TYPE_LABELS[relatedType] || relatedType;
}
