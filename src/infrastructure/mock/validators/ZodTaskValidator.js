// Zod-based task validator implementing ITaskValidator.
import { z } from 'zod';
import { Result } from '../../../shared/utils/result.js';
import { ValidationError } from '../../../core/domain/errors/index.js';
import { TASK_STATUS_VALUES } from '../../../core/domain/enums/TaskStatus.js';
import { TASK_PRIORITY_VALUES } from '../../../core/domain/enums/TaskPriority.js';
import { RELATED_ENTITY_TYPE_VALUES } from '../../../core/domain/enums/RelatedEntityType.js';

const schema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  description: z.string().max(1000).optional().or(z.literal('')),
  dueDate: z.string().min(1, 'L\'échéance est requise').refine(
    (value) => !Number.isNaN(new Date(value).getTime()),
    'Date invalide',
  ),
  priority: z.enum(TASK_PRIORITY_VALUES).default('MEDIUM'),
  status: z.enum(TASK_STATUS_VALUES).default('OPEN'),
  relatedType: z.enum(RELATED_ENTITY_TYPE_VALUES).nullable().optional(),
  relatedId: z.string().min(1).nullable().optional(),
});

const updateSchema = schema.partial();

export class ZodTaskValidator {
  validate(data, { partial = false } = {}) {
    const s = partial ? updateSchema : schema;
    const parsed = s.safeParse(data);
    if (!parsed.success) {
      const errors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path.join('.') || '_';
        errors[key] = issue.message;
      });
      return Result.fail(new ValidationError('Validation de la tâche échouée', { errors }));
    }
    return Result.ok(parsed.data);
  }
}

export const taskValidator = new ZodTaskValidator();
