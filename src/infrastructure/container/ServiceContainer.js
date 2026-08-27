// Lightweight Dependency Injection container.
// This is the ONLY place where concrete implementations are wired.
// HTTP repositories call the NestJS backend API. Mock repos are kept for
// reference but are no longer wired here.

import { HttpUserRepository } from '../http/repositories/HttpUserRepository.js';
import { HttpCustomerRepository } from '../http/repositories/HttpCustomerRepository.js';
import { HttpLeadRepository } from '../http/repositories/HttpLeadRepository.js';
import { HttpDealRepository } from '../http/repositories/HttpDealRepository.js';
import { HttpActivityRepository } from '../http/repositories/HttpActivityRepository.js';
import { HttpTaskRepository } from '../http/repositories/HttpTaskRepository.js';
import { HttpNoteRepository } from '../http/repositories/HttpNoteRepository.js';
import { HttpAuthService } from '../http/services/HttpAuthService.js';
import { HttpDashboardService } from '../http/services/HttpDashboardService.js';
import { ZodUserValidator } from '../mock/validators/ZodUserValidator.js';
import { ZodCustomerValidator } from '../mock/validators/ZodCustomerValidator.js';
import { ZodLeadValidator } from '../mock/validators/ZodLeadValidator.js';
import { ZodDealValidator } from '../mock/validators/ZodDealValidator.js';
import { ZodActivityValidator } from '../mock/validators/ZodActivityValidator.js';
import { ZodTaskValidator } from '../mock/validators/ZodTaskValidator.js';
import { ZodNoteValidator } from '../mock/validators/ZodNoteValidator.js';

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
  DealRepository: 'DealRepository',
  ActivityRepository: 'ActivityRepository',
  TaskRepository: 'TaskRepository',
  NoteRepository: 'NoteRepository',
  AuthService: 'AuthService',
  DashboardService: 'DashboardService',
  TokenService: 'TokenService',
  PasswordHasher: 'PasswordHasher',
  UserValidator: 'UserValidator',
  CustomerValidator: 'CustomerValidator',
  LeadValidator: 'LeadValidator',
  DealValidator: 'DealValidator',
  ActivityValidator: 'ActivityValidator',
  TaskValidator: 'TaskValidator',
  NoteValidator: 'NoteValidator',
};

// --- Wire the container (HTTP layer → NestJS backend) ---
const container = new Container();

const userRepository = new HttpUserRepository();
const customerRepository = new HttpCustomerRepository();
const leadRepository = new HttpLeadRepository();
const dealRepository = new HttpDealRepository();
const activityRepository = new HttpActivityRepository();
const taskRepository = new HttpTaskRepository();
const noteRepository = new HttpNoteRepository();

container.register(TOKENS.UserRepository, userRepository);
container.register(TOKENS.CustomerRepository, customerRepository);
container.register(TOKENS.LeadRepository, leadRepository);
container.register(TOKENS.DealRepository, dealRepository);
container.register(TOKENS.ActivityRepository, activityRepository);
container.register(TOKENS.TaskRepository, taskRepository);
container.register(TOKENS.NoteRepository, noteRepository);

// Auth & Dashboard services (HTTP)
container.register(TOKENS.AuthService, new HttpAuthService());
container.register(TOKENS.DashboardService, new HttpDashboardService());

// TokenService & PasswordHasher are no longer needed (backend handles them),
// but we keep placeholder no-op instances for any code that might reference them.
container.register(TOKENS.TokenService, {
  encode: () => '',
  decode: () => null,
});
container.register(TOKENS.PasswordHasher, {
  hash: async (plain) => plain,
  compare: async () => false,
});

// Validators (Zod) — kept client-side for immediate feedback
container.register(TOKENS.UserValidator, new ZodUserValidator());
container.register(TOKENS.CustomerValidator, new ZodCustomerValidator());
container.register(TOKENS.LeadValidator, new ZodLeadValidator());
container.register(TOKENS.DealValidator, new ZodDealValidator());
container.register(TOKENS.ActivityValidator, new ZodActivityValidator());
container.register(TOKENS.TaskValidator, new ZodTaskValidator());
container.register(TOKENS.NoteValidator, new ZodNoteValidator());

export function useService(token) {
  return container.resolve(token);
}

export { container };