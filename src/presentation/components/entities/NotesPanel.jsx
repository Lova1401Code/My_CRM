// Notes panel: add, edit (own) and delete notes for an entity.
import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, StickyNote, Trash2, X } from 'lucide-react';
import { useNotes } from '../../../adapters/hooks/useNotes.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../ui/Button.jsx';
import { Textarea } from '../ui/Input.jsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.jsx';
import { Spinner, EmptyState } from '../ui/Feedback.jsx';
import { PanelCard } from './PanelCard.jsx';
import { errorMessage } from '../../../shared/utils/errors.js';
import { formatDateTime } from '../../../shared/utils/formatters.js';

export function NotesPanel({ relatedType, relatedId }) {
  const { user, isAdmin } = useAuth();
  const { list, create, update, remove, loading } = useNotes();
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [busy, setBusy] = useState(false);

  const fetch = useCallback(async () => {
    if (!relatedId) return;
    setFetching(true);
    const result = await list({
      actor: user,
      page: 1,
      limit: 100,
      filters: { relatedType, relatedId },
    });
    setFetching(false);
    if (result.isSuccess) setItems(result.value.items);
    else toast.error(errorMessage(result));
  }, [user, relatedType, relatedId, list, toast]);

  useEffect(() => {
    fetch();
  }, [fetch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setBusy(true);
    const result = await create({
      actor: user,
      data: { content: draft.trim(), relatedType, relatedId },
    });
    setBusy(false);
    if (result.isSuccess) {
      setDraft('');
      toast.success('Note ajoutée');
      fetch();
    } else {
      toast.error(errorMessage(result));
    }
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditDraft(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft('');
  };

  const handleUpdate = async (noteId) => {
    if (!editDraft.trim()) return;
    setBusy(true);
    const result = await update({ actor: user, id: noteId, data: { content: editDraft.trim() } });
    setBusy(false);
    if (result.isSuccess) {
      cancelEdit();
      toast.success('Note mise à jour');
      fetch();
    } else {
      toast.error(errorMessage(result));
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    const result = await remove({ actor: user, id: confirmId });
    setBusy(false);
    setConfirmId(null);
    if (result.isSuccess) {
      toast.success('Note supprimée');
      fetch();
    } else {
      toast.error(errorMessage(result));
    }
  };

  const canManage = (note) => isAdmin || note.authorId === user?.id;

  return (
    <PanelCard title="Notes" subtitle="Informations internes partagées sur cette fiche">
      <form onSubmit={handleCreate} className="flex items-start gap-2">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ajouter une note…"
          rows={2}
          className="flex-1"
        />
        <Button type="submit" size="sm" loading={busy || loading} disabled={!draft.trim()}>
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </form>

      {fetching || loading ? (
        <Spinner className="py-8" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<StickyNote className="h-8 w-8" />}
          title="Aucune note"
          description="Les notes ajoutées apparaîtront ici."
        />
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((note) => (
            <li key={note.id} className="rounded-md bg-slate-50 p-3 ring-1 ring-slate-200/70">
              {editingId === note.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(note.id)}
                      loading={busy}
                      disabled={!editDraft.trim()}
                    >
                      Enregistrer
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEdit}>
                      <X className="h-4 w-4" />
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-sm text-slate-700">{note.content}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-400">{formatDateTime(note.createdAt)}</p>
                    {canManage(note) && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(note)}
                          className="rounded p-1.5 text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-600"
                          aria-label="Modifier la note"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(note.id)}
                          className="rounded p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          aria-label="Supprimer la note"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(confirmId)}
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="Supprimer la note"
        message="Cette note sera définitivement supprimée. Continuer ?"
        loading={busy}
      />
    </PanelCard>
  );
}
