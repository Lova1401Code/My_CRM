// Lead status lifecycle enum.
export const LeadStatus = Object.freeze({
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  INTERESTED: 'INTERESTED',
  NEGOTIATING: 'NEGOTIATING',
  CONVERTED: 'CONVERTED',
});

export const LEAD_STATUS_VALUES = Object.values(LeadStatus);

export function isLeadStatus(value) {
  return LEAD_STATUS_VALUES.includes(value);
}

export const LEAD_STATUS_LABELS = {
  [LeadStatus.NEW]: 'Nouveau',
  [LeadStatus.CONTACTED]: 'Contacté',
  [LeadStatus.INTERESTED]: 'Intéressé',
  [LeadStatus.NEGOTIATING]: 'En négociation',
  [LeadStatus.CONVERTED]: 'Converti',
};

// Badge color mapping for UI (kept here as domain knowledge).
export const LEAD_STATUS_STYLES = {
  [LeadStatus.NEW]: 'bg-slate-100 text-slate-700 ring-slate-600/20',
  [LeadStatus.CONTACTED]: 'bg-blue-50 text-blue-700 ring-blue-700/20',
  [LeadStatus.INTERESTED]: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  [LeadStatus.NEGOTIATING]: 'bg-purple-50 text-purple-700 ring-purple-700/20',
  [LeadStatus.CONVERTED]: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
};