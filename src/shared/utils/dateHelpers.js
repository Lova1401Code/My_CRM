// Due-date classification helpers for tasks and reminders.
// All comparisons use local dates (YYYY-MM-DD strings or Date inputs).

function startOfDay(input) {
  const date = input instanceof Date ? new Date(input) : new Date(`${input}T00:00:00`);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function toDateString(input) {
  const date = input instanceof Date ? input : new Date(input);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function isOverdue(dueDate, reference = new Date()) {
  if (!dueDate) return false;
  return startOfDay(dueDate).getTime() < startOfDay(reference).getTime();
}

export function isToday(dueDate, reference = new Date()) {
  if (!dueDate) return false;
  return startOfDay(dueDate).getTime() === startOfDay(reference).getTime();
}

// Buckets: 'overdue' | 'today' | 'upcoming' | 'none'.
export function getDueBucket(dueDate, reference = new Date()) {
  if (!dueDate) return 'none';
  if (isOverdue(dueDate, reference)) return 'overdue';
  if (isToday(dueDate, reference)) return 'today';
  return 'upcoming';
}
