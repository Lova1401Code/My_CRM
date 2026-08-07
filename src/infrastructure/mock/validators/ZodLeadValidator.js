// Zod-based lead validator implementing ILeadValidator.
import { z } from 'zod';
import { Result } from '../../../shared/utils/result.js';
import { ValidationError } from '../../../core/domain/errors/index.js';
import { LEAD_STATUS_VALUES } from '../../../core/domain/enums/LeadStatus.js';

const schema = z.object({
  firstname: z.string().min(1, 'Le prénom est requis').max(50),
  lastname: z.string().min(1, 'Le nom est requis').max(50),
  company: z.string().max(100).optional().or(z.literal('')),
  email: z.union([z.literal(''), z.string().email('Email invalide')]),
  phone: z.string().max(20).optional().or(z.literal('')),
  source: z.string().max(100).optional().or(z.literal('')),
  status: z.enum(LEAD_STATUS_VALUES),
  ownerId: z.string().min(1, 'Propriétaire requis'),
});

const updateSchema = schema.partial();

export class ZodLeadValidator {
  validate(data, { partial = false } = {}) {
    const s = partial ? updateSchema : schema;
    const parsed = s.safeParse(data);
    if (!parsed.success) {
      const errors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path.join('.') || '_';
        errors[key] = issue.message;
      });
      return Result.fail(new ValidationError('Validation prospect échouée', { errors }));
    }
    return Result.ok(parsed.data);
  }
}

export const leadValidator = new ZodLeadValidator();