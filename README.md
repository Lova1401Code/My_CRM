# CRM — Application de gestion commerciale

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6e9f18?logo=vitest&logoColor=white)

Application CRM full-stack pour la gestion de la relation client : prospects, clients, pipeline de ventes, tâches, activités et tableau de bord analytique.

## Aperçu

<!-- Placez vos screenshots ici -->
<!-- ![Dashboard](./screenshots/dashboard.png) -->
<!-- ![Leads](./screenshots/leads.png) -->
<!-- ![Dark Mode](./screenshots/dark-mode.png) -->

## Fonctionnalités

### Gestion commerciale
- **Prospects (Leads)** : CRUD complet, conversion en clients, scoring automatique (0-100)
- **Clients (Customers)** : CRUD complet, étiquettes/tags, fiche détaillée
- **Pipeline de ventes (Deals)** : vue liste + kanban, suivi par étape, montants
- **Tâches** : CRUD, priorités, échéances, liaison entités, toggle rapide
- **Activités** : timeline d'appels/emails/réunions/événements
- **Notes** : polymorphiques (clients, prospects, deals)

### Expérience utilisateur
- **Tableau de bord** : KPIs, évolution mensuelle, pipeline, sources, statuts
- **Recherche globale** (Ctrl+K) across clients, prospects, affaires, tâches
- **Notifications in-app** : tâches en retard, prospects inactifs, affaires en retard
- **Filtres avancés** : statut, source, tags, propriétaire, plage de dates
- **Tri** sur colonnes cliquables
- **Export CSV** des clients, prospects et affaires
- **Étiquettes/Tags** colorés sur clients et prospects
- **Dark mode** avec persistance localStorage
- **Lead scoring** automatique basé sur source, statut, activités, récence

### Architecture
- **Clean Architecture / Hexagonale** : séparation core/domain → application → infrastructure → presentation
- **Ports & Adapters** : interfaces de repositories, services, validateurs
- **Design responsive** mobile-first avec Tailwind CSS

## Stack technique

| Domaine | Technologie |
|---------|-------------|
| Framework | React 19 |
| Build | Vite 8 |
| Styles | Tailwind CSS 4 |
| Routing | React Router 7 |
| Charts | Recharts 3 |
| Validation | Zod 4 |
| HTTP | Axios |
| Tests | Vitest |
| Linter | oxlint |

## Architecture du frontend

```
src/
├── core/               # Couche domaine (entités, enums, ports, config)
│   ├── domain/         # Entités métier (Customer, Lead, Deal, Task...)
│   ├── ports/          # Interfaces (repositories, services, validators)
│   └── config/         # Constantes applicatives
├── application/        # Cas d'utilisation (Use Cases)
│   ├── customers/      # Use cases clients
│   ├── leads/          # Use cases prospects (+ conversion)
│   ├── deals/          # Use cases affaires
│   ├── tasks/          # Use cases tâches
│   └── ...
├── infrastructure/     # Adaptateurs (HTTP, DI container)
│   ├── http/           # Repositories HTTP, client API
│   └── container/      # Inversion de dépendances
├── presentation/       # UI (pages, composants, context)
│   ├── pages/          # 14 pages (dashboard, listes, formulaires, détails)
│   ├── components/     # Composants réutilisables (UI, charts, entities)
│   ├── context/        # Auth, Toast, Theme, ServerStatus
│   └── routes/         # Router configuration
├── adapters/           # Hooks React (bridge presentation ↔ application)
└── shared/             # Utils partagés (formatters, errors, result)
```

## Prérequis

- Node.js 20+
- npm 10+
- Backend CRM démarré sur `http://localhost:4000/api` (voir [CRM Backend](../CRM_backend/README.md))

## Installation

```bash
# Cloner le projet
git clone <repo-url>
cd CRM

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:4000/api

# Démarrer le serveur de développement
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@crm.com | admin123 |
| Commercial | commercial@crm.com | commercial123 |
| Commercial | claire@crm.com | claire123 |

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run preview` | Prévisualisation du build |
| `npm test` | Tests unitaires |
| `npm run test:coverage` | Tests avec coverage |
| `npm run lint` | Linting (oxlint) |

## Structure des fonctionnalités

### Lead Scoring
Le score (0-100) est calculé automatiquement à partir de :
- **Source** : Recommandation (25pts), Salon (20pts), Appel entrant (18pts), Site web (12pts), Réseaux sociaux (8pts)
- **Statut** : NEW (5pts) → NEGOTIATING (45pts) → CONVERTED (50pts)
- **Activités** : jusqu'à 20pts selon le nombre d'activités liées
- **Récence** : < 7 jours (+10pts), < 30 jours (+5pts), > 90 jours (-10pts)
- **Contact** : email (+3pts), téléphone (+2pts)
- **Tags** : Hot (+15pts), Stratégique (+10pts)

### Notifications
Calculées en temps réel à partir des données :
- Tâches en retard (high) / à faire aujourd'hui (medium)
- Prospects sans activité > 7 jours (medium) / inactifs > 14 jours (low)
- Affaires en retard de clôture (high)

## Licence

MIT