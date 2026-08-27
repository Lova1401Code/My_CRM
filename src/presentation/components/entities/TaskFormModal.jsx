// Modal form to create/edit a task.
import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Field, Input, Textarea, Select } from '../ui/Input.jsx';
import { useTasks } from '../../../adapters/hooks/useTasks.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { errorMessage, fieldErrors } from '../../../shared/utils/errors.js';
import { toDateString } from '../../../shared/utils/dateHelpers.js';
import {
  TaskPriority,
  TASK_PRIORITY_VALUES,
  TASK_PRIORITY_LABELS,
} from '../../../core/domain/enums/TaskPriority.js';

export function TaskFormModal({ open, onClose, task, defaultRelated, onSaved }) {
  const { user } = useAuth();
  const { create, update, loading } = useTasks();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(toDateString(new Date()));
  const [priority, setPriority] = useState(TaskPriority.MEDIUM);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const isEdit = Boolean(task);

  useEffect(() => {
    if (!open) return;
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate ? toDateString(task.dueDate) : toDateString(new Date()));
      setPriority(task.priority);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(toDateString(new Date()));
      setPriority(TaskPriority.MEDIUM);
    }
    setErrors({});
  }, [open, task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    const payload = { title, description, dueDate, priority };
    let result;
    if (isEdit) {
      result = await update({ actor: user, id: task.id, data: payload });
    } else {
      result = await create({
        actor: user,
        data: { ...payload, relatedType: defaultRelated?.relatedType ?? null, relatedId: defaultRelated?.relatedId ?? null },
      });
    }
    setBusy(false);
    if (result.isSuccess) {
      toast.success(isEdit ? 'Tâche mise à jour' : 'Tâche créée');
      onClose?.();
      onSaved?.(result.value);
    } else {
      toast.error(errorMessage(result));
      setErrors(fieldErrors(result) || {});
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Modifier la tâche' : 'Nouvelle tâche'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Annuler
          </Button>
          <Button type="submit" form="task-form" loading={busy || loading}>
            {isEdit ? 'Enregistrer' : 'Créer'}
          </Button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
        <Field label="Titre" required error={errors.title}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Rappeler le client"
            error={errors.title}
          />
        </Field>
        <Field label="Description" error={errors.description}>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Détails (facultatif)"
            rows={3}
            error={errors.description}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Échéance" required error={errors.dueDate}>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              error={errors.dueDate}
            />
          </Field>
          <Field label="Priorité" error={errors.priority}>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              error={errors.priority}
            >
              {TASK_PRIORITY_VALUES.map((p) => (
                <option key={p} value={p}>
                  {TASK_PRIORITY_LABELS[p]}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </form>
    </Modal>
  );
}
