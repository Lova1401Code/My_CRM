// Zod-based deal validator implementing IDealValidator.
import { z } from 'zod';
import { Result } from '../../../shared/utils/result.js';
import { ValidationError } from '../../../core/domain/errors/index.js';
import { DEAL_STAGE_VALUES } from '../../../core/domain/enums/DealStage.js';

const schema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  customerId: z.string().min(1, 'Le client est requis'),
  amount: z.coerce.number().min(0, 'Montant invalide'),
  stage: z.enum(DEAL_STAGE_VALUES),
  expectedCloseDate: z.union([z.literal(''), z.string().date('Date invalide')]).optional(),
  notes: z.string().max(1000).optional().or(z.literal('')),
  ownerId: z.string().min(1, 'Propriétaire requis'),
});

const updateSchema = schema.partial();

export class ZodDealValidator {
  validate(data, { partial = false } = {}) {
    const s = partial ? updateSchema : schema;
    const parsed = s.safeParse(data);
    if (!parsed.success) {
      const errors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path.join('.') || '_';
        errors[key] = issue.message;
      });
      return Result.fail(new ValidationError('Validation de l\'affaire échouée', { errors }));
    }
    return Result.ok(parsed.data);
  }
}

export const dealValidator = new ZodDealValidator();
