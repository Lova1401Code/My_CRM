// Mock auth service implementing IAuthService.
import { Result } from '../../../shared/utils/result.js';
import { UnauthorizedError, ValidationError } from '../../../core/domain/errors/index.js';
import { toPublicUser, createUser } from '../../../core/domain/entities/User.js';
import { UserStatus } from '../../../core/domain/enums/UserStatus.js';
import { delay } from '../helpers.js';

export class MockAuthService {
  constructor({ userRepository, tokenService, passwordHasher }) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.passwordHasher = passwordHasher;
  }

  async login(email, password) {
    await delay();
    if (!email || !password) {
      return Result.fail(new ValidationError('Email et mot de passe requis'));
    }
    const userResult = await this.userRepository.findByEmail(email);
    if (userResult.isFailure) return userResult;
    const user = userResult.value;
    if (!user) return Result.fail(new UnauthorizedError('Identifiants invalids'));
    if (user.status === UserStatus.DISABLED) {
      return Result.fail(new UnauthorizedError('Compte désactivé'));
    }
    const valid = await this.passwordHasher.compare(password, user.password);
    if (!valid) return Result.fail(new UnauthorizedError('Identifiants invalids'));

    const token = this.tokenService.encode({ sub: user.id, role: user.role });
    return Result.ok({ token, user: toPublicUser(user) });
  }

  async logout() {
    await delay(100);
    return Result.ok();
  }

  async getProfile(token) {
    await delay();
    const payload = this.tokenService.decode(token);
    if (!payload || !payload.sub) return Result.ok(null);
    const result = await this.userRepository.findByIdWithCredentials(payload.sub);
    if (result.isFailure) return result;
    const user = result.value;
    return Result.ok(user ? toPublicUser(user) : null);
  }
}