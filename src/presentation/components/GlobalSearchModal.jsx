import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, UserCheck, Handshake, ListTodo } from 'lucide-react';
import { useSearch } from '../../adapters/hooks/useSearch.js';

const TYPE_ICONS = {
  CUSTOMER: Users,
  LEAD: UserCheck,
  DEAL: Handshake,
  TASK: ListTodo,
};

const TYPE_LABELS = {
  CUSTOMER: 'Client',
  LEAD: 'Prospect',
  DEAL: 'Affaire',
  TASK: 'Tâche',
};

export function GlobalSearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { results, search, loading } = useSearch();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, open, search]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleSelect = useCallback((item) => {
    navigate(item.url);
    onClose();
  }, [navigate, onClose]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!open) return null;

  const grouped = results.reduce((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  let flatIndex = -1;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm fade-in" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-xl rounded-lg bg-white shadow-2xl fade-in dark:bg-slate-800">
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher un client, prospect, affaire, tâche..."
            className="flex-1 border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
          />
          <kbd className="hidden rounded border border-slate-300 px-1.5 py-0.5 text-xs text-slate-400 dark:border-slate-600 sm:block">ESC</kbd>
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {loading && query.length >= 2 && (
            <p className="px-3 py-4 text-center text-sm text-slate-400">Recherche...</p>
          )}
          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="px-3 py-4 text-center text-sm text-slate-400">Aucun résultat pour « {query} »</p>
          )}
          {!loading && query.length < 2 && (
            <p className="px-3 py-4 text-center text-sm text-slate-400">Tapez au moins 2 caractères</p>
          )}
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">{TYPE_LABELS[type]}</p>
              {items.map((item) => {
                flatIndex++;
                const Icon = TYPE_ICONS[item.type] || Search;
                const isActive = flatIndex === selectedIndex;
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(flatIndex)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition ${
                      isActive ? 'bg-indigo-50 dark:bg-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{item.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}