import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ProductionLog from '../components/production/ProductionLog';
import ProductionForm from '../components/production/ProductionForm';
import CropHarvestLog from '../components/production/CropHarvestLog';
import CropHarvestForm from '../components/production/CropHarvestForm';
import { getProduction, recordProduction, updateProduction, deleteProduction } from '../api/productionApi';
import { getCrops, harvestCrop } from '../api/cropApi';
import { getAnimals } from '../api/animalApi';
import { Plus, Milk, Egg, Wheat, DollarSign, Layers } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function ProductionPage() {
  const [records, setRecords] = useState([]);
  const [batchSummary, setBatchSummary] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCropForm, setShowCropForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('animal');
  const [editForm, setEditForm] = useState({ quantity: '', date: '', notes: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, animalRes, cropRes] = await Promise.all([
        getProduction({ limit: 200 }), getAnimals({ limit: 200 }), getCrops({ limit: 100 }),
      ]);
      setRecords(prodRes.data.data || []);
      setBatchSummary(prodRes.data.batchSummary || []);
      setAnimals(animalRes.data.data || []);
      setCrops(cropRes.data.data || []);
    } catch {} finally { setLoading(false); }
  };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayRecords = records.filter((r) => new Date(r.date) >= today);

  const todayMilk = todayRecords.filter((r) => r.type === 'milk').reduce((s, r) => s + r.quantity, 0);
  const todayMilkValue = todayRecords.filter((r) => r.type === 'milk').reduce((s, r) => s + (r.value || 0), 0);
  const todayMilkRecords = todayRecords.filter((r) => r.type === 'milk').length;

  const todayEggs = todayRecords.filter((r) => r.type === 'eggs').reduce((s, r) => s + r.quantity, 0);
  const todayEggsValue = todayRecords.filter((r) => r.type === 'eggs').reduce((s, r) => s + (r.value || 0), 0);
  const todayEggsRecords = todayRecords.filter((r) => r.type === 'eggs').length;

  const harvestedToday = crops.filter((c) => c.status === 'harvested' && c.actualHarvestDate && new Date(c.actualHarvestDate) >= today).length;

  const totalMilk = records.filter((r) => r.type === 'milk').reduce((s, r) => s + r.quantity, 0);
  const totalMilkValue = records.filter((r) => r.type === 'milk').reduce((s, r) => s + (r.value || 0), 0);
  const totalMilkRecords = records.filter((r) => r.type === 'milk').length;

  const totalEggs = records.filter((r) => r.type === 'eggs').reduce((s, r) => s + r.quantity, 0);
  const totalEggsValue = records.filter((r) => r.type === 'eggs').reduce((s, r) => s + (r.value || 0), 0);
  const totalEggsRecords = records.filter((r) => r.type === 'eggs').length;

  const totalValue = records.reduce((s, r) => s + (r.value || 0), 0);
  const batchCount = batchSummary.length;

  const handleRecord = async (data) => {
    setSubmitting(true);
    try { await recordProduction(data); setShowForm(false); fetchData(); } catch {} finally { setSubmitting(false); }
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    setEditForm({ quantity: String(record.quantity || ''), date: record.date ? new Date(record.date).toISOString().split('T')[0] : '', notes: record.notes || '' });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try { await updateProduction(editingRecord._id, { quantity: Number(editForm.quantity), date: editForm.date, notes: editForm.notes }); setEditingRecord(null); fetchData(); } catch {} finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!showDelete) return;
    setSubmitting(true);
    try { await deleteProduction(showDelete._id); setShowDelete(null); fetchData(); } catch {} finally { setSubmitting(false); }
  };

  const handleHarvest = async (data) => {
    setSubmitting(true);
    try {
      await harvestCrop(data.cropId, { yieldQuantity: Number(data.yieldQuantity), yieldUnit: data.yieldUnit, actualHarvestDate: data.actualHarvestDate, notes: data.notes });
      setShowCropForm(false); fetchData();
    } catch {} finally { setSubmitting(false); }
  };

  return (
    <div>
      <PageHeader
        title="Production"
        description="Track animal and crop production"
        action={
          <Button onClick={() => viewMode === 'crop' ? setShowCropForm(true) : setShowForm(true)}>
            <Plus className="h-4 w-4" /> {viewMode === 'crop' ? 'Harvest' : 'Record'}
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatCard
          icon={Milk} label="Milk Today" value={`${todayMilk.toFixed(1)}L`} color="blue"
          sub={`${todayMilkRecords} record${todayMilkRecords !== 1 ? 's' : ''}`}
          subValue={todayMilkValue > 0 ? formatCurrency(todayMilkValue) : null}
        />
        <StatCard
          icon={Egg} label="Eggs Today" value={todayEggs} color="yellow"
          sub={`${todayEggsRecords} record${todayEggsRecords !== 1 ? 's' : ''}`}
          subValue={todayEggsValue > 0 ? formatCurrency(todayEggsValue) : null}
        />
        <StatCard
          icon={Wheat} label="Crops Today" value={harvestedToday} color="green"
          sub="harvested today"
        />
        <StatCard
          icon={Milk} label="Total Milk" value={`${totalMilk.toFixed(1)}L`} color="primary"
          sub={`${totalMilkRecords} total record${totalMilkRecords !== 1 ? 's' : ''}`}
          subValue={totalMilkValue > 0 ? formatCurrency(totalMilkValue) : null}
        />
        <StatCard
          icon={Egg} label="Total Eggs" value={totalEggs} color="primary"
          sub={`${totalEggsRecords} total record${totalEggsRecords !== 1 ? 's' : ''}`}
          subValue={totalEggsValue > 0 ? formatCurrency(totalEggsValue) : null}
        />
        <StatCard
          icon={DollarSign} label="Total Value" value={formatCurrency(totalValue)} color="primary"
          sub={`from ${records.length} record${records.length !== 1 ? 's' : ''}`}
        />
      </div>

      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-72">
        <button onClick={() => setViewMode('animal')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'animal' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Animal</button>
        <button onClick={() => setViewMode('batch')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'batch' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
          <Layers className="h-4 w-4 inline mr-1" />Batch{batchCount > 0 ? ` (${batchCount})` : ''}
        </button>
        <button onClick={() => setViewMode('crop')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'crop' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Crop</button>
      </div>

      {viewMode === 'animal' && (
        <ProductionLog records={records} batchSummary={batchSummary} viewMode="single" onEdit={openEdit} onDelete={setShowDelete} />
      )}
      {viewMode === 'batch' && (
        <ProductionLog records={records} batchSummary={batchSummary} viewMode="batch" />
      )}
      {viewMode === 'crop' && (
        <CropHarvestLog crops={crops} />
      )}

      <ProductionForm open={showForm} onClose={() => setShowForm(false)} onSubmit={handleRecord} loading={submitting} animals={animals} />
      <CropHarvestForm open={showCropForm} onClose={() => setShowCropForm(false)} onSubmit={handleHarvest} loading={submitting} crops={crops} />

      <Modal open={!!editingRecord} onClose={() => setEditingRecord(null)} title="Edit Production Record" size="sm">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input label="Quantity" type="number" value={editForm.quantity} onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })} required />
          <Input label="Date" type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
          <Input label="Notes" value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setEditingRecord(null)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Update</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!showDelete} onClose={() => setShowDelete(null)} onConfirm={handleDelete} title="Delete Production Record" message="Permanently delete this record?" confirmLabel="Delete" loading={submitting} />
    </div>
  );
}