// Lightweight Dependency Injection container.
// This is the ONLY place where concrete implementations are wired.
// To switch to the real backend, replace mock repos with Http* repos here.
// Everything else (use cases, hooks, pages) depends on ports, not impls.

import { MockUserRepository } from '../mock/repositories/MockUserRepository.js';
import { MockCustomerRepository } from '../mock/repositories/MockCustomerRepository.js';
import { MockLeadRepository } from '../mock/repositories/MockLeadRepository.js';
import { MockAuthService } from '../mock/services/MockAuthService.js';
import { MockDashboardService } from '../mock/services/MockDashboardService.js';
import { JwtTokenService } from '../mock/services/JwtTokenService.js';
import { MockPasswordHasher } from '../mock/services/MockPasswordHasher.js';
import { ZodUserValidator } from '../mock/validators/ZodUserValidator.js';
import { ZodCustomerValidator } from '../mock/validators/ZodCustomerValidator.js';
import { ZodLeadValidator } from '../mock/validators/ZodLeadValidator.js';

class Container {
  constructor() {
    this.registry = new Map();
  }

  register(key, instance) {
    this.registry.set(key, instance);
  }

  resolve(key) {
    const instance = this.registry.get(key);
    if (!instance) throw new Error(`Service not registered: ${String(key)}`);
    return instance;
  }
}

// --- Tokens (match ports) ---
export const TOKENS = {
  UserRepository: 'UserRepository',
  CustomerRepository: 'CustomerRepository',
  LeadRepository: 'LeadRepository',
  AuthService: 'AuthService',
  DashboardService: 'DashboardService',
  TokenService: 'TokenService',
  PasswordHasher: 'PasswordHasher',
  UserValidator: 'UserValidator',
  CustomerValidator: 'CustomerValidator',
  LeadValidator: 'LeadValidator',
};

// --- Wire the container (mock layer) ---
const container = new Container();

const userRepository = new MockUserRepository();
const customerRepository = new MockCustomerRepository();
const leadRepository = new MockLeadRepository();
const tokenService = new JwtTokenService();
const passwordHasher = new MockPasswordHasher();

container.register(TOKENS.UserRepository, userRepository);
container.register(TOKENS.CustomerRepository, customerRepository);
container.register(TOKENS.LeadRepository, leadRepository);
container.register(TOKENS.TokenService, tokenService);
container.register(TOKENS.PasswordHasher, passwordHasher);
container.register(
  TOKENS.AuthService,
  new MockAuthService({ userRepository, tokenService, passwordHasher }),
);
container.register(
  TOKENS.DashboardService,
  new MockDashboardService({ userRepository, customerRepository, leadRepository }),
);
container.register(TOKENS.UserValidator, new ZodUserValidator());
container.register(TOKENS.CustomerValidator, new ZodCustomerValidator());
container.register(TOKENS.LeadValidator, new ZodLeadValidator());

export function useService(token) {
  return container.resolve(token);
}

export { container };