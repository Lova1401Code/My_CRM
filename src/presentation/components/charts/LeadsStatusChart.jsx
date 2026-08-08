import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { LeadStatus, LEAD_STATUS_LABELS } from '../../../core/domain/enums/LeadStatus.js';

const STATUS_COLORS = {
  [LeadStatus.NEW]: '#94a3b8',
  [LeadStatus.CONTACTED]: '#3b82f6',
  [LeadStatus.INTERESTED]: '#f59e0b',
  [LeadStatus.NEGOTIATING]: '#8b5cf6',
  [LeadStatus.CONVERTED]: '#10b981',
};

export function LeadsStatusChart({ data }) {
  const rows = (data || []).map((d) => ({
    name: LEAD_STATUS_LABELS[d.status] || d.status,
    value: d.count,
    color: STATUS_COLORS[d.status] || '#94a3b8',
  }));

  if (rows.length === 0) {
    return <p className="py-16 text-center text-sm text-slate-400">Aucune donnée à afficher</p>;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={rows}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            strokeWidth={0}
          >
            {rows.map((row) => (
              <Cell key={row.name} fill={row.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
