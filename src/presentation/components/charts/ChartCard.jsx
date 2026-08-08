export function ChartCard({ title, subtitle, children }) {
  return (
    <div className="rounded-lg bg-white p-5 ring-1 ring-slate-200 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
