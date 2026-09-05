import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, TrendingUp, Activity, UserRound, ShieldCheck, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input, Field } from '../components/ui/Input.jsx';
import { Logo } from '../components/layout/Logo.jsx';
import { errorMessage } from '../../shared/utils/errors.js';
import { APP } from '../../core/config/constants.js';

const features = [
  { icon: Users, title: 'Gestion clients', desc: 'Centralisez vos contacts et suivez vos relations' },
  { icon: TrendingUp, title: 'Pipeline commercial', desc: 'Visualisez vos opportunités et vos deals en cours' },
  { icon: Activity, title: 'Suivi des activités', desc: 'Gardez une trace de chaque interaction avec vos clients' },
];

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
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Brand panel — left */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-10 lg:flex">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-indigo-300 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <div>
              <h1 className="text-2xl font-bold text-white">{APP.NAME}</h1>
              <p className="text-sm text-indigo-200">Gestion commerciale</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <img
            src="/undraw_business-pitch_h9yw.svg"
            alt="Illustration CRM"
            className="w-full max-w-sm drop-shadow-2xl"
          />
          <p className="mt-6 max-w-sm text-center text-lg font-medium text-indigo-100">
            Pilotez votre relation client en toute simplicité
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{f.title}</p>
                <p className="text-xs text-indigo-200">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="relative z-10 text-sm text-indigo-200">
          © {new Date().getFullYear()} {APP.NAME}. Tous droits réservés.
        </p>
      </div>

      {/* Form panel — right */}
      <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto p-6 lg:w-1/2">
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <Logo size={40} />
          <h1 className="text-xl font-bold text-indigo-600">{APP.NAME}</h1>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Bon retour 👋</h2>
            <p className="mt-2 text-slate-500">Connectez-vous à votre compte pour continuer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <LogIn className="h-4 w-4" />
              Se connecter
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-400">comptes de démonstration</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="flex items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 transition-all hover:bg-indigo-100 hover:border-indigo-300"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('commercial')}
              className="flex items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 transition-all hover:bg-indigo-100 hover:border-indigo-300"
            >
              <UserRound className="h-4 w-4" />
              Commercial
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400 lg:hidden">
          © {new Date().getFullYear()} {APP.NAME}. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}