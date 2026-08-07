import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useUsers } from '../../adapters/hooks/useUsers.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input, Field, Select } from '../components/ui/Input.jsx';
import { Spinner } from '../components/ui/Feedback.jsx';
import { errorMessage, fieldErrors } from '../../shared/utils/errors.js';
import { Role, ROLE_LABELS } from '../../core/domain/enums/Role.js';
import { UserStatus, USER_STATUS_LABELS } from '../../core/domain/enums/UserStatus.js';

const EMPTY = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  role: Role.COMMERCIAL,
  status: UserStatus.ACTIVE,
  password: '',
};

export function UserFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const { create, update, list, loading } = useUsers();

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    (async () => {
      setFetching(true);
      const result = await list({ page: 1, limit: 50, search: '' });
      setFetching(false);
      if (!active) return;
      if (result.isSuccess) {
        const found = result.value.items.find((u) => u.id === id);
        if (found) setForm({ ...EMPTY, ...found, password: '' });
        else {
          toast.error('Utilisateur introuvable');
          navigate('/users');
        }
      } else {
        toast.error(errorMessage(result));
      }
    })();
    return () => { active = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const payload = { ...form };
    if (isEdit && !payload.password) delete payload.password;
    const result = isEdit
      ? await update({ actor: user, id, data: payload })
      : await create({ actor: user, data: payload });
    if (result.isSuccess) {
      toast.success(isEdit ? 'Utilisateur mis à jour' : 'Utilisateur créé');
      navigate('/users');
    } else {
      setErrors(fieldErrors(result));
      toast.error(errorMessage(result));
    }
  };

  if (fetching) return <Spinner className="py-20" />;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/users" className="rounded-md p-2 text-slate-500 hover:bg-slate-200">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          {isEdit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email" required error={errors.email}>
            <Input type="email" value={form.email} onChange={set('email')} error={errors.email} required />
          </Field>
          <Field label="Téléphone" error={errors.phone}>
            <Input value={form.phone} onChange={set('phone')} error={errors.phone} />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Rôle" required error={errors.role}>
            <Select value={form.role} onChange={set('role')} error={errors.role} required>
              {Object.values(Role).map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </Select>
          </Field>
          {isEdit && (
            <Field label="Statut" required error={errors.status}>
              <Select value={form.status} onChange={set('status')} error={errors.status} required>
                {Object.values(UserStatus).map((s) => (
                  <option key={s} value={s}>{USER_STATUS_LABELS[s]}</option>
                ))}
              </Select>
            </Field>
          )}
        </div>
        <Field
          label={isEdit ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
          required={!isEdit}
          error={errors.password}
          hint="Minimum 6 caractères"
        >
          <Input
            type="password"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            required={!isEdit}
            autoComplete="new-password"
            placeholder={isEdit ? 'Laisser vide pour ne pas changer' : '••••••••'}
          />
        </Field>
        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Link to="/users">
            <Button type="button" variant="secondary">Annuler</Button>
          </Link>
          <Button type="submit" loading={loading}>
            {isEdit ? 'Enregistrer' : 'Créer l\'utilisateur'}
          </Button>
        </div>
      </form>
    </div>
  );
}