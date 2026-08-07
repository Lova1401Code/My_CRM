import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLeads } from '../../adapters/hooks/useLeads.js';
import { useUsers } from '../../adapters/hooks/useUsers.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input, Field, Select } from '../components/ui/Input.jsx';
import { Spinner } from '../components/ui/Feedback.jsx';
import { errorMessage, fieldErrors } from '../../shared/utils/errors.js';
import { LEAD_SOURCES } from '../../core/config/constants.js';
import { LeadStatus, LEAD_STATUS_LABELS } from '../../core/domain/enums/LeadStatus.js';

const EMPTY = {
  firstname: '',
  lastname: '',
  company: '',
  email: '',
  phone: '',
  source: '',
  status: LeadStatus.NEW,
  ownerId: '',
};

export function LeadFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const toast = useToast();
  const { create, update, get, loading } = useLeads();
  const { list: listUsers } = useUsers();

  const [form, setForm] = useState({ ...EMPTY, ownerId: user?.id || '' });
  const [errors, setErrors] = useState({});
  const [fetching, setFetching] = useState(isEdit);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      (async () => {
        const result = await listUsers({ limit: 50 });
        if (result.isSuccess) setOwners(result.value.items);
      })();
    }
  }, [isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    (async () => {
      setFetching(true);
      const result = await get({ actor: user, id });
      setFetching(false);
      if (!active) return;
      if (result.isSuccess && result.value) {
        setForm({ ...EMPTY, ...result.value });
      } else {
        toast.error(errorMessage(result));
        navigate('/leads');
      }
    })();
    return () => { active = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const payload = isAdmin ? form : { ...form, ownerId: user.id };
    const result = isEdit
      ? await update({ actor: user, id, data: payload })
      : await create({ actor: user, data: payload });
    if (result.isSuccess) {
      toast.success(isEdit ? 'Prospect mis à jour' : 'Prospect créé');
      navigate('/leads');
    } else {
      setErrors(fieldErrors(result));
      toast.error(errorMessage(result));
    }
  };

  if (fetching) return <Spinner className="py-20" />;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/leads" className="rounded-md p-2 text-slate-500 hover:bg-slate-200">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          {isEdit ? 'Modifier le prospect' : 'Nouveau prospect'}
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg bg-white p-6 ring-1 ring-slate-200">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Prénom" required error={errors.firstname}>
            <Input value={form.firstname} onChange={set('firstname')} error={errors.firstname} required />
          </Field>
          <Field label="Nom" required error={errors.lastname}>
            <Input value={form.lastname} onChange={set('lastname')} error={errors.lastname} required />
          </Field>
        </div>
        <Field label="Société" error={errors.company}>
          <Input value={form.company} onChange={set('company')} error={errors.company} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email" error={errors.email}>
            <Input type="email" value={form.email} onChange={set('email')} error={errors.email} />
          </Field>
          <Field label="Téléphone" error={errors.phone}>
            <Input value={form.phone} onChange={set('phone')} error={errors.phone} />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Source" error={errors.source}>
            <Select value={form.source} onChange={set('source')} error={errors.source}>
              <option value="">Sélectionner...</option>
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Statut" required error={errors.status}>
            <Select value={form.status} onChange={set('status')} error={errors.status} required>
              {Object.values(LeadStatus).map((s) => (
                <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
              ))}
            </Select>
          </Field>
        </div>
        {isAdmin && (
          <Field label="Propriétaire (commercial)" required error={errors.ownerId}>
            <Select value={form.ownerId} onChange={set('ownerId')} error={errors.ownerId} required>
              <option value="">Sélectionner...</option>
              {owners.map((u) => (
                <option key={u.id} value={u.id}>{u.firstname} {u.lastname}</option>
              ))}
            </Select>
          </Field>
        )}
        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Link to="/leads">
            <Button type="button" variant="secondary">Annuler</Button>
          </Link>
          <Button type="submit" loading={loading}>
            {isEdit ? 'Enregistrer' : 'Créer le prospect'}
          </Button>
        </div>
      </form>
    </div>
  );
}