// Seed data for the mock database. Passwords are pre-hashed placeholders
// (the mock hasher compares against these literal values for demo purposes).
import { Role } from '../../../core/domain/enums/Role.js';
import { UserStatus } from '../../../core/domain/enums/UserStatus.js';
import { LeadStatus } from '../../../core/domain/enums/LeadStatus.js';
import { DealStage } from '../../../core/domain/enums/DealStage.js';
import { TaskStatus } from '../../../core/domain/enums/TaskStatus.js';
import { TaskPriority } from '../../../core/domain/enums/TaskPriority.js';
import { RelatedEntityType } from '../../../core/domain/enums/RelatedEntityType.js';

export function buildSeed() {
  const now = new Date();
  const iso = (offsetDays, jitterDays = 0) =>
    new Date(now.getTime() - (offsetDays + Math.random() * jitterDays) * 86400000).toISOString();

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
      createdAt: iso(i * 9, 5),
      updatedAt: iso(i * 9, 5),
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
      createdAt: iso(i * 7, 4),
      updatedAt: iso(i * 7, 4),
    });
  }

  const deals = [];
  const dealStages = [
    DealStage.PROSPECT,
    DealStage.QUALIFIED,
    DealStage.PROPOSAL,
    DealStage.NEGOTIATION,
    DealStage.WON,
    DealStage.LOST,
  ];
  for (let i = 0; i < 15; i += 1) {
    const stage = dealStages[i % dealStages.length];
    const customer = customers[i % customers.length];
    deals.push({
      id: `d-${i + 1}`,
      title: `Contrat ${customer.company}`,
      customerId: customer.id,
      amount: ((i % 5) + 1) * 2500 + 1000,
      stage,
      expectedCloseDate: iso(i * 5, 8).slice(0, 10),
      notes: '',
      ownerId: customer.ownerId,
      createdAt: iso(i * 11, 3),
      updatedAt: iso(i * 11, 3),
    });
  }

  // --- Activities (timeline entries) ---
  const activityTypes = ['CALL', 'EMAIL', 'MEETING'];
  const activitySubjects = {
    CALL: ['Appel de suivi', 'Premier contact téléphonique', 'Point hebdomadaire', 'Relance téléphonique'],
    EMAIL: ['Envoi de la proposition', 'Relance par email', 'Confirmation de rendez-vous', 'Documentation envoyée'],
    MEETING: ['Réunion de présentation', 'Atelier de cadrage', 'Démo produit', 'Négociation tarifaire'],
  };
  const activities = [];
  let activityIndex = 0;
  const attach = (relatedType, relatedId, ownerId) => {
    activityIndex += 1;
    const kind = activityTypes[activityIndex % activityTypes.length];
    const subjects = activitySubjects[kind];
    activities.push({
      id: `a-${activityIndex}`,
      type: kind,
      subject: subjects[activityIndex % subjects.length],
      description:
        activityIndex % 3 === 0
          ? 'Échange positif, à retenir dans le suivi du compte.'
          : '',
      relatedType,
      relatedId,
      ownerId,
      occurredAt: iso(activityIndex * 2, 6),
      createdAt: iso(activityIndex * 2, 6),
    });
  };
  customers.slice(0, 8).forEach((customer, i) => {
    attach(RelatedEntityType.CUSTOMER, customer.id, customer.ownerId);
    if (i % 2 === 0) attach(RelatedEntityType.CUSTOMER, customer.id, customer.ownerId);
  });
  leads.slice(0, 8).forEach((lead, i) => {
    attach(RelatedEntityType.LEAD, lead.id, lead.ownerId);
    if (i % 3 === 0) attach(RelatedEntityType.LEAD, lead.id, lead.ownerId);
  });
  deals.slice(0, 8).forEach((deal) => {
    attach(RelatedEntityType.DEAL, deal.id, deal.ownerId);
  });
  activities.sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));

  // --- Tasks (reminders) ---
  const taskTitles = [
    'Rappeler le client',
    'Envoyer la facture',
    'Préparer la proposition commerciale',
    'Planifier une démonstration',
    'Faire suivre le contrat',
    'Mettre à jour la fiche client',
    'Relancer le prospect',
    'Vérifier les disponibilités',
  ];
  const dayMs = 86400000;
  const dueIso = (offsetDays) => new Date(now.getTime() + offsetDays * dayMs).toISOString();
  const taskDueOffsets = [-4, -2, -1, 0, 0, 1, 2, 3, 5, 7];
  const tasks = taskTitles.map((title, i) => {
    const owner = i % 2 === 0 ? 'u-comm-1' : 'u-comm-2';
    const done = i >= taskTitles.length - 3;
    const related = i < 4
      ? { relatedType: RelatedEntityType.CUSTOMER, relatedId: customers[i].id }
      : i < 7
        ? { relatedType: RelatedEntityType.LEAD, relatedId: leads[i - 4].id }
        : { relatedType: null, relatedId: null };
    return {
      id: `t-${i + 1}`,
      title,
      description: i % 2 === 0 ? 'Pensez à préparer les éléments avant l\'échange.' : '',
      dueDate: dueIso(taskDueOffsets[i % taskDueOffsets.length]).slice(0, 10),
      priority: [TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW][i % 3],
      status: done ? TaskStatus.DONE : TaskStatus.OPEN,
      ...related,
      ownerId: owner,
      completedAt: done ? iso(2, 2) : null,
      createdAt: iso(10 + i),
      updatedAt: done ? iso(2, 2) : iso(10 + i),
    };
  });

  // --- Notes ---
  const noteContents = [
    'Client privilégié : privilégier un suivi mensuel rapproché.',
    'Sensible au rapport qualité/prix, mettre en avant les économies réalisables.',
    'Décideur absent lors des échanges, reprendre contact avec la direction.',
    'A exprimé un besoin pour le trimestre prochain.',
    'Concurrent actuel : société X. Détailler nos différenciateurs.',
    'Préfère être contacté en fin de journée.',
    'Budget validé par la direction financière.',
    'À relancer après le salon professionnel de septembre.',
  ];
  const notes = noteContents.map((content, i) => {
    if (i % 2 === 0) {
      const customer = customers[i % customers.length];
      return {
        id: `n-${i + 1}`,
        content,
        relatedType: 'CUSTOMER',
        relatedId: customer.id,
        authorId: customer.ownerId,
        createdAt: iso(i * 3, 3),
        updatedAt: iso(i * 3, 3),
      };
    }
    const lead = leads[i % leads.length];
    return {
      id: `n-${i + 1}`,
      content,
      relatedType: 'LEAD',
      relatedId: lead.id,
      authorId: lead.ownerId,
      createdAt: iso(i * 3, 3),
      updatedAt: iso(i * 3, 3),
    };
  });

  return { users, customers, leads, deals, activities, tasks, notes };
}