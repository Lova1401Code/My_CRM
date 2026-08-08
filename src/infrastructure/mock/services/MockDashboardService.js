// Mock dashboard service aggregating counts across repositories.
import { Result } from '../../../shared/utils/result.js';
import { delay } from '../helpers.js';
import { LeadStatus } from '../../../core/domain/enums/LeadStatus.js';

const MONTHS_SPAN = 12;

function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function buildMonthBuckets(span) {
  const now = new Date();
  const buckets = [];
  for (let i = span - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      month: monthKey(date),
      label: date.toLocaleDateString('fr-FR', { month: 'short' }),
      leads: 0,
      customers: 0,
    });
  }
  return buckets;
}

function bucketize(items) {
  const buckets = new Map();
  for (const item of items) {
    const key = monthKey(item.createdAt);
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }
  return buckets;
}

export class MockDashboardService {
  constructor({ userRepository, customerRepository, leadRepository }) {
    this.userRepository = userRepository;
    this.customerRepository = customerRepository;
    this.leadRepository = leadRepository;
  }

  async getStats() {
    await delay();
    const [users, customers, leads, converted] = await Promise.all([
      this.userRepository.count(),
      this.customerRepository.count(),
      this.leadRepository.count(),
      this.leadRepository.countConverted(),
    ]);
    if (users.isFailure) return users;
    if (customers.isFailure) return customers;
    if (leads.isFailure) return leads;
    if (converted.isFailure) return converted;

    return Result.ok({
      customersCount: customers.value,
      leadsCount: leads.value,
      usersCount: users.value,
      convertedLeadsCount: converted.value,
    });
  }

  async getEvolution() {
    await delay();
    const [leadsRes, customersRes] = await Promise.all([
      this.leadRepository.findAll(),
      this.customerRepository.findAll(),
    ]);
    if (leadsRes.isFailure) return leadsRes;
    if (customersRes.isFailure) return customersRes;

    const leads = leadsRes.value;
    const customers = customersRes.value;

    const leadsByMonth = bucketize(leads);
    const customersByMonth = bucketize(customers);

    const evolution = buildMonthBuckets(MONTHS_SPAN).map((bucket) => ({
      ...bucket,
      leads: leadsByMonth.get(bucket.month) || 0,
      customers: customersByMonth.get(bucket.month) || 0,
    }));

    const leadsByStatus = Object.values(LeadStatus)
      .map((status) => ({
        status,
        count: leads.filter((l) => l.status === status).length,
      }))
      .filter((entry) => entry.count > 0);

    const sourceCounts = new Map();
    for (const lead of leads) {
      const source = lead.source || 'Non renseignée';
      sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1);
    }
    const leadsBySource = [...sourceCounts.entries()]
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    return Result.ok({ evolution, leadsByStatus, leadsBySource });
  }
}