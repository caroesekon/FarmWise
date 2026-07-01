import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import HealthRecordList from '../components/health/HealthRecordList';
import HealthRecordForm from '../components/health/HealthRecordForm';
import { getHealthRecords, addHealthRecord } from '../api/healthApi';
import { getAnimals, getBatches } from '../api/animalApi';
import { Plus } from 'lucide-react';

export default function HealthPage() {
  const [records, setRecords] = useState([]);
  const [batchSummary, setBatchSummary] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('single');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');

  useEffect(() => { fetchAnimals(); }, []);
  useEffect(() => {
    if (viewMode === 'single' && selectedAnimal) fetchRecords();
    if (viewMode === 'batch' && selectedBatch) fetchBatchRecords();
    if (viewMode === 'single' && !selectedAnimal) { setRecords([]); setLoading(false); }
    if (viewMode === 'batch' && !selectedBatch) { setRecords([]); setBatchSummary([]); setLoading(false); }
  }, [selectedAnimal, selectedBatch, viewMode]);

  const fetchAnimals = async () => {
    try {
      const [animalRes, batchRes] = await Promise.all([
        getAnimals({ limit: 200 }),
        getBatches(),
      ]);
      setAnimals(animalRes.data.data);
      setBatches(batchRes.data.data);
      if (animalRes.data.data.length > 0) setSelectedAnimal(animalRes.data.data[0]._id);
    } catch { setLoading(false); }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await getHealthRecords({ animalId: selectedAnimal });
      setRecords(res.data.data);
      setBatchSummary(res.data.batchSummary || []);
    } catch {} finally { setLoading(false); }
  };

  const fetchBatchRecords = async () => {
    setLoading(true);
    try {
      const res = await getHealthRecords({ batchId: selectedBatch });
      setRecords(res.data.data);
      setBatchSummary(res.data.batchSummary || []);
    } catch {} finally { setLoading(false); }
  };

  const handleAdd = async (data) => {
    setSubmitting(true);
    try {
      const payload = viewMode === 'batch'
        ? { ...data, batchId: selectedBatch }
        : { ...data, animalId: selectedAnimal };
      await addHealthRecord(payload);
      setShowForm(false);
      viewMode === 'batch' ? fetchBatchRecords() : fetchRecords();
    } catch {} finally { setSubmitting(false); }
  };

  return (
    <div>
      <PageHeader
        title="Health Records"
        description="Track animal health, treatments, and vet visits"
        action={<Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />Add Record</Button>}
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
            {batches.map((b) => (<option key={b._id} value={b._id}>{b._id.split('-').slice(0, -2).join('-')} — {b.breed} ({b.count})</option>))}
          </select>
        </div>
      )}

      <HealthRecordList records={records} batchSummary={batchSummary} viewMode={viewMode} />

      <HealthRecordForm open={showForm} onClose={() => setShowForm(false)} onSubmit={handleAdd} loading={submitting} animals={animals} />
    </div>
  );
}