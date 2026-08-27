// Type of a logged activity (manual entries + automatic system events).
export const ActivityType = Object.freeze({
  CALL: 'CALL',
  EMAIL: 'EMAIL',
  MEETING: 'MEETING',
  EVENT: 'EVENT',
});

export const ACTIVITY_TYPE_VALUES = Object.values(ActivityType);

export const ACTIVITY_TYPE_LABELS = {
  [ActivityType.CALL]: 'Appel',
  [ActivityType.EMAIL]: 'Email',
  [ActivityType.MEETING]: 'Réunion',
  [ActivityType.EVENT]: 'Événement',
};

export const ACTIVITY_TYPE_STYLES = {
  [ActivityType.CALL]: 'bg-blue-50 text-blue-700 ring-blue-700/20',
  [ActivityType.EMAIL]: 'bg-violet-50 text-violet-700 ring-violet-700/20',
  [ActivityType.MEETING]: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  [ActivityType.EVENT]: 'bg-slate-100 text-slate-700 ring-slate-600/20',
};
