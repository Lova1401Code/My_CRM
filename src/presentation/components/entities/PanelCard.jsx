// Panel card used across detail pages (activities, tasks, notes).
export function PanelCard({ title, subtitle, action, children }) {
  return (
    <div className="rounded-lg bg-white p-5 ring-1 ring-slate-200 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
