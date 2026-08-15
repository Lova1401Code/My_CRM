// Mock dashboard service aggregating counts across repositories.
import { Result } from '../../../shared/utils/result.js';
import { delay } from '../helpers.js';
import { LeadStatus } from '../../../core/domain/enums/LeadStatus.js';
import {
  DealStage,
  DEAL_STAGE_PROBABILITY,
} from '../../../core/domain/enums/DealStage.js';

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
  constructor({ userRepository, customerRepository, leadRepository, dealRepository }) {
    this.userRepository = userRepository;
    this.customerRepository = customerRepository;
    this.leadRepository = leadRepository;
    this.dealRepository = dealRepository;
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

  async getPipeline() {
    await delay();
    const dealsRes = await this.dealRepository.findAll();
    if (dealsRes.isFailure) return dealsRes;
    const deals = dealsRes.value;

    const stageMap = {};
    for (const stage of Object.values(DealStage)) {
      stageMap[stage] = { stage, count: 0, amount: 0 };
    }

    let wonRevenue = 0;
    let forecast = 0;
    for (const deal of deals) {
      const entry = stageMap[deal.stage];
      if (!entry) continue;
      entry.count += 1;
      entry.amount += deal.amount;
      if (deal.stage === DealStage.WON) wonRevenue += deal.amount;
      else if (deal.stage !== DealStage.LOST) {
        forecast += (deal.amount * (DEAL_STAGE_PROBABILITY[deal.stage] || 0)) / 100;
      }
    }

    const openDeals = deals.filter(
      (d) => d.stage !== DealStage.WON && d.stage !== DealStage.LOST,
    ).length;

    return Result.ok({
      wonRevenue,
      forecast,
      openDeals,
      dealsByStage: Object.values(stageMap).filter((entry) => entry.count > 0),
    });
  }
}