// Deal (pipeline opportunity) entity factory, linked to a customer.
import { DealStage } from '../enums/DealStage.js';

export function createDeal({
  id,
  title,
  customerId,
  amount = 0,
  stage = DealStage.PROSPECT,
  expectedCloseDate = '',
  notes = '',
  ownerId = null,
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString(),
}) {
  return Object.freeze({
    id,
    title,
    customerId,
    amount,
    stage,
    expectedCloseDate,
    notes,
    ownerId,
    createdAt,
    updatedAt,
  });
}
