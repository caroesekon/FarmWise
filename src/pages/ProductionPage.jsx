import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import ProductionLog from '../components/production/ProductionLog';
import ProductionForm from '../components/production/ProductionForm';
import { getProduction, recordProduction } from '../api/productionApi';
import { getAnimals } from '../api/animalApi';
import { Plus } from 'lucide-react';

export default function ProductionPage() {
  const [records, setRecords] = useState([]);
  const [batchSummary, setBatchSummary] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('single');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, animalRes] = await Promise.all([
        getProduction({ limit: 100 }),
        getAnimals({ limit: 200 }),
      ]);
      setRecords(prodRes.data.data);
      setBatchSummary(prodRes.data.batchSummary || []);
      setAnimals(animalRes.data.data);
    } catch {} finally { setLoading(false); }
  };

  const handleRecord = async (data) => {
    setSubmitting(true);
    try {
      await recordProduction(data);
      setShowForm(false);
      fetchData();
    } catch {} finally { setSubmitting(false); }
  };

  return (
    <div>
      <PageHeader
        title="Production"
        description="Track milk, eggs, and weight"
        action={<Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />Record</Button>}
      />

      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-64">
        <button onClick={() => setViewMode('single')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'single' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Individual</button>
        <button onClick={() => setViewMode('batch')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'batch' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Batch</button>
      </div>

      <ProductionLog records={records} batchSummary={batchSummary} viewMode={viewMode} />
      <ProductionForm open={showForm} onClose={() => setShowForm(false)} onSubmit={handleRecord} loading={submitting} animals={animals} />
    </div>
  );
}