import { useState, useEffect, useRef } from 'react';
import { Bell, AlertTriangle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../adapters/hooks/useNotifications.js';
import { useAuth } from '../../context/AuthContext.jsx';

const SEVERITY_ICONS = {
  high: AlertTriangle,
  medium: Clock,
  low: AlertCircle,
};

const SEVERITY_COLORS = {
  high: 'text-rose-600 dark:text-rose-400',
  medium: 'text-amber-600 dark:text-amber-400',
  low: 'text-slate-500 dark:text-slate-400',
};

export function NotificationsBell() {
  const { user } = useAuth();
  const { notifications, count, fetch } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    if (!user) return;
    fetch();
    const interval = setInterval(fetch, 60000);
    return () => clearInterval(interval);
  }, [user, fetch]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleClick = (item) => {
    navigate(item.url);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-semibold text-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 rounded-lg bg-white py-1 shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          <div className="border-b border-slate-100 px-4 py-2 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Notifications</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{count} notification(s)</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-400">Aucune notification</p>
            ) : (
              notifications.map((n) => {
                const Icon = SEVERITY_ICONS[n.severity] || Bell;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => handleClick(n)}
                    className="flex w-full items-start gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${SEVERITY_COLORS[n.severity]}`} />
                    <p className="flex-1 text-sm text-slate-600 dark:text-slate-300">{n.message}</p>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}