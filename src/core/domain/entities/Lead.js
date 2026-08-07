// Lead (prospect) entity factory.
import { LeadStatus } from '../enums/LeadStatus.js';

export function createLead({
  id,
  firstname,
  lastname,
  company = '',
  email = '',
  phone = '',
  source = '',
  status = LeadStatus.NEW,
  ownerId = null,
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString(),
}) {
  return Object.freeze({
    id,
    firstname,
    lastname,
    company,
    email,
    phone,
    source,
    status,
    ownerId,
    createdAt,
    updatedAt,
  });
}