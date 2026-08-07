import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input, Field } from '../components/ui/Input.jsx';
import { errorMessage } from '../../shared/utils/errors.js';
import { APP } from '../../core/config/constants.js';

export function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.isSuccess) {
      toast.success(`Bienvenue, ${result.value.user.firstname} !`);
      navigate(from, { replace: true });
    } else {
      toast.error(errorMessage(result));
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@crm.com');
      setPassword('admin123');
    } else {
      setEmail('commercial@crm.com');
      setPassword('commercial123');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900">{APP.NAME}</h1>
          <p className="mt-1 text-sm text-slate-500">Gestion commerciale</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
          <h2 className="mb-6 text-xl font-semibold text-slate-800">Connexion</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email" required htmlFor="email">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="vous@exemple.com"
              />
            </Field>
            <Field label="Mot de passe" required htmlFor="password">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </Field>
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Se connecter
            </Button>
          </form>
          <div className="mt-6 border-t border-slate-200 pt-4">
            <p className="mb-2 text-center text-xs text-slate-500">Comptes de démonstration</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" onClick={() => fillDemo('admin')} type="button">
                Admin
              </Button>
              <Button variant="secondary" size="sm" onClick={() => fillDemo('commercial')} type="button">
                Commercial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}