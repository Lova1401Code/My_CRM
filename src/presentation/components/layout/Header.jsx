import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User as UserIcon, Sun, Moon, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { ROLE_LABELS } from '../../../core/domain/enums/Role.js';
import { initials } from '../../../shared/utils/formatters.js';
import { NotificationsBell } from '../entities/NotificationsBell.jsx';
import { GlobalSearchModal } from '../GlobalSearchModal.jsx';

export function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden items-center gap-2 rounded-md px-3 py-1.5 text-sm text-slate-400 ring-1 ring-slate-200 hover:bg-slate-50 dark:ring-slate-700 dark:hover:bg-slate-800 md:flex"
        >
          <Search className="h-4 w-4" />
          <span>Rechercher...</span>
          <kbd className="ml-8 rounded border border-slate-300 px-1.5 py-0.5 text-xs dark:border-slate-600">⌘K</kbd>
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <NotificationsBell />
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label={isDark ? 'Activer le thème clair' : 'Activer le thème sombre'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Menu utilisateur"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
              {initials(user?.firstname, user?.lastname)}
            </span>
            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
              {user?.firstname} {user?.lastname}
            </span>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden="true" />
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg bg-white py-1 shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                <div className="border-b border-slate-100 px-4 py-2 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  <p className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">{ROLE_LABELS[user?.role]}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <UserIcon className="h-4 w-4" /> Mon profil
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950"
                >
                  <LogOut className="h-4 w-4" /> Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
    </>
  );
}