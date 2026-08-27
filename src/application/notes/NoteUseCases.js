// Use cases for notes attached to customers/leads.
import { UseCase } from '../UseCase.js';
import { Result } from '../../shared/utils/result.js';
import {
  NotFoundError,
  UnauthorizedError,
} from '../../core/domain/errors/index.js';
import { TOKENS, useService } from '../../infrastructure/container/ServiceContainer.js';
import { Role } from '../../core/domain/enums/Role.js';
import { assertRelatedAccess } from '../activities/ActivityUseCases.js';

export class ListNotesUseCase extends UseCase {
  async execute({ _actor, page, limit, search, filters } = {}) {
    // Entity-level access is enforced by the detail pages (they check the
    // related customer/lead before listing). Notes themselves carry only the
    // author, so no owner filter is needed here.
    const repo = useService(TOKENS.NoteRepository);
    return repo.findMany({ page, limit, search, filters });
  }
}

export class CreateNoteUseCase extends UseCase {
  async execute({ actor, data }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const validator = useService(TOKENS.NoteValidator);
    const repo = useService(TOKENS.NoteRepository);

    const validation = validator.validate(data);
    if (validation.isFailure) return validation;

    const access = await assertRelatedAccess(
      actor,
      validation.value.relatedType,
      validation.value.relatedId,
    );
    if (access.isFailure) return access;

    return repo.create({ ...validation.value, authorId: actor.id });
  }
}

export class UpdateNoteUseCase extends UseCase {
  async execute({ actor, id, data }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const repo = useService(TOKENS.NoteRepository);
    const existing = await repo.findById(id);
    if (existing.isFailure) return existing;
    if (!existing.value) return Result.fail(new NotFoundError('Note introuvable'));
    const canEdit = existing.value.authorId === actor.id || actor.role === Role.ADMIN;
    if (!canEdit) {
      return Result.fail(new UnauthorizedError('Seul l\'auteur peut modifier cette note'));
    }

    const validator = useService(TOKENS.NoteValidator);
    const validation = validator.validate(data, { partial: true });
    if (validation.isFailure) return validation;

    return repo.update(id, validation.value);
  }
}

export class DeleteNoteUseCase extends UseCase {
  async execute({ actor, id }) {
    if (!actor) return Result.fail(new UnauthorizedError('Authentification requise'));
    const repo = useService(TOKENS.NoteRepository);
    const existing = await repo.findById(id);
    if (existing.isFailure) return existing;
    if (!existing.value) return Result.fail(new NotFoundError('Note introuvable'));
    const canDelete = existing.value.authorId === actor.id || actor.role === Role.ADMIN;
    if (!canDelete) {
      return Result.fail(new UnauthorizedError('Seul l\'auteur peut supprimer cette note'));
    }
    return repo.remove(id);
  }
}
