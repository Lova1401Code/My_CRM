// Task entity: a reminder with a due date, optionally linked to a
// customer, lead or deal.
import { TaskStatus } from '../enums/TaskStatus.js';
import { TaskPriority } from '../enums/TaskPriority.js';

export function createTask({
  id,
  title,
  description = '',
  dueDate,
  priority = TaskPriority.MEDIUM,
  status = TaskStatus.OPEN,
  relatedType = null,
  relatedId = null,
  ownerId = null,
  completedAt = null,
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString(),
}) {
  return Object.freeze({
    id,
    title,
    description,
    dueDate,
    priority,
    status,
    relatedType,
    relatedId,
    ownerId,
    completedAt,
    createdAt,
    updatedAt,
  });
}
