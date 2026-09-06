// Input + Label + Textarea + Select + Form field wrapper.
import { useId } from 'react';

export function Field({ label, error, required, hint, children, htmlFor }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
          {required && <span className="ml-0.5 text-rose-600">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}

const baseInput =
  'block w-full rounded-md border-0 bg-white px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-600 dark:placeholder:text-slate-500 dark:disabled:bg-slate-700';

export function Input({ error, className = '', ...rest }) {
  return (
    <input
      className={`${baseInput} ${error ? 'ring-rose-500 focus:ring-rose-500' : ''} ${className}`}
      {...rest}
    />
  );
}

export function Textarea({ error, className = '', rows = 3, ...rest }) {
  return (
    <textarea
      rows={rows}
      className={`${baseInput} ${error ? 'ring-rose-500 focus:ring-rose-500' : ''} ${className}`}
      {...rest}
    />
  );
}

export function Select({ error, className = '', children, ...rest }) {
  return (
    <select
      className={`${baseInput} ${error ? 'ring-rose-500 focus:ring-rose-500' : ''} ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}

// Labeled field helper that wires id + error.
export function LabeledField({ label, error, required, hint, name, ...inputProps }) {
  const id = useId();
  return (
    <Field label={label} error={error} required={required} hint={hint} htmlFor={id}>
      <Input id={id} name={name} error={error} {...inputProps} />
    </Field>
  );
}

export function LabeledSelect({ label, error, required, hint, name, children, ...selectProps }) {
  const id = useId();
  return (
    <Field label={label} error={error} required={required} hint={hint} htmlFor={id}>
      <Select id={id} name={name} error={error} {...selectProps}>
        {children}
      </Select>
    </Field>
  );
}