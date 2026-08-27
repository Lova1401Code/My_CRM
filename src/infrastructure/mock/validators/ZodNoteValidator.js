// Zod-based note validator implementing INoteValidator.
import { z } from 'zod';
import { Result } from '../../../shared/utils/result.js';
import { ValidationError } from '../../../core/domain/errors/index.js';
import { RELATED_ENTITY_TYPE_VALUES } from '../../../core/domain/enums/RelatedEntityType.js';

const schema = z.object({
  content: z.string().min(1, 'Le contenu est requis').max(2000),
  relatedType: z.enum(RELATED_ENTITY_TYPE_VALUES),
  relatedId: z.string().min(1, 'Entité liée requise'),
});

const updateSchema = schema.partial();

export class ZodNoteValidator {
  validate(data, { partial = false } = {}) {
    const s = partial ? updateSchema : schema;
    const parsed = s.safeParse(data);
    if (!parsed.success) {
      const errors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path.join('.') || '_';
        errors[key] = issue.message;
      });
      return Result.fail(new ValidationError('Validation de la note échouée', { errors }));
    }
    return Result.ok(parsed.data);
  }
}

export const noteValidator = new ZodNoteValidator();
