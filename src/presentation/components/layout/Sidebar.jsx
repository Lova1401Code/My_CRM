import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, UserCog, Handshake, X, ListTodo } from 'lucide-react';
import { APP } from '../../../core/config/constants.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { ListTasksUseCase } from '../../../application/tasks/TaskUseCases.js';
import { TaskStatus } from '../../../core/domain/enums/TaskStatus.js';

const NAV_ITEMS = [
  { to: '/', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/customers', label: 'Clients', icon: Users },
  { to: '/leads', label: 'Prospects', icon: UserCheck },
  { to: '/deals', label: 'Pipeline de ventes', icon: Handshake },
  { to: '/tasks', label: 'Tâches', icon: ListTodo, tasks: true },
  { to: '/users', label: 'Utilisateurs', icon: UserCog, adminOnly: true },
];

export function Sidebar({ open, onClose }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [openTasks, setOpenTasks] = useState(0);
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  // Refresh the open-tasks badge on mount and after each navigation.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!user) return;
      const result = await new ListTasksUseCase().execute({
        actor: user,
        page: 1,
        limit: 1,
        filters: { status: TaskStatus.OPEN },
      });
      if (active && result.isSuccess) setOpenTasks(result.value.total);
    })();
    return () => {
      active = false;
    };
  }, [user, location.pathname]);

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-slate-200 transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <span className="text-lg font-semibold text-white">{APP.NAME}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {item.tasks && openTasks > 0 && (
                  <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-semibold text-white">
                    {openTasks > 99 ? '99+' : openTasks}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}