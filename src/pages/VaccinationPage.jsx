import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { getVaccinations, getVets, scheduleVaccination, updateVaccination, completeVaccination, deleteVaccination } from '../api/vaccinationApi';
import { getAnimals } from '../api/animalApi';
import { formatDate } from '../utils/formatters';
import { Plus, Syringe, CheckCircle, Clock, AlertTriangle, UserRound, Pencil, Trash2 } from 'lucide-react';

const statusConfig = {
  pending: { icon: Clock, variant: 'warning', label: 'Pending' },
  completed: { icon: CheckCircle, variant: 'success', label: 'Completed' },
  overdue: { icon: AlertTriangle, variant: 'danger', label: 'Overdue' },
  skipped: { icon: Clock, variant: 'neutral', label: 'Skipped' },
};

export default function VaccinationPage() {
  const [vaccinations, setVaccinations] = useState([]);
  const [vets, setVets] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vaccinations');
  const [showForm, setShowForm] = useState(false);
  const [editingVax, setEditingVax] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ vaccineName: '', batchNumber: '', animalIds: [], vetId: '', dueDate: '', notes: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vaxRes, vetRes, animalRes] = await Promise.all([getVaccinations(), getVets(), getAnimals({ limit: 200 })]);
      setVaccinations(vaxRes.data.data || []);
      setVets(vetRes.data.data || []);
      setAnimals(animalRes.data.data || []);
    } catch {} finally { setLoading(false); }
  };

  const openEdit = (vax) => {
    setEditingVax(vax);
    setForm({
      vaccineName: vax.vaccineName || '',
      batchNumber: vax.batchNumber || '',
      animalIds: vax.animalIds || [],
      vetId: vax.vetId || '',
      dueDate: vax.dueDate ? new Date(vax.dueDate).toISOString().split('T')[0] : '',
      notes: vax.notes || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingVax) {
        await updateVaccination(editingVax._id, form);
      } else {
        await scheduleVaccination(form);
      }
      setShowForm(false);
      setEditingVax(null);
      setForm({ vaccineName: '', batchNumber: '', animalIds: [], vetId: '', dueDate: '', notes: '' });
      fetchData();
    } catch {} finally { setSubmitting(false); }
  };

  const handleComplete = async (id) => {
    await completeVaccination(id, {});
    fetchData();
  };

  const handleDelete = async () => {
    if (!showDelete) return;
    setSubmitting(true);
    try {
      await deleteVaccination(showDelete._id);
      setShowDelete(null);
      fetchData();
    } catch {} finally { setSubmitting(false); }
  };

  const toggleAnimal = (id) => {
    setForm((prev) => ({
      ...prev,
      animalIds: prev.animalIds.includes(id) ? prev.animalIds.filter((a) => a !== id) : [...prev.animalIds, id],
    }));
  };

  return (
    <div>
      <PageHeader
        title="Vaccinations"
        description="Schedule and track animal vaccinations"
        action={
          <Button onClick={() => { setEditingVax(null); setForm({ vaccineName: '', batchNumber: '', animalIds: [], vetId: '', dueDate: '', notes: '' }); setShowForm(true); }}>
            <Plus className="h-4 w-4" /> Schedule
          </Button>
        }
      />

      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-56">
        <button onClick={() => setActiveTab('vaccinations')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'vaccinations' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Vaccinations</button>
        <button onClick={() => setActiveTab('vets')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'vets' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Vets</button>
      </div>

      {activeTab === 'vets' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vets.map((vet) => (
            <div key={vet._id} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <UserRound className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{vet.name}</h3>
                  <p className="text-xs text-gray-400">{vet.email || vet.phone}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">Gets alerts: 7 days, 3 days, and day of vaccination</p>
            </div>
          ))}
          {vets.length === 0 && <p className="col-span-full text-center py-12 text-gray-400">No vets added</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {vaccinations.map((vax) => {
            const config = statusConfig[vax.status] || statusConfig.pending;
            const Icon = config.icon;
            return (
              <div key={vax._id} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className={`p-2 rounded-lg ${vax.status === 'completed' ? 'bg-green-50 dark:bg-green-950/30' : vax.status === 'overdue' ? 'bg-red-50 dark:bg-red-950/30' : 'bg-blue-50 dark:bg-blue-950/30'}`}>
                  <Icon className={`h-5 w-5 ${vax.status === 'completed' ? 'text-green-500' : vax.status === 'overdue' ? 'text-red-500' : 'text-blue-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">{vax.vaccineName}</span>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{vax.animalCount} animal(s) · Due: {formatDate(vax.dueDate)}</p>
                  {vax.vetName && <p className="text-xs text-blue-600 mt-1"><UserRound className="h-3 w-3 inline" /> Vet: {vax.vetName}</p>}
                  {vax.completedDate && <p className="text-xs text-green-600 mt-1">Completed: {formatDate(vax.completedDate)}</p>}
                </div>
                <div className="flex gap-1">
                  {vax.status === 'pending' && (
                    <Button variant="outline" size="sm" onClick={() => handleComplete(vax._id)}>Complete</Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => openEdit(vax)}><Pencil className="h-4 w-4 text-gray-400" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowDelete(vax)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </div>
            );
          })}
          {!loading && vaccinations.length === 0 && <p className="text-center py-12 text-gray-400">No vaccinations scheduled</p>}
        </div>
      )}

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditingVax(null); }} title={editingVax ? 'Edit Vaccination' : 'Schedule Vaccination'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Vaccine Name *" value={form.vaccineName} onChange={(e) => setForm({ ...form, vaccineName: e.target.value })} required />
            <Input label="Batch Number" value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} />
          </div>
          <Input label="Due Date *" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Vet</label>
            <select value={form.vetId} onChange={(e) => setForm({ ...form, vetId: e.target.value })} className="input-field">
              <option value="">None</option>
              {vets.map((v) => (<option key={v._id} value={v._id}>{v.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Animals ({form.animalIds.length})</label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-800">
              {animals.map((a) => (
                <label key={a._id} className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <input type="checkbox" checked={form.animalIds.includes(a._id)} onChange={() => toggleAnimal(a._id)} className="rounded" />
                  <span className="text-sm">{a.tag} — {a.breed}</span>
                </label>
              ))}
            </div>
          </div>
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => { setShowForm(false); setEditingVax(null); }}>Cancel</Button>
            <Button type="submit" loading={submitting} disabled={!form.animalIds.length}>{editingVax ? 'Update' : 'Schedule'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!showDelete} onClose={() => setShowDelete(null)} onConfirm={handleDelete} title="Delete Vaccination" message="Permanently delete this vaccination?" confirmLabel="Delete" loading={submitting} />
    </div>
  );
}