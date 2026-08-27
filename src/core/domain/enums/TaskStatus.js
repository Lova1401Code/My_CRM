// Task lifecycle status.
export const TaskStatus = Object.freeze({
  OPEN: 'OPEN',
  DONE: 'DONE',
});

export const TASK_STATUS_VALUES = Object.values(TaskStatus);

export const TASK_STATUS_LABELS = {
  [TaskStatus.OPEN]: 'À faire',
  [TaskStatus.DONE]: 'Terminée',
};

export const TASK_STATUS_STYLES = {
  [TaskStatus.OPEN]: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  [TaskStatus.DONE]: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
};
