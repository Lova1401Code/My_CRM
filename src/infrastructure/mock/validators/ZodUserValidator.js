// Zod-based user validator implementing IUserValidator.
import { z } from 'zod';
import { Result } from '../../../shared/utils/result.js';
import { ValidationError } from '../../../core/domain/errors/index.js';
import { Role } from '../../../core/domain/enums/Role.js';
import { UserStatus } from '../../../core/domain/enums/UserStatus.js';

const base = z.object({
  firstname: z.string().min(1, 'Le prénom est requis').max(50),
  lastname: z.string().min(1, 'Le nom est requis').max(50),
  email: z.string().email('Email invalide'),
  phone: z.string().max(20).optional().or(z.literal('')),
  role: z.enum([Role.ADMIN, Role.COMMERCIAL]),
  status: z.enum([UserStatus.ACTIVE, UserStatus.DISABLED]).optional(),
});

const createSchema = base.extend({
  password: z.string().min(6, 'Mot de passe min. 6 caractères'),
});

const updateSchema = base.partial().extend({
  password: z.string().min(6).optional(),
});

export class ZodUserValidator {
  validate(data, { partial = false } = {}) {
    const schema = partial ? updateSchema : createSchema;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path.join('.') || '_';
        errors[key] = issue.message;
      });
      return Result.fail(new ValidationError('Validation utilisateur échouée', { errors }));
    }
    return Result.ok(parsed.data);
  }
}

export const userValidator = new ZodUserValidator();