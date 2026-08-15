import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDeals } from '../../adapters/hooks/useDeals.js';
import { useCustomers } from '../../adapters/hooks/useCustomers.js';
import { useUsers } from '../../adapters/hooks/useUsers.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input, Field, Select, Textarea } from '../components/ui/Input.jsx';
import { Spinner } from '../components/ui/Feedback.jsx';
import { errorMessage, fieldErrors } from '../../shared/utils/errors.js';
import { DealStage, DEAL_STAGE_LABELS } from '../../core/domain/enums/DealStage.js';

const EMPTY = {
  title: '',
  customerId: '',
  amount: '',
  stage: DealStage.PROSPECT,
  expectedCloseDate: '',
  notes: '',
  ownerId: '',
};

export function DealFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const toast = useToast();
  const { create, update, get, loading } = useDeals();
  const { list: listCustomers } = useCustomers();
  const { list: listUsers } = useUsers();

  const [form, setForm] = useState({ ...EMPTY, ownerId: user?.id || '' });
  const [errors, setErrors] = useState({});
  const [fetching, setFetching] = useState(isEdit);
  const [customers, setCustomers] = useState([]);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const [customersRes, ownersRes] = await Promise.all([
        listCustomers({ actor: user, page: 1, limit: 500 }),
        isAdmin ? listUsers({ page: 1, limit: 50 }) : Promise.resolve(null),
      ]);
      if (!active) return;
      if (customersRes.isSuccess) setCustomers(customersRes.value.items);
      if (ownersRes && ownersRes.isSuccess) setOwners(ownersRes.value.items);
    })();
    return () => {
      active = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    (async () => {
      setFetching(true);
      const result = await get({ actor: user, id });
      setFetching(false);
      if (!active) return;
      if (result.isSuccess && result.value) {
        setForm({ ...EMPTY, ...result.value, amount: result.value.amount ?? '' });
      } else {
        toast.error(errorMessage(result));
        navigate('/deals');
      }
    })();
    return () => {
      active = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const payload = {
      ...form,
      amount: Number(form.amount) || 0,
      expectedCloseDate: form.expectedCloseDate || '',
      ownerId: isAdmin ? form.ownerId : user.id,
    };
    const result = isEdit
      ? await update({ actor: user, id, data: payload })
      : await create({ actor: user, data: payload });
    if (result.isSuccess) {
      toast.success(isEdit ? 'Affaire mise à jour' : 'Affaire créée');
      navigate('/deals');
    } else {
      setErrors(fieldErrors(result));
      toast.error(errorMessage(result));
    }
  };

  if (fetching) return <Spinner className="py-20" />;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/deals" className="rounded-md p-2 text-slate-500 hover:bg-slate-200">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          {isEdit ? "Modifier l'affaire" : 'Nouvelle affaire'}
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg bg-white p-6 ring-1 ring-slate-200">
        <Field label="Titre de l'affaire" required error={errors.title}>
          <Input
            value={form.title}
            onChange={set('title')}
            error={errors.title}
            required
            placeholder="Ex. Contrat annuel - TechNova"
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Client" required error={errors.customerId}>
            <Select value={form.customerId} onChange={set('customerId')} error={errors.customerId} required>
              <option value="">Sélectionner...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company || `${c.firstname} ${c.lastname}`}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Montant (EUR)" required error={errors.amount}>
            <Input
              type="number"
              min="0"
              step="100"
              value={form.amount}
              onChange={set('amount')}
              error={errors.amount}
              required
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Étape" required error={errors.stage}>
            <Select value={form.stage} onChange={set('stage')} error={errors.stage} required>
              {Object.values(DealStage).map((s) => (
                <option key={s} value={s}>{DEAL_STAGE_LABELS[s]}</option>
              ))}
            </Select>
          </Field>
          <Field label="Échéance prévue" error={errors.expectedCloseDate}>
            <Input
              type="date"
              value={form.expectedCloseDate}
              onChange={set('expectedCloseDate')}
              error={errors.expectedCloseDate}
            />
          </Field>
        </div>
        <Field label="Notes" error={errors.notes}>
          <Textarea value={form.notes} onChange={set('notes')} error={errors.notes} rows={3} />
        </Field>
        {isAdmin && (
          <Field label="Commercial" required error={errors.ownerId}>
            <Select value={form.ownerId} onChange={set('ownerId')} error={errors.ownerId} required>
              <option value="">Sélectionner...</option>
              {owners.map((u) => (
                <option key={u.id} value={u.id}>{u.firstname} {u.lastname}</option>
              ))}
            </Select>
          </Field>
        )}
        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Link to="/deals">
            <Button type="button" variant="secondary">Annuler</Button>
          </Link>
          <Button type="submit" loading={loading}>
            {isEdit ? 'Enregistrer' : 'Créer l\'affaire'}
          </Button>
        </div>
      </form>
    </div>
  );
}
