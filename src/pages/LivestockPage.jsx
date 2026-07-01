import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AnimalTable from '../components/livestock/AnimalTable';
import AnimalForm from '../components/livestock/AnimalForm';
import AnimalBatchForm from '../components/livestock/AnimalBatchForm';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { getAnimals, getBatches, createAnimal, createBatch, updateAnimal, deleteAnimal } from '../api/animalApi';
import { formatDate } from '../utils/formatters';
import { Plus, Layers, Beef, Egg, GitBranch, Users, Milk, Heart, Syringe, Pencil, Trash2 } from 'lucide-react';

const categoryTabs = [
  { key: 'all', label: 'Individual', icon: Beef },
  { key: 'batches', label: 'Batches', icon: Layers },
  { key: 'dairyCattle', label: 'Dairy', icon: Beef },
  { key: 'beefCattle', label: 'Beef', icon: Beef },
  { key: 'poultry', label: 'Poultry', icon: Egg },
  { key: 'goats', label: 'Goats', icon: GitBranch },
  { key: 'sheep', label: 'Sheep', icon: GitBranch },
  { key: 'pigs', label: 'Pigs', icon: GitBranch },
  { key: 'other', label: 'Other', icon: Beef },
];

export default function LivestockPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [animals, setAnimals] = useState([]);
  const [batches, setBatches] = useState([]);
  const [allAnimals, setAllAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showEditBatch, setShowEditBatch] = useState(false);
  const [editBatchForm, setEditBatchForm] = useState({ pen: '', notes: '' });
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { filterAnimals(); }, [activeTab, allAnimals]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [animalRes, batchRes] = await Promise.all([
        getAnimals({ limit: 500 }),
        getBatches(),
      ]);
      setAllAnimals(animalRes.data.data);
      setBatches(batchRes.data.data);
    } catch {} finally { setLoading(false); }
  };

  const filterAnimals = () => {
    if (activeTab === 'batches') { setAnimals([]); return; }
    if (activeTab === 'all') {
      setAnimals(allAnimals.filter((a) => !a.batchId));
    } else {
      setAnimals(allAnimals.filter((a) => a.category === activeTab && !a.batchId));
    }
  };

  const filteredBatches = activeTab === 'all' || activeTab === 'batches'
    ? batches
    : batches.filter((b) => b.category === activeTab);

  const batchAnimalList = selectedBatch
    ? allAnimals.filter((a) => a.batchId === selectedBatch._id)
    : [];

  const counts = {
    all: allAnimals.filter((a) => !a.batchId).length,
    batches: batches.length,
    dairyCattle: allAnimals.filter((a) => a.category === 'dairyCattle' && !a.batchId).length,
    poultry: allAnimals.filter((a) => a.category === 'poultry' && !a.batchId).length,
  };

  const handleCreate = async (data) => {
    setSubmitting(true);
    try { await createAnimal(data); setShowForm(false); fetchData(); } catch {} finally { setSubmitting(false); }
  };

  const handleBatchCreate = async (data) => {
    setSubmitting(true);
    try { await createBatch(data); setShowBatchForm(false); fetchData(); } catch {} finally { setSubmitting(false); }
  };

  const handleEditBatch = (batch) => {
    setEditBatchForm({ pen: batch.pen || '', notes: '' });
    setShowEditBatch(true);
  };

  const handleSaveEditBatch = async () => {
    setSubmitting(true);
    try {
      await Promise.all(
        batchAnimalList.map((a) =>
          updateAnimal(a._id, { pen: editBatchForm.pen, notes: editBatchForm.notes })
        )
      );
      setShowEditBatch(false);
      setSelectedBatch(null);
      fetchData();
    } catch {} finally { setSubmitting(false); }
  };

  const handleDeleteBatch = async (batch) => {
    if (!confirm(`PERMANENTLY DELETE all ${batch.count} animals and their records? This cannot be undone.`)) return;
    setSubmitting(true);
    try {
      await Promise.all(batchAnimalList.map((a) => deleteAnimal(a._id)));
      setSelectedBatch(null);
      fetchData();
    } catch {} finally { setSubmitting(false); }
  };

  return (
    <div>
      <PageHeader
        title="Livestock"
        description={`${allAnimals.length} animal${allAnimals.length !== 1 ? 's' : ''} registered`}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowBatchForm(true)}><Layers className="h-4 w-4" />Batch Add</Button>
            <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />Add Animal</Button>
          </div>
        }
      />

      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {categoryTabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === key ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            <Icon className="h-4 w-4" />
            {label}
            {counts[key] !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === key ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>{counts[key]}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'batches' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBatches.map((batch) => (
            <Card key={batch._id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedBatch(batch)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{batch.breed}</h3>
                  <p className="text-xs text-gray-400 font-mono">{batch._id.split('-').slice(0, -2).join('-')}</p>
                </div>
                <Badge variant="info">{batch.category}</Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2"><Users className="h-4 w-4" />{batch.count} animals</div>
                {batch.pen && <p>Pen: {batch.pen}</p>}
                <p className="text-xs">Created: {formatDate(batch.createdAt)}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {batch.tags?.slice(0, 5).map((tag) => (<span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{tag}</span>))}
                {batch.tags?.length > 5 && <span className="text-xs text-gray-400">+{batch.tags.length - 5} more</span>}
              </div>
            </Card>
          ))}
          {filteredBatches.length === 0 && <div className="col-span-full text-center py-12 text-gray-400">No batches yet</div>}
        </div>
      ) : (
        <AnimalTable animals={animals} loading={loading} onRowClick={(row) => navigate(`/livestock/${row._id}`)} />
      )}

      <Modal open={!!selectedBatch} onClose={() => setSelectedBatch(null)} title={`Batch: ${selectedBatch?.breed || ''}`} size="lg">
        {selectedBatch && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="info">{selectedBatch.category}</Badge>
              <span className="text-sm text-gray-500">{selectedBatch.count} animals</span>
              {selectedBatch.pen && <span className="text-sm text-gray-500">Pen: {selectedBatch.pen}</span>}
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              <Button variant="primary" size="sm" onClick={() => { setSelectedBatch(null); navigate('/production'); }}>
                <Milk className="h-4 w-4" />Record Production
              </Button>
              <Button variant="secondary" size="sm" onClick={() => { setSelectedBatch(null); navigate('/health'); }}>
                <Heart className="h-4 w-4" />Add Health Record
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setSelectedBatch(null); navigate('/vaccinations'); }}>
                <Syringe className="h-4 w-4" />Schedule Vaccine
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEditBatch(selectedBatch)}>
                <Pencil className="h-4 w-4" />Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDeleteBatch(selectedBatch)}>
                <Trash2 className="h-4 w-4" />Delete
              </Button>
            </div>

            <div className="space-y-1 max-h-96 overflow-y-auto">
              {batchAnimalList.map((a) => (
                <div
                  key={a._id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => { setSelectedBatch(null); navigate(`/livestock/${a._id}`); }}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{a.tag}</p>
                    <p className="text-xs text-gray-400">{a.breed} · {a.sex}</p>
                  </div>
                  <Badge variant={a.status === 'active' ? 'success' : 'neutral'}>{a.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showEditBatch} onClose={() => setShowEditBatch(false)} title="Edit Batch" size="sm">
        <div className="space-y-4">
          <Input label="Pen / House" value={editBatchForm.pen} onChange={(e) => setEditBatchForm({ ...editBatchForm, pen: e.target.value })} />
          <Input label="Notes" value={editBatchForm.notes} onChange={(e) => setEditBatchForm({ ...editBatchForm, notes: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setShowEditBatch(false)}>Cancel</Button>
            <Button onClick={handleSaveEditBatch} loading={submitting}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      <AnimalForm open={showForm} onClose={() => setShowForm(false)} onSubmit={handleCreate} loading={submitting} />
      <AnimalBatchForm open={showBatchForm} onClose={() => setShowBatchForm(false)} onSubmit={handleBatchCreate} loading={submitting} />
    </div>
  );
}