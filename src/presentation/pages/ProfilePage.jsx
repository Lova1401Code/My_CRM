import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input, Field } from '../components/ui/Input.jsx';
import { Spinner } from '../components/ui/Feedback.jsx';
import { errorMessage, fieldErrors } from '../../shared/utils/errors.js';
import { TOKENS, useService } from '../../infrastructure/container/ServiceContainer.js';
import { ROLE_LABELS } from '../../core/domain/enums/Role.js';
import { formatDate } from '../../shared/utils/formatters.js';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleProfile = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const repo = useService(TOKENS.UserRepository);
    const result = await repo.update(user.id, form);
    setLoading(false);
    if (result.isSuccess) {
      updateUser((prev) => ({ ...prev, ...form }));
      toast.success('Profil mis à jour');
    } else {
      toast.error(result.error?.message || 'Erreur');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!password || password.length < 6) {
      setErrors({ password: 'Minimum 6 caractères' });
      return;
    }
    setLoading(true);
    const hasher = useService(TOKENS.PasswordHasher);
    const repo = useService(TOKENS.UserRepository);
    const hashed = await hasher.hash(password);
    const result = await repo.update(user.id, { password: hashed });
    setLoading(false);
    if (result.isSuccess) {
      setPassword('');
      toast.success('Mot de passe modifié');
    } else {
      toast.error(errorMessage(result));
    }
  };

  if (!user) return <Spinner className="py-20" />;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mon profil</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Gérez vos informations personnelles</p>
      </div>

      <div className="rounded-lg bg-white p-6 ring-1 ring-slate-200">
        <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Rôle</span>
            <p className="font-medium text-slate-800">{ROLE_LABELS[user.role]}</p>
          </div>
          <div>
            <span className="text-slate-500">Membre depuis</span>
            <p className="font-medium text-slate-800">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleProfile} className="space-y-5 rounded-lg bg-white p-6 ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Informations</h2>
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
        <div className="flex justify-end border-t border-slate-200 pt-4">
          <Button type="submit" loading={loading}>Enregistrer</Button>
        </div>
      </form>

      <form onSubmit={handlePassword} className="space-y-5 rounded-lg bg-white p-6 ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Changer le mot de passe</h2>
        <Field label="Nouveau mot de passe" required error={errors.password} hint="Minimum 6 caractères">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </Field>
        <div className="flex justify-end border-t border-slate-200 pt-4">
          <Button type="submit" loading={loading} variant="outline">Modifier le mot de passe</Button>
        </div>
      </form>
    </div>
  );
}