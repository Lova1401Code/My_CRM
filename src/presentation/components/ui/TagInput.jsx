import { useState, useRef, useMemo } from 'react';
import { X, Plus } from 'lucide-react';

const TAG_COLORS = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
];

function colorForTag(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) | 0;
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export function TagBadge({ tag, onRemove }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${colorForTag(tag)}`}>
      {tag}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(tag)}
          className="ml-0.5 rounded-full hover:bg-black/10"
          aria-label={`Retirer ${tag}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

export function TagInput({ value = [], onChange, suggestions = [], placeholder = 'Ajouter un tag...' }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const tags = Array.isArray(value) ? value : [];

  const filteredSuggestions = useMemo(() => {
    if (!input.trim()) return [];
    const q = input.toLowerCase();
    return suggestions
      .filter((s) => s.toLowerCase().includes(q) && !tags.includes(s))
      .slice(0, 5);
  }, [input, suggestions, tags]);

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
    inputRef.current?.focus();
  };

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-1.5 rounded-md bg-white px-2 py-1.5 ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-indigo-600 dark:bg-slate-800 dark:ring-slate-600">
        {tags.map((tag) => (
          <TagBadge key={tag} tag={tag} onRemove={removeTag} />
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-20 border-0 bg-transparent px-1 py-0.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
        />
      </div>
      {filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              <Plus className="h-3 w-3" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}