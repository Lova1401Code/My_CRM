// Activity entity: a timeline entry (call, email, meeting) attached to a
// customer, lead or deal. Automatic system events use type EVENT.
import { ActivityType } from '../enums/ActivityType.js';

export function createActivity({
  id,
  type = ActivityType.EVENT,
  subject,
  description = '',
  relatedType,
  relatedId,
  ownerId = null,
  occurredAt = new Date().toISOString(),
  createdAt = new Date().toISOString(),
}) {
  return Object.freeze({
    id,
    type,
    subject,
    description,
    relatedType,
    relatedId,
    ownerId,
    occurredAt,
    createdAt,
  });
}
