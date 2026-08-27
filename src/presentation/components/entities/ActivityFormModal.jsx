// Modal form to log a manual activity (call, email, meeting).
import { useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Field, Input, Textarea, Select } from '../ui/Input.jsx';
import { useActivities } from '../../../adapters/hooks/useActivities.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { errorMessage, fieldErrors } from '../../../shared/utils/errors.js';
import {
  ActivityType,
  ACTIVITY_TYPE_VALUES,
  ACTIVITY_TYPE_LABELS,
} from '../../../core/domain/enums/ActivityType.js';

export function ActivityFormModal({ open, onClose, relatedType, relatedId, onCreated }) {
  const { user } = useAuth();
  const { create, loading } = useActivities();
  const toast = useToast();

  const [type, setType] = useState(ActivityType.CALL);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setType(ActivityType.CALL);
    setSubject('');
    setDescription('');
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    const result = await create({
      actor: user,
      data: { type, subject, description, relatedType, relatedId },
    });
    setBusy(false);
    if (result.isSuccess) {
      toast.success('Activité enregistrée');
      reset();
      onClose?.();
      onCreated?.(result.value);
    } else {
      toast.error(errorMessage(result));
      setErrors(fieldErrors(result) || {});
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Nouvelle activité"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={busy}>
            Annuler
          </Button>
          <Button type="submit" form="activity-form" loading={busy || loading}>
            Enregistrer
          </Button>
        </>
      }
    >
      <form id="activity-form" onSubmit={handleSubmit} className="space-y-4">
        <Field label="Type" required error={errors.type}>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            error={errors.type}
          >
            {ACTIVITY_TYPE_VALUES.filter((t) => t !== ActivityType.EVENT).map((t) => (
              <option key={t} value={t}>
                {ACTIVITY_TYPE_LABELS[t]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Objet" required error={errors.subject}>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ex : Appel de suivi"
            error={errors.subject}
          />
        </Field>
        <Field label="Compte rendu" error={errors.description}>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Détails de l'échange (facultatif)"
            rows={4}
            error={errors.description}
          />
        </Field>
      </form>
    </Modal>
  );
}
