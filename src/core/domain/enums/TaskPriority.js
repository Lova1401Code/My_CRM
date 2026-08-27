// Task priority levels.
export const TaskPriority = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
});

export const TASK_PRIORITY_VALUES = Object.values(TaskPriority);

export const TASK_PRIORITY_LABELS = {
  [TaskPriority.LOW]: 'Basse',
  [TaskPriority.MEDIUM]: 'Moyenne',
  [TaskPriority.HIGH]: 'Haute',
};

export const TASK_PRIORITY_STYLES = {
  [TaskPriority.LOW]: 'bg-slate-100 text-slate-700 ring-slate-600/20',
  [TaskPriority.MEDIUM]: 'bg-blue-50 text-blue-700 ring-blue-700/20',
  [TaskPriority.HIGH]: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};
