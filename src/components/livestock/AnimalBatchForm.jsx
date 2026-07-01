import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { ANIMAL_CATEGORIES } from '../../utils/constants';
import { Layers } from 'lucide-react';

export default function AnimalBatchForm({ open, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    breed: '',
    sex: 'female',
    category: 'poultry',
    quantity: '',
    tagPrefix: '',
    birthDate: new Date().toISOString().split('T')[0],
    pen: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'category' && !prev.tagPrefix) {
        updated.tagPrefix = value.substring(0, 3).toUpperCase();
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal open={open} onClose={onClose} title="Batch Add Animals" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
          <Layers className="h-5 w-5 flex-shrink-0" />
          <span>Use this form to add multiple animals at once — ideal for poultry, herds, or flocks.</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {ANIMAL_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <Input label="Breed *" name="breed" value={form.breed} onChange={handleChange} placeholder="e.g. Kienyeji, Layers, Broilers" required />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input label="Quantity *" name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="e.g. 100" min="1" max="500" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sex</label>
            <select name="sex" value={form.sex} onChange={handleChange} className="input-field">
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <Input label="Tag Prefix" name="tagPrefix" value={form.tagPrefix} onChange={handleChange} placeholder="e.g. LAY" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Birth / Hatch Date" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} />
          <Input label="Pen / House" name="pen" value={form.pen} onChange={handleChange} placeholder="e.g. House A, Pen 3" />
        </div>

        <Input label="Notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Optional notes for this batch" />

        {form.quantity && form.tagPrefix ? (
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400">
            Tags will be: <strong className="text-gray-900 dark:text-white">{form.tagPrefix}-001</strong> to{' '}
            <strong className="text-gray-900 dark:text-white">{form.tagPrefix}-{String(form.quantity).padStart(3, '0')}</strong>
          </div>
        ) : form.quantity ? (
          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-sm text-yellow-700 dark:text-yellow-300">
            Enter a tag prefix to preview the tag range.
          </div>
        ) : null}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>
            {form.quantity ? `Add ${form.quantity} Animals` : 'Add Animals'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}