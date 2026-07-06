import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { getHealthRecords, addHealthRecord, updateHealthRecord, deleteHealthRecord } from '../api/healthApi';
import { getAnimals, getBatches } from '../api/animalApi';
import { HEALTH_TYPES } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import { Plus, Stethoscope, Syringe, Heart, Activity, Pencil, Trash2 } from 'lucide-react';

const typeIcons = {
  diagnosis: Stethoscope, treatment: Syringe, vet_visit: Heart,
  deworming: Activity, hoof_trimming: Activity, injury: Heart,
  surgery: Stethoscope, other: Activity,
};

const severityBadge = { mild: 'info', moderate: 'warning', severe: 'warning', critical: 'danger' };

export default function HealthPage() {
  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('single');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [form, setForm] = useState({
    type: 'diagnosis', diagnosis: '', symptoms: '', treatment: '', vetName: '',
    vetContact: '', cost: '', severity: 'moderate', date: new Date().toISOString().split('T')[0], notes: '',
  });

  useEffect(() => { fetchAnimals(); }, []);
  useEffect(() => {
    if (viewMode === 'single' && selectedAnimal) fetchRecords();
    if (viewMode === 'batch' && selectedBatch) fetchBatchRecords();
  }, [selectedAnimal, selectedBatch, viewMode]);

  const fetchAnimals = async () => {
    try {
      const [animalRes, batchRes] = await Promise.all([getAnimals({ limit: 200 }), getBatches()]);
      setAnimals(animalRes.data.data || []);
      setBatches(batchRes.data.data || []);
      if (animalRes.data.data?.length > 0) setSelectedAnimal(animalRes.data.data[0]._id);
    } catch { setLoading(false); }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await getHealthRecords({ animalId: selectedAnimal });
      setRecords(res.data.data || []);
    } catch {} finally { setLoading(false); }
  };

  const fetchBatchRecords = async () => {
    setLoading(true);
    try {
      const res = await getHealthRecords({ batchId: selectedBatch });
      setRecords(res.data.data || []);
    } catch {} finally { setLoading(false); }
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    setForm({
      type: record.type || 'diagnosis',
      diagnosis: record.diagnosis || '',
      symptoms: record.symptoms?.join(', ') || '',
      treatment: record.treatment || '',
      vetName: record.vetName || '',
      vetContact: record.vetContact || '',
      cost: record.cost ? String(record.cost) : '',
      severity: record.severity || 'moderate',
      date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
      notes: record.notes || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        ...form,
        symptoms: form.symptoms ? form.symptoms.split(',').map((s) => s.trim()) : [],
        cost: form.cost ? Number(form.cost) : undefined,
      };
      if (editingRecord) {
        await updateHealthRecord(editingRecord._id, data);
      } else {
        const payload = viewMode === 'batch' ? { ...data, batchId: selectedBatch } : { ...data, animalId: selectedAnimal };
        await addHealthRecord(payload);
      }
      setShowForm(false);
      setEditingRecord(null);
      setForm({ type: 'diagnosis', diagnosis: '', symptoms: '', treatment: '', vetName: '', vetContact: '', cost: '', severity: 'moderate', date: new Date().toISOString().split('T')[0], notes: '' });
      viewMode === 'batch' ? fetchBatchRecords() : fetchRecords();
    } catch {} finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!showDelete) return;
    setSubmitting(true);
    try {
      await deleteHealthRecord(showDelete._id);
      setShowDelete(null);
      viewMode === 'batch' ? fetchBatchRecords() : fetchRecords();
    } catch {} finally { setSubmitting(false); }
  };

  return (
    <div>
      <PageHeader
        title="Health Records"
        description="Track animal health, treatments, and vet visits"
        action={
          <Button onClick={() => { setEditingRecord(null); setForm({ type: 'diagnosis', diagnosis: '', symptoms: '', treatment: '', vetName: '', vetContact: '', cost: '', severity: 'moderate', date: new Date().toISOString().split('T')[0], notes: '' }); setShowForm(true); }}>
            <Plus className="h-4 w-4" /> Add Record
          </Button>
        }
      />

      <div className="flex gap-2 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-64">
        <button onClick={() => setViewMode('single')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'single' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Individual</button>
        <button onClick={() => setViewMode('batch')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'batch' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Batch</button>
      </div>

      {viewMode === 'single' ? (
        <div className="mb-6">
          <select value={selectedAnimal} onChange={(e) => setSelectedAnimal(e.target.value)} className="input-field max-w-xs">
            {animals.map((a) => (<option key={a._id} value={a._id}>{a.tag} — {a.breed}</option>))}
          </select>
        </div>
      ) : (
        <div className="mb-6">
          <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="input-field max-w-xs">
            <option value="">Select batch</option>
            {batches.map((b) => (<option key={b._id} value={b._id}>{b._id?.split('-').slice(0, -2).join('-')} — {b.breed} ({b.count})</option>))}
          </select>
        </div>
      )}

      <div className="space-y-3">
        {records.map((record) => {
          const Icon = typeIcons[record.type] || Activity;
          return (
            <div key={record._id} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow">
              <div className={`p-2 rounded-lg ${record.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
                <Icon className={`h-5 w-5 ${record.severity === 'critical' ? 'text-red-500' : 'text-gray-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{record.type?.replace('_', ' ')}</span>
                  {record.severity && <Badge variant={severityBadge[record.severity]}>{record.severity}</Badge>}
                </div>
                {record.diagnosis && <p className="text-sm text-gray-600 dark:text-gray-300">{record.diagnosis}</p>}
                {record.treatment && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{record.treatment}</p>}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>{formatDate(record.date)}</span>
                  {record.vetName && <span>Vet: {record.vetName}</span>}
                  {record.cost && <span>KES {record.cost}</span>}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(record)}><Pencil className="h-4 w-4 text-gray-400" /></Button>
                <Button variant="ghost" size="sm" onClick={() => setShowDelete(record)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            </div>
          );
        })}
        {!loading && records.length === 0 && <p className="text-center py-12 text-gray-400">No health records yet</p>}
      </div>

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditingRecord(null); }} title={editingRecord ? 'Edit Health Record' : 'Add Health Record'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
              <select name="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                {HEALTH_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Severity</label>
              <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className="input-field">
                <option value="mild">Mild</option><option value="moderate">Moderate</option><option value="severe">Severe</option><option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <Input label="Diagnosis" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
          <Input label="Symptoms (comma separated)" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} />
          <Input label="Treatment" value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Vet Name" value={form.vetName} onChange={(e) => setForm({ ...form, vetName: e.target.value })} />
            <Input label="Vet Contact" value={form.vetContact} onChange={(e) => setForm({ ...form, vetContact: e.target.value })} />
            <Input label="Cost (KES)" type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
          </div>
          <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => { setShowForm(false); setEditingRecord(null); }}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editingRecord ? 'Update' : 'Save'} Record</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!showDelete}
        onClose={() => setShowDelete(null)}
        onConfirm={handleDelete}
        title="Delete Health Record"
        message="Permanently delete this health record?"
        confirmLabel="Delete"
        loading={submitting}
      />
    </div>
  );
}