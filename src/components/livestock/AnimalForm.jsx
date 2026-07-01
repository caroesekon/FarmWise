import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { ANIMAL_CATEGORIES } from '../../utils/constants';

export default function AnimalForm({ open, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    tag: '',
    breed: '',
    sex: 'female',
    category: 'dairyCattle',
    birthDate: '',
    color: '',
    weight: '',
    pen: '',
    notes: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      weight: form.weight ? Number(form.weight) : undefined,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Animal" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Tag Number *" name="tag" value={form.tag} onChange={handleChange} required />
          <Input label="Breed *" name="breed" value={form.breed} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sex *</label>
            <select name="sex" value={form.sex} onChange={handleChange} className="input-field">
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {ANIMAL_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Birth Date" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} />
          <Input label="Color" name="color" value={form.color} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Weight (kg)" name="weight" type="number" value={form.weight} onChange={handleChange} />
          <Input label="Pen / Group" name="pen" value={form.pen} onChange={handleChange} />
        </div>

        <Input label="Notes" name="notes" value={form.notes} onChange={handleChange} />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Add Animal</Button>
        </div>
      </form>
    </Modal>
  );
}