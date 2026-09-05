import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, TrendingUp, Activity, Target, Handshake, BarChart3, UserRound, ShieldCheck, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input, Field } from '../components/ui/Input.jsx';
import { Logo } from '../components/layout/Logo.jsx';
import { errorMessage } from '../../shared/utils/errors.js';
import { APP } from '../../core/config/constants.js';

const features = [
  { icon: Users, title: 'Contacts & comptes', desc: 'Fédérez vos clients et prospects dans une base unique' },
  { icon: Target, title: 'Leads & opportunities', desc: 'Transformez vos prospects en clients avec un pipeline visuel' },
  { icon: Handshake, title: 'Deals & négociations', desc: 'Suivez chaque étape de vos devis et accords commerciaux' },
  { icon: BarChart3, title: 'Tableaux de bord', desc: 'Pilotez votre performance avec des indicateurs en temps réel' },
];

const stats = [
  { value: '+38%', label: 'Taux de conversion' },
  { value: '24/7', label: 'Suivi commercial' },
  { value: '360°', label: 'Vue client' },
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
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-700 via-purple-800 to-fuchsia-900 p-10 lg:flex">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-fuchsia-400 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <div>
              <h1 className="text-2xl font-bold text-white">{APP.NAME}</h1>
              <p className="text-sm text-purple-200">Customer Relationship Management</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <img
            src="/undraw_business-pitch_h9yw.svg"
            alt="Illustration CRM"
            className="w-full max-w-sm drop-shadow-2xl"
          />
          <p className="mt-6 max-w-sm text-center text-lg font-medium text-purple-100">
            Accélérez votre croissance commerciale
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
                <p className="text-xs text-purple-200">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 flex items-center gap-8 border-t border-white/15 pt-6">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-purple-200">{s.label}</p>
            </div>
          ))}
        </div>

        <p className="relative z-10 text-sm text-purple-200">
          © {new Date().getFullYear()} {APP.NAME}. Tous droits réservés.
        </p>
      </div>

      {/* Form panel — right */}
      <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-slate-50 p-6 lg:w-1/2">
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <Logo size={40} />
          <h1 className="text-xl font-bold text-purple-700">{APP.NAME}</h1>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Accès à votre espace</h2>
            <p className="mt-2 text-slate-500">Saisissez vos identifiants pour accéder au tableau de bord commercial</p>
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
              Accéder au CRM
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-50 px-3 text-xs text-slate-400">comptes de démonstration</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="flex items-center justify-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-700 transition-all hover:bg-purple-100 hover:border-purple-300"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('commercial')}
              className="flex items-center justify-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-700 transition-all hover:bg-purple-100 hover:border-purple-300"
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