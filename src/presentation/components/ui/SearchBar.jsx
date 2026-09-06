// SearchBar with debounce.
import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

export function SearchBar({ value, onChange, placeholder = 'Rechercher...', debounceMs = 300 }) {
  const [local, setLocal] = useState(value || '');
  const timer = useRef(null);

  useEffect(() => {
    setLocal(value || '');
  }, [value]);

  const handleChange = (e) => {
    const next = e.target.value;
    setLocal(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(next), debounceMs);
  };

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        className="block w-full rounded-md border-0 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-600 dark:placeholder:text-slate-500"
      />
    </div>
  );
}