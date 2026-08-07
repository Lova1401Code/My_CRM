// Zod-based customer validator implementing ICustomerValidator.
import { z } from 'zod';
import { Result } from '../../../shared/utils/result.js';
import { ValidationError } from '../../../core/domain/errors/index.js';

const schema = z.object({
  firstname: z.string().min(1, 'Le prénom est requis').max(50),
  lastname: z.string().min(1, 'Le nom est requis').max(50),
  company: z.string().max(100).optional().or(z.literal('')),
  // Email can be empty per business rule.
  email: z.union([z.literal(''), z.string().email('Email invalide')]),
  phone: z.string().max(20).optional().or(z.literal('')),
  address: z.string().max(200).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
  ownerId: z.string().min(1, 'Propriétaire requis'),
});

const updateSchema = schema.partial();

export class ZodCustomerValidator {
  validate(data, { partial = false } = {}) {
    const s = partial ? updateSchema : schema;
    const parsed = s.safeParse(data);
    if (!parsed.success) {
      const errors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path.join('.') || '_';
        errors[key] = issue.message;
      });
      return Result.fail(new ValidationError('Validation client échouée', { errors }));
    }
    return Result.ok(parsed.data);
  }
}

export const customerValidator = new ZodCustomerValidator();