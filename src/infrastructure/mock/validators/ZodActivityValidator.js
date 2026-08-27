// Zod-based activity validator implementing IActivityValidator.
import { z } from 'zod';
import { Result } from '../../../shared/utils/result.js';
import { ValidationError } from '../../../core/domain/errors/index.js';
import { ACTIVITY_TYPE_VALUES } from '../../../core/domain/enums/ActivityType.js';
import { RELATED_ENTITY_TYPE_VALUES } from '../../../core/domain/enums/RelatedEntityType.js';

const schema = z.object({
  type: z.enum(ACTIVITY_TYPE_VALUES),
  subject: z.string().min(1, 'L\'objet est requis').max(200),
  description: z.string().max(1000).optional().or(z.literal('')),
  relatedType: z.enum(RELATED_ENTITY_TYPE_VALUES),
  relatedId: z.string().min(1, 'Entité liée requise'),
});

const updateSchema = schema.partial();

export class ZodActivityValidator {
  validate(data, { partial = false } = {}) {
    const s = partial ? updateSchema : schema;
    const parsed = s.safeParse(data);
    if (!parsed.success) {
      const errors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path.join('.') || '_';
        errors[key] = issue.message;
      });
      return Result.fail(new ValidationError('Validation de l\'activité échouée', { errors }));
    }
    return Result.ok(parsed.data);
  }
}

export const activityValidator = new ZodActivityValidator();
