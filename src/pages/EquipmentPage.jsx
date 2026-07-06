import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { getEquipment, addEquipment, updateEquipment, logMaintenance, deleteEquipment } from '../api/equipmentApi';
import { formatDate } from '../utils/formatters';
import { Plus, Wrench, Clock, Pencil, Trash2 } from 'lucide-react';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEquip, setEditingEquip] = useState(null);
  const [showMaintenance, setShowMaintenance] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'tractor', make: '', model: '', year: '', serviceIntervalHours: '', notes: '' });
  const [maintForm, setMaintForm] = useState({ hours: '', date: '', notes: '' });

  useEffect(() => { fetchEquipment(); }, []);

  const fetchEquipment = async () => {
    try { const res = await getEquipment(); setEquipment(res.data.data || []); } catch {} finally { setLoading(false); }
  };

  const openEdit = (eq) => {
    setEditingEquip(eq);
    setForm({
      name: eq.name || '', category: eq.category || 'tractor', make: eq.make || '', model: eq.model || '',
      year: eq.year ? String(eq.year) : '', serviceIntervalHours: eq.serviceIntervalHours ? String(eq.serviceIntervalHours) : '', notes: eq.notes || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = { ...form, year: form.year ? Number(form.year) : undefined, serviceIntervalHours: form.serviceIntervalHours ? Number(form.serviceIntervalHours) : undefined };
      if (editingEquip) { await updateEquipment(editingEquip._id, data); }
      else { await addEquipment(data); }
      setShowForm(false); setEditingEquip(null);
      setForm({ name: '', category: 'tractor', make: '', model: '', year: '', serviceIntervalHours: '', notes: '' });
      fetchEquipment();
    } catch {} finally { setSubmitting(false); }
  };

  const handleMaintenance = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await logMaintenance(showMaintenance._id, { hours: maintForm.hours ? Number(maintForm.hours) : undefined, date: maintForm.date, notes: maintForm.notes });
      setShowMaintenance(null); setMaintForm({ hours: '', date: '', notes: '' }); fetchEquipment();
    } catch {} finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!showDelete) return;
    setSubmitting(true);
    try { await deleteEquipment(showDelete._id); setShowDelete(null); fetchEquipment(); } catch {} finally { setSubmitting(false); }
  };

  return (
    <div>
      <PageHeader
        title="Equipment"
        description="Machinery and tools"
        action={
          <Button onClick={() => { setEditingEquip(null); setForm({ name: '', category: 'tractor', make: '', model: '', year: '', serviceIntervalHours: '', notes: '' }); setShowForm(true); }}>
            <Plus className="h-4 w-4" /> Add Equipment
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map((eq) => (
          <div key={eq._id} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{eq.name}</h3>
                <p className="text-xs text-gray-400">{eq.make} {eq.model}</p>
              </div>
              <Badge variant={eq.status === 'active' ? 'success' : eq.status === 'in_repair' ? 'warning' : 'neutral'}>{eq.status === 'active' ? 'Active' : eq.status === 'in_repair' ? 'In Repair' : 'Retired'}</Badge>
            </div>
            <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
              {eq.usageHours !== undefined && <div className="flex items-center gap-2"><Clock className="h-4 w-4" />{eq.usageHours} hours</div>}
              {eq.nextMaintenanceDate && <div className="flex items-center gap-2"><Wrench className="h-4 w-4" />Next: {formatDate(eq.nextMaintenanceDate)}</div>}
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setShowMaintenance(eq)}>Maintenance</Button>
              <Button variant="ghost" size="sm" onClick={() => openEdit(eq)}><Pencil className="h-4 w-4 text-gray-400" /></Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDelete(eq)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </div>
          </div>
        ))}
      </div>
      {!loading && equipment.length === 0 && <p className="text-center py-12 text-gray-400">No equipment added</p>}

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditingEquip(null); }} title={editingEquip ? 'Edit Equipment' : 'Add Equipment'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                <option value="tractor">Tractor</option><option value="plough">Plough</option><option value="irrigation">Irrigation</option><option value="milking">Milking</option><option value="feeding">Feeding</option><option value="transport">Transport</option><option value="other">Other</option>
              </select>
            </div>
            <Input label="Make" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
            <Input label="Year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          </div>
          <Input label="Service Interval (hours)" type="number" value={form.serviceIntervalHours} onChange={(e) => setForm({ ...form, serviceIntervalHours: e.target.value })} />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => { setShowForm(false); setEditingEquip(null); }}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editingEquip ? 'Update' : 'Add'} Equipment</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!showMaintenance} onClose={() => setShowMaintenance(null)} title={`Log Maintenance — ${showMaintenance?.name}`}>
        <form onSubmit={handleMaintenance} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Current Hours" type="number" value={maintForm.hours} onChange={(e) => setMaintForm({ ...maintForm, hours: e.target.value })} />
            <Input label="Date" type="date" value={maintForm.date} onChange={(e) => setMaintForm({ ...maintForm, date: e.target.value })} />
          </div>
          <Input label="Notes" value={maintForm.notes} onChange={(e) => setMaintForm({ ...maintForm, notes: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setShowMaintenance(null)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Save</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!showDelete} onClose={() => setShowDelete(null)} onConfirm={handleDelete} title="Delete Equipment" message="Permanently delete this equipment?" confirmLabel="Delete" loading={submitting} />
    </div>
  );
}