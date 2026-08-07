import { UseCase } from '../UseCase.js';
import { Result } from '../../shared/utils/result.js';
import {
  ValidationError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../core/domain/errors/index.js';
import { TOKENS, useService } from '../../infrastructure/container/ServiceContainer.js';
import { Role } from '../../core/domain/enums/Role.js';

export class ListUsersUseCase extends UseCase {
  async execute({ page, limit, search, filters } = {}) {
    const repo = useService(TOKENS.UserRepository);
    return repo.findMany({ page, limit, search, filters });
  }
}

export class GetUserUseCase extends UseCase {
  async execute({ id }) {
    const repo = useService(TOKENS.UserRepository);
    const result = await repo.findById(id);
    if (result.isFailure) return result;
    if (!result.value) return Result.fail(new NotFoundError('Utilisateur introuvable'));
    return result;
  }
}

export class CreateUserUseCase extends UseCase {
  // actor: current user performing the action (for authorization)
  async execute({ actor, data }) {
    if (!actor || actor.role !== Role.ADMIN) {
      return Result.fail(new UnauthorizedError('Réservé à l\'administrateur'));
    }
    const validator = useService(TOKENS.UserValidator);
    const repo = useService(TOKENS.UserRepository);
    const hasher = useService(TOKENS.PasswordHasher);

    const validation = validator.validate(data);
    if (validation.isFailure) return validation;

    const unique = await repo.isEmailUnique(data.email);
    if (unique.isFailure) return unique;
    if (!unique.value) {
      return Result.fail(new ConflictError('Cet email est déjà utilisé'));
    }

    const hashed = await hasher.hash(data.password);
    return repo.create({ ...validation.value, password: hashed });
  }
}

export class UpdateUserUseCase extends UseCase {
  async execute({ actor, id, data }) {
    if (!actor || actor.role !== Role.ADMIN) {
      return Result.fail(new UnauthorizedError('Réservé à l\'administrateur'));
    }
    const validator = useService(TOKENS.UserValidator);
    const repo = useService(TOKENS.UserRepository);
    const hasher = useService(TOKENS.PasswordHasher);

    const validation = validator.validate(data, { partial: true });
    if (validation.isFailure) return validation;

    if (data.email) {
      const unique = await repo.isEmailUnique(data.email, id);
      if (unique.isFailure) return unique;
      if (!unique.value) return Result.fail(new ConflictError('Cet email est déjà utilisé'));
    }

    let payload = { ...validation.value };
    if (data.password) {
      payload.password = await hasher.hash(data.password);
    }
    return repo.update(id, payload);
  }
}

export class DeleteUserUseCase extends UseCase {
  async execute({ actor, id }) {
    if (!actor || actor.role !== Role.ADMIN) {
      return Result.fail(new UnauthorizedError('Réservé à l\'administrateur'));
    }
    if (actor.id === id) {
      return Result.fail(new ValidationError('Vous ne pouvez pas supprimer votre propre compte'));
    }
    const repo = useService(TOKENS.UserRepository);
    return repo.remove(id);
  }
}