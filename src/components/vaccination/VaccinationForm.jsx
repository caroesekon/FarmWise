import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { getVets } from '../../api/vaccinationApi';

export default function VaccinationForm({ open, onClose, onSubmit, loading, animals }) {
  const [vets, setVets] = useState([]);
  const [form, setForm] = useState({
    vaccineName: '',
    batchNumber: '',
    animalIds: [],
    vetId: '',
    dueDate: '',
    notes: '',
  });

  useEffect(() => {
    if (open) {
      fetchVets();
      setForm({
        vaccineName: '',
        batchNumber: '',
        animalIds: [],
        vetId: '',
        dueDate: '',
        notes: '',
      });
    }
  }, [open]);

  const fetchVets = async () => {
    try {
      const res = await getVets();
      setVets(res.data.data);
    } catch {}
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAnimalToggle = (animalId) => {
    setForm((prev) => ({
      ...prev,
      animalIds: prev.animalIds.includes(animalId)
        ? prev.animalIds.filter((id) => id !== animalId)
        : [...prev.animalIds, animalId],
    }));
  };

  const handleSelectAll = () => {
    if (form.animalIds.length === animals.length) {
      setForm({ ...form, animalIds: [] });
    } else {
      setForm({ ...form, animalIds: animals.map((a) => a._id) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal open={open} onClose={onClose} title="Schedule Vaccination" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Vaccine Name *" name="vaccineName" value={form.vaccineName} onChange={handleChange} placeholder="e.g. FMD, Anthrax" required />
          <Input label="Batch Number" name="batchNumber" value={form.batchNumber} onChange={handleChange} />
        </div>

        <Input label="Due Date *" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Vet</label>
          <select name="vetId" value={form.vetId} onChange={handleChange} className="input-field">
            <option value="">None</option>
            {vets.map((v) => (
              <option key={v._id} value={v._id}>{v.name} — {v.email || v.phone}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Animals ({form.animalIds.length} selected)
          </label>
          <button type="button" onClick={handleSelectAll} className="text-xs text-primary-600 hover:text-primary-700 mb-2">
            {form.animalIds.length === animals.length ? 'Deselect All' : 'Select All'}
          </button>
          <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-800">
            {animals.map((animal) => (
              <label key={animal._id} className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <input
                  type="checkbox"
                  checked={form.animalIds.includes(animal._id)}
                  onChange={() => handleAnimalToggle(animal._id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-900 dark:text-white">{animal.tag}</span>
                <span className="text-xs text-gray-400">{animal.breed} · {animal.category}</span>
              </label>
            ))}
          </div>
        </div>

        <Input label="Notes" name="notes" value={form.notes} onChange={handleChange} />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading} disabled={!form.animalIds.length}>Schedule</Button>
        </div>
      </form>
    </Modal>
  );
}