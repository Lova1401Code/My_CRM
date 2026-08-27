// Use cases for tasks and reminders.
import { UseCase } from '../UseCase.js';
import { Result } from '../../shared/utils/result.js';
import {
  NotFoundError,
  UnauthorizedError,
} from '../../core/domain/errors/index.js';
import { TOKENS, useService } from '../../infrastructure/container/ServiceContainer.js';
import { Role } from '../../core/domain/enums/Role.js';
import { TaskStatus } from '../../core/domain/enums/TaskStatus.js';
import { assertRelatedAccess } from '../activities/ActivityUseCases.js';

export class ListTasksUseCase extends UseCase {
  async execute({ actor, page, limit, search, filters } = {}) {
    const repo = useService(TOKENS.TaskRepository);
    const effectiveFilters = { ...filters };
    if (actor && actor.role === Role.COMMERCIAL) {
      effectiveFilters.ownerId = actor.id;
    }
    return repo.findMany({ page, limit, search, filters: effectiveFilters });
  }
}

export class GetTaskUseCase extends UseCase {
  async execute({ actor, id }) {
    const repo = useService(TOKENS.TaskRepository);
    const result = await repo.findById(id);
    if (result.isFailure) return result;
    if (!result.value) return Result.fail(new NotFoundError('Tâche introuvable'));
    if (actor && actor.role === Role.COMMERCIAL && result.value.ownerId !== actor.id) {
      return Result.fail(new UnauthorizedError('Accès refusé à cette tâche'));
    }
    return result;
  }
}

export class CreateTaskUseCase extends UseCase {
  async execute({ actor, data }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const validator = useService(TOKENS.TaskValidator);
    const repo = useService(TOKENS.TaskRepository);

    const validation = validator.validate(data);
    if (validation.isFailure) return validation;

    const access = await assertRelatedAccess(
      actor,
      validation.value.relatedType,
      validation.value.relatedId,
    );
    if (access.isFailure) return access;

    const ownerId = actor.role === Role.COMMERCIAL ? actor.id : data.ownerId || actor.id;
    return repo.create({ ...validation.value, ownerId });
  }
}

export class UpdateTaskUseCase extends UseCase {
  async execute({ actor, id, data }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const validator = useService(TOKENS.TaskValidator);
    const repo = useService(TOKENS.TaskRepository);

    const existing = await repo.findById(id);
    if (existing.isFailure) return existing;
    if (!existing.value) return Result.fail(new NotFoundError('Tâche introuvable'));
    if (actor.role === Role.COMMERCIAL && existing.value.ownerId !== actor.id) {
      return Result.fail(new UnauthorizedError('Accès refusé à cette tâche'));
    }

    const validation = validator.validate(data, { partial: true });
    if (validation.isFailure) return validation;

    if (validation.value.relatedType || validation.value.relatedId) {
      const access = await assertRelatedAccess(
        actor,
        validation.value.relatedType || existing.value.relatedType,
        validation.value.relatedId || existing.value.relatedId,
      );
      if (access.isFailure) return access;
    }

    return repo.update(id, validation.value);
  }
}

// Marks a task done / reopens it.
export class ToggleTaskCompleteUseCase extends UseCase {
  async execute({ actor, id }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const repo = useService(TOKENS.TaskRepository);

    const existing = await repo.findById(id);
    if (existing.isFailure) return existing;
    if (!existing.value) return Result.fail(new NotFoundError('Tâche introuvable'));
    if (actor.role === Role.COMMERCIAL && existing.value.ownerId !== actor.id) {
      return Result.fail(new UnauthorizedError('Accès refusé à cette tâche'));
    }

    // Use backend toggle endpoint if available (single HTTP call).
    if (typeof repo.toggle === 'function') {
      return repo.toggle(id);
    }

    // Fallback: manual toggle (mock mode).
    const isDone = existing.value.status === TaskStatus.DONE;
    return repo.update(id, {
      status: isDone ? TaskStatus.OPEN : TaskStatus.DONE,
      completedAt: isDone ? null : new Date().toISOString(),
    });
  }
}

export class DeleteTaskUseCase extends UseCase {
  async execute({ actor, id }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const repo = useService(TOKENS.TaskRepository);
    const existing = await repo.findById(id);
    if (existing.isFailure) return existing;
    if (!existing.value) return Result.fail(new NotFoundError('Tâche introuvable'));
    if (actor.role === Role.COMMERCIAL && existing.value.ownerId !== actor.id) {
      return Result.fail(new UnauthorizedError('Accès refusé à cette tâche'));
    }
    return repo.remove(id);
  }
}
