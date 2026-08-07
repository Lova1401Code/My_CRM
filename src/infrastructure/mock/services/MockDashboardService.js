// Mock dashboard service aggregating counts across repositories.
import { Result } from '../../../shared/utils/result.js';
import { delay } from '../helpers.js';

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
}