import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { getBatches } from '../../api/animalApi';
import { getPrices } from '../../api/farmApi';
import { formatCurrency } from '../../utils/formatters';

const types = [
  { value: 'milk', label: 'Milk (L)' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'weight', label: 'Weight (kg)' },
];

const sessions = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'single', label: 'Single' },
];

export default function ProductionForm({ open, onClose, onSubmit, loading, animals }) {
  const [useBatch, setUseBatch] = useState(false);
  const [batches, setBatches] = useState([]);
  const [prices, setPrices] = useState([]);
  const [form, setForm] = useState({
    animalId: '', batchId: '', type: 'milk', quantity: '', unit: 'L',
    date: new Date().toISOString().split('T')[0], session: 'single', notes: '',
  });

  const individualAnimals = animals?.filter((a) => !a.batchId) || [];

  useEffect(() => {
    if (open) {
      fetchBatches();
      fetchPrices();
      if (individualAnimals.length > 0 && !form.animalId) {
        setForm((prev) => ({ ...prev, animalId: individualAnimals[0]._id }));
      }
    }
  }, [open]);

  useEffect(() => {
    const unitMap = { milk: 'L', eggs: 'pcs', weight: 'kg' };
    setForm((prev) => ({ ...prev, unit: unitMap[form.type] }));
  }, [form.type]);

  const fetchBatches = async () => {
    try {
      const res = await getBatches();
      setBatches(res.data.data || []);
    } catch {}
  };

  const fetchPrices = async () => {
    try {
      const res = await getPrices();
      setPrices(res.data.data || []);
    } catch {}
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, quantity: Number(form.quantity) };
    if (useBatch) delete data.animalId;
    else delete data.batchId;
    onSubmit(data);
  };

  const unitPrice = prices.find((p) => {
    const name = (p.name || '').toLowerCase();
    const priceUnit = (p.unit || '').toLowerCase();
    const formUnit = (form.unit || '').toLowerCase();
    if (form.type === 'milk') return name.includes('milk');
    if (form.type === 'eggs') return name.includes('egg') && priceUnit === formUnit;
    return false;
  });

  const estimatedValue = (unitPrice?.price || 0) * (Number(form.quantity) || 0);

  return (
    <Modal open={open} onClose={onClose} title="Record Production" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex mb-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button type="button" onClick={() => setUseBatch(false)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${!useBatch ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Single Animal</button>
          <button type="button" onClick={() => setUseBatch(true)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${useBatch ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Batch / Group</button>
        </div>

        {useBatch ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Batch *</label>
            <select name="batchId" value={form.batchId} onChange={handleChange} className="input-field" required>
              <option value="">Select batch</option>
              {batches.map((b) => (
                <option key={b._id} value={b._id}>{b._id?.split('-').slice(0, -2).join('-')} — {b.breed} ({b.count} animals)</option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Animal *</label>
            <select name="animalId" value={form.animalId} onChange={handleChange} className="input-field" required>
              <option value="">Select animal</option>
              {individualAnimals.map((a) => (
                <option key={a._id} value={a._id}>{a.tag} — {a.breed}</option>
              ))}
            </select>
            {individualAnimals.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">No individual animals. All animals are in batches — use Batch mode.</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
            <select name="type" value={form.type} onChange={handleChange} className="input-field">
              {types.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
            </select>
          </div>
          <Input label={`Quantity (${form.unit}) *`} name="quantity" type="number" step="0.1" value={form.quantity} onChange={handleChange} required />
        </div>

        {unitPrice && form.quantity && (
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700 dark:text-green-300">
                {unitPrice.name}: KES {unitPrice.price}/{unitPrice.unit}
              </span>
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                Estimated: {formatCurrency(estimatedValue)}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Session</label>
            <select name="session" value={form.session} onChange={handleChange} className="input-field">
              {sessions.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
            </select>
          </div>
        </div>

        <Input label="Notes" name="notes" value={form.notes} onChange={handleChange} />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Save Record</Button>
        </div>
      </form>
    </Modal>
  );
}