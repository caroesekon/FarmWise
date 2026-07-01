import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { HEALTH_TYPES } from '../../utils/constants';
import { getBatches } from '../../api/animalApi';

export default function HealthRecordForm({ open, onClose, onSubmit, loading, animals }) {
  const [useBatch, setUseBatch] = useState(false);
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState({
    type: 'diagnosis',
    diagnosis: '',
    symptoms: '',
    treatment: '',
    vetName: '',
    vetContact: '',
    cost: '',
    severity: 'moderate',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (open) {
      fetchBatches();
    }
  }, [open]);

  const fetchBatches = async () => {
    try {
      const res = await getBatches();
      setBatches(res.data.data);
    } catch {}
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      symptoms: form.symptoms ? form.symptoms.split(',').map((s) => s.trim()) : [],
      cost: form.cost ? Number(form.cost) : undefined,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Health Record" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex mb-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button type="button" onClick={() => setUseBatch(false)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${!useBatch ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Single Animal</button>
          <button type="button" onClick={() => setUseBatch(true)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${useBatch ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Batch</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
            <select name="type" value={form.type} onChange={handleChange} className="input-field">
              {HEALTH_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Severity</label>
            <select name="severity" value={form.severity} onChange={handleChange} className="input-field">
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <Input label="Diagnosis" name="diagnosis" value={form.diagnosis} onChange={handleChange} placeholder="e.g. Mastitis" />
        <Input label="Symptoms (comma separated)" name="symptoms" value={form.symptoms} onChange={handleChange} placeholder="e.g. fever, coughing" />
        <Input label="Treatment" name="treatment" value={form.treatment} onChange={handleChange} placeholder="Treatment administered" />

        <div className="grid grid-cols-3 gap-4">
          <Input label="Vet Name" name="vetName" value={form.vetName} onChange={handleChange} />
          <Input label="Vet Contact" name="vetContact" value={form.vetContact} onChange={handleChange} />
          <Input label="Cost (KES)" name="cost" type="number" value={form.cost} onChange={handleChange} />
        </div>

        <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} />
        <Input label="Notes" name="notes" value={form.notes} onChange={handleChange} />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Save Record</Button>
        </div>
      </form>
    </Modal>
  );
}