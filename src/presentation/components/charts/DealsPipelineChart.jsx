import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { DEAL_STAGE_LABELS } from '../../../core/domain/enums/DealStage.js';

const STAGE_COLORS = {
  PROSPECT: '#94a3b8',
  QUALIFIED: '#3b82f6',
  PROPOSAL: '#f59e0b',
  NEGOTIATION: '#8b5cf6',
  WON: '#10b981',
  LOST: '#f43f5e',
};

export function DealsPipelineChart({ data }) {
  const rows = (data || []).map((d) => ({
    name: DEAL_STAGE_LABELS[d.stage] || d.stage,
    count: d.count,
    amount: d.amount,
    color: STAGE_COLORS[d.stage] || '#94a3b8',
  }));

  if (rows.length === 0) {
    return <p className="py-16 text-center text-sm text-slate-400">Aucune donnée à afficher</p>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip formatter={(value) => [`${value} affaire(s)`, 'Nombre']} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
            {rows.map((row) => (
              <Cell key={row.name} fill={row.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
