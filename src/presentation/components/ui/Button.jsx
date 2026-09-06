// Button component — variants + sizes.
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-600',
  secondary: 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600 dark:hover:bg-slate-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-600',
  ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400 dark:text-slate-300 dark:hover:bg-slate-800',
  outline: 'bg-transparent text-indigo-600 ring-1 ring-indigo-600 hover:bg-indigo-50 focus-visible:ring-indigo-600 dark:text-indigo-400 dark:ring-indigo-400 dark:hover:bg-indigo-950',
};

const SIZES = {
  sm: 'px-2.5 py-1.5 text-xs gap-1.5',
  md: 'px-3.5 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center rounded-md font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}