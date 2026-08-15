// Deal (pipeline) stage lifecycle enum with associated sales probabilities.
export const DealStage = Object.freeze({
  PROSPECT: 'PROSPECT',
  QUALIFIED: 'QUALIFIED',
  PROPOSAL: 'PROPOSAL',
  NEGOTIATION: 'NEGOTIATION',
  WON: 'WON',
  LOST: 'LOST',
});

export const DEAL_STAGE_VALUES = Object.values(DealStage);

export function isDealStage(value) {
  return DEAL_STAGE_VALUES.includes(value);
}

export const DEAL_STAGE_LABELS = {
  [DealStage.PROSPECT]: 'Prospection',
  [DealStage.QUALIFIED]: 'Qualifié',
  [DealStage.PROPOSAL]: 'Proposition',
  [DealStage.NEGOTIATION]: 'Négociation',
  [DealStage.WON]: 'Gagné',
  [DealStage.LOST]: 'Perdu',
};

// Probability used for weighted revenue forecast (non-closed stages).
export const DEAL_STAGE_PROBABILITY = {
  [DealStage.PROSPECT]: 10,
  [DealStage.QUALIFIED]: 25,
  [DealStage.PROPOSAL]: 50,
  [DealStage.NEGOTIATION]: 75,
  [DealStage.WON]: 100,
  [DealStage.LOST]: 0,
};

// Badge color mapping for UI (kept here as domain knowledge).
export const DEAL_STAGE_STYLES = {
  [DealStage.PROSPECT]: 'bg-slate-100 text-slate-700 ring-slate-600/20',
  [DealStage.QUALIFIED]: 'bg-blue-50 text-blue-700 ring-blue-700/20',
  [DealStage.PROPOSAL]: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  [DealStage.NEGOTIATION]: 'bg-purple-50 text-purple-700 ring-purple-700/20',
  [DealStage.WON]: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  [DealStage.LOST]: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};
