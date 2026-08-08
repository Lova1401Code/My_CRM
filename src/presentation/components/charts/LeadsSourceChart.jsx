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

const SOURCE_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#94a3b8'];

export function LeadsSourceChart({ data }) {
  const rows = (data || []).map((d, i) => ({
    name: d.source,
    count: d.count,
    color: SOURCE_COLORS[i % SOURCE_COLORS.length],
  }));

  if (rows.length === 0) {
    return <p className="py-16 text-center text-sm text-slate-400">Aucune donnée à afficher</p>;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Bar dataKey="count" name="Prospects" radius={[0, 4, 4, 0]} barSize={22}>
            {rows.map((row) => (
              <Cell key={row.name} fill={row.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
