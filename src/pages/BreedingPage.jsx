import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { getBreedingRecords, addBreedingEvent, updateBreedingEvent, deleteBreedingEvent } from '../api/breedingApi';
import { getAnimals } from '../api/animalApi';
import { formatDate } from '../utils/formatters';
import { Plus, GitBranch, Heart, Calendar, Baby, Pencil, Trash2 } from 'lucide-react';

const eventConfig = {
  heat_observed: { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/30', label: 'Heat Observed' },
  expectedHeat: { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', label: 'Expected Heat' },
  insemination: { icon: GitBranch, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30', label: 'Insemination' },
  pregnancyCheck: { icon: Heart, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30', label: 'Pregnancy Check' },
  pregnancyConfirmed: { icon: Heart, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30', label: 'Pregnant' },
  expectedCalving: { icon: Baby, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950/30', label: 'Expected Calving' },
  calving: { icon: Baby, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30', label: 'Calving' },
  abortion: { icon: Heart, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', label: 'Abortion' },
  other: { icon: Calendar, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800', label: 'Other' },
};

const eventTypes = Object.entries(eventConfig).map(([value, config]) => ({ value, label: config.label }));

function getAnimalTag(record) {
  if (record.animalId && typeof record.animalId === 'object') return record.animalId.tag || 'Unknown';
  return record.animalId || 'Unknown';
}

export default function BreedingPage() {
  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    animalId: '', eventType: 'heat_observed', eventDate: '', expectedDate: '',
    inseminationType: '', bullName: '', semenBatch: '', pregnancyStatus: '', calfCount: '', notes: '',
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [breedRes, animalRes] = await Promise.all([getBreedingRecords({ limit: 50 }), getAnimals({ limit: 200 })]);
      setRecords(breedRes.data.data || []);
      setAnimals(animalRes.data.data || []);
    } catch {} finally { setLoading(false); }
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    setForm({
      animalId: record.animalId?._id || record.animalId || '',
      eventType: record.eventType || 'heat_observed',
      eventDate: record.eventDate ? new Date(record.eventDate).toISOString().split('T')[0] : '',
      expectedDate: record.expectedDate ? new Date(record.expectedDate).toISOString().split('T')[0] : '',
      inseminationType: record.inseminationType || '',
      bullName: record.bullName || '',
      semenBatch: record.semenBatch || '',
      pregnancyStatus: record.pregnancyStatus || '',
      calfCount: record.calfCount ? String(record.calfCount) : '',
      notes: record.notes || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = { ...form, calfCount: form.calfCount ? Number(form.calfCount) : undefined };
      if (editingRecord) {
        await updateBreedingEvent(editingRecord._id, data);
      } else {
        await addBreedingEvent(data);
      }
      setShowForm(false);
      setEditingRecord(null);
      setForm({ animalId: animals[0]?._id || '', eventType: 'heat_observed', eventDate: '', expectedDate: '', inseminationType: '', bullName: '', semenBatch: '', pregnancyStatus: '', calfCount: '', notes: '' });
      fetchData();
    } catch {} finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!showDelete) return;
    setSubmitting(true);
    try { await deleteBreedingEvent(showDelete._id); setShowDelete(null); fetchData(); } catch {} finally { setSubmitting(false); }
  };

  return (
    <div>
      <PageHeader
        title="Breeding"
        description="Track heat cycles, insemination, and calving"
        action={
          <Button onClick={() => { setEditingRecord(null); setForm({ animalId: animals[0]?._id || '', eventType: 'heat_observed', eventDate: '', expectedDate: '', inseminationType: '', bullName: '', semenBatch: '', pregnancyStatus: '', calfCount: '', notes: '' }); setShowForm(true); }}>
            <Plus className="h-4 w-4" /> Add Event
          </Button>
        }
      />

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-6">
          {records.map((record) => {
            const config = eventConfig[record.eventType] || eventConfig.other;
            const Icon = config.icon;
            const animalTag = getAnimalTag(record);
            return (
              <div key={record._id} className="relative flex gap-4 pl-14">
                <div className={`absolute left-4 p-1.5 rounded-full ${config.bg} border-2 border-white dark:border-gray-900`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="flex-1 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">{config.label}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">— {animalTag}</span>
                    </div>
                    <Badge variant={record.status === 'completed' ? 'success' : record.status === 'missed' ? 'danger' : 'warning'}>{record.status}</Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400">
                    {record.eventDate && <span>Date: {formatDate(record.eventDate)}</span>}
                    {record.expectedDate && <span>Expected: {formatDate(record.expectedDate)}</span>}
                    {record.pregnancyStatus && <span>Pregnancy: {record.pregnancyStatus}</span>}
                    {record.calfCount !== undefined && <span>Calves: {record.calfCount}</span>}
                  </div>
                  <div className="flex gap-1 mt-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(record)}><Pencil className="h-4 w-4 text-gray-400" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowDelete(record)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {!loading && records.length === 0 && <p className="text-center py-12 text-gray-400">No breeding records yet</p>}

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditingRecord(null); }} title={editingRecord ? 'Edit Breeding Event' : 'Add Breeding Event'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Animal *</label>
            <select value={form.animalId} onChange={(e) => setForm({ ...form, animalId: e.target.value })} className="input-field" required>
              <option value="">Select animal</option>
              {animals.map((a) => (<option key={a._id} value={a._id}>{a.tag} — {a.breed}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Type *</label>
            <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="input-field">
              {eventTypes.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Event Date" type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
            <Input label="Expected Date" type="date" value={form.expectedDate} onChange={(e) => setForm({ ...form, expectedDate: e.target.value })} />
          </div>
          {form.eventType === 'insemination' && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select value={form.inseminationType} onChange={(e) => setForm({ ...form, inseminationType: e.target.value })} className="input-field">
                  <option value="">Select</option>
                  <option value="artificial">Artificial</option>
                  <option value="natural">Natural</option>
                </select>
              </div>
              <Input label="Bull Name" value={form.bullName} onChange={(e) => setForm({ ...form, bullName: e.target.value })} />
              <Input label="Semen Batch" value={form.semenBatch} onChange={(e) => setForm({ ...form, semenBatch: e.target.value })} />
            </div>
          )}
          <Input label="Calf Count" type="number" value={form.calfCount} onChange={(e) => setForm({ ...form, calfCount: e.target.value })} />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => { setShowForm(false); setEditingRecord(null); }}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editingRecord ? 'Update' : 'Save'} Event</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!showDelete} onClose={() => setShowDelete(null)} onConfirm={handleDelete} title="Delete Breeding Event" message="Permanently delete this event?" confirmLabel="Delete" loading={submitting} />
    </div>
  );
}