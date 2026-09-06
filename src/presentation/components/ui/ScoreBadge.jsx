export function ScoreBadge({ score }) {
  const color =
    score >= 70 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
    : score >= 40 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
    : 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>
      {score}/100
    </span>
  );
}