import { useCallback, useState } from 'react';
import {
  ListNotesUseCase,
  CreateNoteUseCase,
  UpdateNoteUseCase,
  DeleteNoteUseCase,
} from '../../application/notes/NoteUseCases.js';

export function useNotes() {
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (useCase, params) => {
    setLoading(true);
    try {
      return await useCase.execute(params || {});
    } finally {
      setLoading(false);
    }
  }, []);

  const list = useCallback((params) => run(new ListNotesUseCase(), params), [run]);
  const create = useCallback((params) => run(new CreateNoteUseCase(), params), [run]);
  const update = useCallback((params) => run(new UpdateNoteUseCase(), params), [run]);
  const remove = useCallback((params) => run(new DeleteNoteUseCase(), params), [run]);

  return { loading, list, create, update, remove };
}
