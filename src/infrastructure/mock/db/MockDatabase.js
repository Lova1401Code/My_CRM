// In-memory mock database with localStorage persistence.
import { APP } from '../../../core/config/constants.js';
import { buildSeed } from './seed.js';

const STORAGE_KEY = APP.STORAGE_KEY;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupted storage
  }
  return null;
}

function persist(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage may be unavailable (private mode) — fall back to in-memory only
  }
}

class MockDatabase {
  constructor() {
    this.data = load() || buildSeed();
    persist(this.data);
  }

  get users() {
    return this.data.users;
  }

  get customers() {
    return this.data.customers;
  }

  get leads() {
    return this.data.leads;
  }

  get deals() {
    return this.data.deals;
  }

  get activities() {
    return this.data.activities;
  }

  get tasks() {
    return this.data.tasks;
  }

  get notes() {
    return this.data.notes;
  }

  save() {
    persist(this.data);
  }

  reset() {
    this.data = buildSeed();
    persist(this.data);
  }
}

// Singleton — single source of truth for the mock layer.
export const db = new MockDatabase();