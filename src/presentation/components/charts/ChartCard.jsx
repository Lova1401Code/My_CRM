export function ChartCard({ title, subtitle, children }) {
  return (
    <div className="rounded-lg bg-white p-5 ring-1 ring-slate-200 shadow-sm dark:bg-slate-800 dark:ring-slate-700">
      <div>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
