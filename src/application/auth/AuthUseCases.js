import { UseCase } from '../UseCase.js';
import { Result } from '../../shared/utils/result.js';
import { UnauthorizedError } from '../../core/domain/errors/index.js';
import { TOKENS, useService } from '../../infrastructure/container/ServiceContainer.js';

export class LoginUseCase extends UseCase {
  async execute({ email, password }) {
    const authService = useService(TOKENS.AuthService);
    const result = await authService.login(email, password);
    if (result.isFailure) return result;
    return Result.ok(result.value);
  }
}

export class LogoutUseCase extends UseCase {
  async execute() {
    const authService = useService(TOKENS.AuthService);
    return authService.logout();
  }
}

export class GetProfileUseCase extends UseCase {
  async execute({ token }) {
    if (!token) return Result.fail(new UnauthorizedError('Token manquant'));
    const authService = useService(TOKENS.AuthService);
    return authService.getProfile(token);
  }
}