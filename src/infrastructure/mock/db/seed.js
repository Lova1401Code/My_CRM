// Seed data for the mock database. Passwords are pre-hashed placeholders
// (the mock hasher compares against these literal values for demo purposes).
import { Role } from '../../../core/domain/enums/Role.js';
import { UserStatus } from '../../../core/domain/enums/UserStatus.js';
import { LeadStatus } from '../../../core/domain/enums/LeadStatus.js';

export function buildSeed() {
  const now = new Date();
  const iso = (offsetDays) =>
    new Date(now.getTime() - offsetDays * 86400000).toISOString();

  const users = [
    {
      id: 'u-admin-1',
      firstname: 'Alice',
      lastname: 'Admin',
      email: 'admin@crm.com',
      phone: '+33 6 12 34 56 78',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      // mock hash of "admin123"
      password: '$mock$admin123',
      createdAt: iso(60),
      updatedAt: iso(60),
    },
    {
      id: 'u-comm-1',
      firstname: 'Bruno',
      lastname: 'Commercial',
      email: 'commercial@crm.com',
      phone: '+33 6 23 45 67 89',
      role: Role.COMMERCIAL,
      status: UserStatus.ACTIVE,
      // mock hash of "commercial123"
      password: '$mock$commercial123',
      createdAt: iso(45),
      updatedAt: iso(45),
    },
    {
      id: 'u-comm-2',
      firstname: 'Claire',
      lastname: 'Vente',
      email: 'claire@crm.com',
      phone: '+33 6 34 56 78 90',
      role: Role.COMMERCIAL,
      status: UserStatus.ACTIVE,
      password: '$mock$claire123',
      createdAt: iso(30),
      updatedAt: iso(30),
    },
    {
      id: 'u-comm-3',
      firstname: 'David',
      lastname: 'Prospect',
      email: 'david@crm.com',
      phone: '+33 6 45 67 89 01',
      role: Role.COMMERCIAL,
      status: UserStatus.DISABLED,
      password: '$mock$david123',
      createdAt: iso(15),
      updatedAt: iso(10),
    },
  ];

  const companies = [
    'TechNova',
    'Acme SARL',
    'Globex',
    'Initech',
    'Umbrella',
    'Hooli',
    'Pied Piper',
    'Stark Industries',
    'Wayne Corp',
    'Soylent',
    'Cyberdyne',
    'Massive Dynamic',
  ];
  const cities = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Nantes'];
  const firstNames = ['Luc', 'Marie', 'Paul', 'Sophie', 'Hugo', 'Emma', 'Léo', 'Chloé', 'Nathan', 'Jade', 'Tom', 'Inès', 'Gabriel', 'Manon', 'Adam'];
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Roux', 'Vincent'];

  const customers = [];
  for (let i = 0; i < 18; i += 1) {
    const owner = i % 3 === 0 ? 'u-comm-2' : 'u-comm-1';
    customers.push({
      id: `c-${i + 1}`,
      firstname: firstNames[i % firstNames.length],
      lastname: lastNames[i % lastNames.length],
      company: companies[i % companies.length],
      email: i % 4 === 0 ? '' : `client${i + 1}@${companies[i % companies.length].toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+33 6 ${(10 + i) % 100} ${(20 + i) % 100} ${(30 + i) % 100} ${(40 + i) % 100}`,
      address: `${i + 1} rue du Commerce`,
      city: cities[i % cities.length],
      country: 'France',
      ownerId: owner,
      createdAt: iso(i + 1),
      updatedAt: iso(i + 1),
    });
  }

  const sources = ['Site web', 'Réseaux sociaux', 'Salon professionnel', 'Recommandation', 'Appel entrant'];
  const statuses = [LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.INTERESTED, LeadStatus.NEGOTIATING, LeadStatus.CONVERTED];

  const leads = [];
  for (let i = 0; i < 22; i += 1) {
    const status = statuses[i % statuses.length];
    const owner = i % 2 === 0 ? 'u-comm-1' : 'u-comm-2';
    leads.push({
      id: `l-${i + 1}`,
      firstname: firstNames[(i + 5) % firstNames.length],
      lastname: lastNames[(i + 7) % lastNames.length],
      company: companies[(i + 3) % companies.length],
      email: `prospect${i + 1}@${companies[(i + 3) % companies.length].toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+33 7 ${(50 + i) % 100} ${(60 + i) % 100} ${(70 + i) % 100} ${(80 + i) % 100}`,
      source: sources[i % sources.length],
      status,
      ownerId: owner,
      createdAt: iso(i + 2),
      updatedAt: iso(i + 2),
    });
  }

  return { users, customers, leads };
}