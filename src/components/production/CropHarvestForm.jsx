import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function CropHarvestForm({ open, onClose, onSubmit, loading, crops }) {
  const [form, setForm] = useState({
    cropId: '',
    yieldQuantity: '',
    yieldUnit: 'kg',
    actualHarvestDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal open={open} onClose={onClose} title="Record Harvest" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Crop *</label>
          <select name="cropId" value={form.cropId} onChange={handleChange} className="input-field" required>
            <option value="">Select crop</option>
            {crops?.map((c) => (
              <option key={c._id} value={c._id}>{c.cropType} {c.variety ? `— ${c.variety}` : ''} — {c.status}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Yield Quantity *" name="yieldQuantity" type="number" value={form.yieldQuantity} onChange={handleChange} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
            <select name="yieldUnit" value={form.yieldUnit} onChange={handleChange} className="input-field">
              <option value="kg">kg</option>
              <option value="bags">Bags</option>
              <option value="tons">Tons</option>
              <option value="pcs">Pieces</option>
            </select>
          </div>
        </div>
        <Input label="Harvest Date" name="actualHarvestDate" type="date" value={form.actualHarvestDate} onChange={handleChange} />
        <Input label="Notes" name="notes" value={form.notes} onChange={handleChange} />
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Save Harvest</Button>
        </div>
      </form>
    </Modal>
  );
}