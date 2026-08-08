// Application-wide constants (single source of truth).
export const APP = Object.freeze({
  NAME: 'CRM',
  VERSION: '1.0.0',
  STORAGE_KEY: 'crm.mock.db.v2',
  TOKEN_KEY: 'crm.token',
  USER_KEY: 'crm.user',
  SIMULATED_LATENCY_MS: 250,
});

export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50],
});

export const LEAD_SOURCES = Object.freeze([
  'Site web',
  'Réseaux sociaux',
  'Salon professionnel',
  'Recommandation',
  'Appel entrant',
  'Email entrant',
  'Autre',
]);

export const COUNTRIES = Object.freeze([
  'France',
  'Belgique',
  'Suisse',
  'Maroc',
  'Canada',
  'Sénégal',
  'Côte d\'Ivoire',
  'Tunisie',
  'Algérie',
  'Autre',
]);