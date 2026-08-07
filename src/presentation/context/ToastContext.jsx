// ToastContext: lightweight toast notifications.
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) setTimeout(() => remove(id), duration);
      return id;
    },
    [remove],
  );

  const success = useCallback((m, d) => push(m, 'success', d), [push]);
  const error = useCallback((m, d) => push(m, 'error', d), [push]);
  const info = useCallback((m, d) => push(m, 'info', d), [push]);

  const value = useMemo(() => ({ push, success, error, info, remove }), [push, success, error, info, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={`flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg ring-1 ring-black/5 animate-in slide-in-from-right ${
            t.type === 'success'
              ? 'bg-emerald-50 text-emerald-800'
              : t.type === 'error'
                ? 'bg-rose-50 text-rose-800'
                : 'bg-slate-50 text-slate-800'
          }`}
        >
          <span className="flex-1 text-sm font-medium">{t.message}</span>
          <button
            type="button"
            onClick={() => onClose(t.id)}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}