import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { getFields, addField } from '../api/fieldApi';
import { Plus, MapPin, Ruler, Sprout } from 'lucide-react';

export default function FieldsPage() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', size: '', sizeUnit: 'acres', soilType: '', currentCrop: '', notes: '' });

  useEffect(() => { fetchFields(); }, []);

  const fetchFields = async () => {
    try {
      const res = await getFields();
      setFields(res.data.data);
    } catch {} finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addField({ ...form, size: form.size ? Number(form.size) : undefined });
      setShowForm(false);
      setForm({ name: '', size: '', sizeUnit: 'acres', soilType: '', currentCrop: '', notes: '' });
      fetchFields();
    } catch {} finally { setSubmitting(false); }
  };

  const statusBadge = { active: 'success', fallow: 'warning', resting: 'info', harvested: 'neutral' };

  return (
    <div>
      <PageHeader title="Fields & Crops" description="Manage your fields and paddocks" action={<Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />Add Field</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((f) => (
          <Card key={f._id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">{f.name}</h3>
              <Badge variant={statusBadge[f.status] || 'neutral'}>{f.status}</Badge>
            </div>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {f.size && <div className="flex items-center gap-2"><Ruler className="h-4 w-4" />{f.size} {f.sizeUnit}</div>}
              {f.soilType && <div className="flex items-center gap-2"><Sprout className="h-4 w-4" />{f.soilType}</div>}
              {f.currentCrop && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{f.currentCrop}</div>}
            </div>
          </Card>
        ))}
      </div>
      {!loading && fields.length === 0 && <p className="text-center py-12 text-gray-400">No fields added yet</p>}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Field">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Field Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Size" type="number" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
              <select value={form.sizeUnit} onChange={(e) => setForm({ ...form, sizeUnit: e.target.value })} className="input-field">
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
              </select>
            </div>
          </div>
          <Input label="Soil Type" value={form.soilType} onChange={(e) => setForm({ ...form, soilType: e.target.value })} />
          <Input label="Current Crop" value={form.currentCrop} onChange={(e) => setForm({ ...form, currentCrop: e.target.value })} />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Add Field</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}