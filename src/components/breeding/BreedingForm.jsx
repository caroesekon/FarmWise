import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

const eventTypes = [
  { value: 'heat_observed', label: 'Heat Observed' },
  { value: 'expectedHeat', label: 'Expected Heat' },
  { value: 'insemination', label: 'Insemination' },
  { value: 'pregnancyCheck', label: 'Pregnancy Check' },
  { value: 'pregnancyConfirmed', label: 'Pregnancy Confirmed' },
  { value: 'expectedCalving', label: 'Expected Calving' },
  { value: 'calving', label: 'Calving' },
  { value: 'abortion', label: 'Abortion' },
  { value: 'other', label: 'Other' },
];

export default function BreedingForm({ open, onClose, onSubmit, loading, animals }) {
  const [form, setForm] = useState({
    animalId: '',
    eventType: 'heat_observed',
    eventDate: new Date().toISOString().split('T')[0],
    expectedDate: '',
    inseminationType: '',
    bullName: '',
    semenBatch: '',
    pregnancyStatus: '',
    calfCount: '',
    notes: '',
  });

  useEffect(() => {
    if (open && animals?.length > 0 && !form.animalId) {
      setForm((prev) => ({ ...prev, animalId: animals[0]._id }));
    }
  }, [open, animals]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      calfCount: form.calfCount ? Number(form.calfCount) : undefined,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Breeding Event" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Animal *</label>
            <select name="animalId" value={form.animalId} onChange={handleChange} className="input-field" required>
              <option value="">Select animal</option>
              {animals?.map((a) => (
                <option key={a._id} value={a._id}>{a.tag} — {a.breed}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Type *</label>
            <select name="eventType" value={form.eventType} onChange={handleChange} className="input-field">
              {eventTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Event Date" name="eventDate" type="date" value={form.eventDate} onChange={handleChange} />
          <Input label="Expected Date" name="expectedDate" type="date" value={form.expectedDate} onChange={handleChange} />
        </div>

        {(form.eventType === 'insemination') && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select name="inseminationType" value={form.inseminationType} onChange={handleChange} className="input-field">
                <option value="">Select</option>
                <option value="artificial">Artificial</option>
                <option value="natural">Natural</option>
              </select>
            </div>
            <Input label="Bull Name" name="bullName" value={form.bullName} onChange={handleChange} />
            <Input label="Semen Batch" name="semenBatch" value={form.semenBatch} onChange={handleChange} />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pregnancy Status</label>
            <select name="pregnancyStatus" value={form.pregnancyStatus} onChange={handleChange} className="input-field">
              <option value="">Unknown</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="negative">Negative</option>
            </select>
          </div>
          <Input label="Calf Count" name="calfCount" type="number" value={form.calfCount} onChange={handleChange} />
        </div>

        <Input label="Notes" name="notes" value={form.notes} onChange={handleChange} />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Save Event</Button>
        </div>
      </form>
    </Modal>
  );
}