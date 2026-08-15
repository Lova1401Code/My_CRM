// Stat card for the dashboard.
import { Users, UserCheck, Briefcase, TrendingUp, Banknote, Target, Handshake } from 'lucide-react';

const ICONS = {
  customers: Users,
  leads: UserCheck,
  users: Briefcase,
  converted: TrendingUp,
  revenue: Banknote,
  forecast: Target,
  deals: Handshake,
};

const COLORS = {
  customers: 'bg-indigo-50 text-indigo-600',
  leads: 'bg-blue-50 text-blue-600',
  users: 'bg-purple-50 text-purple-600',
  converted: 'bg-emerald-50 text-emerald-600',
  revenue: 'bg-emerald-50 text-emerald-600',
  forecast: 'bg-amber-50 text-amber-600',
  deals: 'bg-indigo-50 text-indigo-600',
};

export function StatCard({ type, label, value }) {
  const Icon = ICONS[type] || Users;
  return (
    <div className="rounded-lg bg-white p-5 ring-1 ring-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${COLORS[type]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}