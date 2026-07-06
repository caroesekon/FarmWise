import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { getFields, addField, deleteField } from '../api/fieldApi';
import { getCrops, addCrop, deleteCrop } from '../api/cropApi';
import { Plus, MapPin, Ruler, Sprout, Wheat, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function FieldsPage() {
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('fields');
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [showCropForm, setShowCropForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldForm, setFieldForm] = useState({ name: '', size: '', sizeUnit: 'acres', soilType: '', currentCrop: '', notes: '' });
  const [cropForm, setCropForm] = useState({ fieldId: '', cropType: '', variety: '', plantingDate: '', expectedHarvestDate: '', notes: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fieldRes, cropRes] = await Promise.all([getFields(), getCrops()]);
      setFields(fieldRes.data.data || []);
      setCrops(cropRes.data.data || []);
      if (fieldRes.data.data?.length > 0) {
        setCropForm((f) => ({ ...f, fieldId: fieldRes.data.data[0]._id }));
      }
    } catch {} finally { setLoading(false); }
  };

  const handleAddField = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addField({ ...fieldForm, size: fieldForm.size ? Number(fieldForm.size) : undefined });
      setShowFieldForm(false);
      setFieldForm({ name: '', size: '', sizeUnit: 'acres', soilType: '', currentCrop: '', notes: '' });
      fetchData();
    } catch {} finally { setSubmitting(false); }
  };

  const handleAddCrop = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addCrop(cropForm);
      setShowCropForm(false);
      setCropForm({ fieldId: fields[0]?._id || '', cropType: '', variety: '', plantingDate: '', expectedHarvestDate: '', notes: '' });
      fetchData();
    } catch {} finally { setSubmitting(false); }
  };

  const handleDeleteField = async (id) => {
    if (!confirm('Delete this field and all its crops?')) return;
    await deleteField(id);
    fetchData();
  };

  const handleDeleteCrop = async (id) => {
    if (!confirm('Delete this crop?')) return;
    await deleteCrop(id);
    fetchData();
  };

  const statusBadge = { active: 'success', fallow: 'warning', resting: 'info', harvested: 'neutral', growing: 'info' };

  return (
    <div>
      <PageHeader
        title="Fields & Crops"
        description="Manage your land and plantings"
        action={
          <Button onClick={() => activeTab === 'fields' ? setShowFieldForm(true) : setShowCropForm(true)}>
            <Plus className="h-4 w-4" />
            {activeTab === 'fields' ? 'Add Field' : 'Add Crop'}
          </Button>
        }
      />

      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-48">
        <button onClick={() => setActiveTab('fields')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'fields' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Fields</button>
        <button onClick={() => setActiveTab('crops')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'crops' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Crops</button>
      </div>

      {activeTab === 'fields' ? (
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
              <div className="mt-3 flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => handleDeleteField(f._id)} className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
          {!loading && fields.length === 0 && <p className="col-span-full text-center py-12 text-gray-400">No fields added yet</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {crops.map((crop) => (
            <div key={crop._id} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                <Wheat className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">{crop.cropType}</span>
                  {crop.variety && <span className="text-sm text-gray-500">({crop.variety})</span>}
                  <Badge variant={crop.status === 'harvested' ? 'success' : crop.status === 'growing' ? 'info' : 'neutral'}>{crop.status}</Badge>
                </div>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>Planted: {formatDate(crop.plantingDate)}</span>
                  {crop.expectedHarvestDate && <span>Expected: {formatDate(crop.expectedHarvestDate)}</span>}
                  {crop.actualHarvestDate && <span>Harvested: {formatDate(crop.actualHarvestDate)}</span>}
                </div>
                {crop.yield?.quantity && (
                  <p className="text-sm text-green-600 font-medium mt-2">Yield: {crop.yield.quantity} {crop.yield.unit}</p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteCrop(crop._id)} className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {!loading && crops.length === 0 && <p className="text-center py-12 text-gray-400">No crops added yet</p>}
        </div>
      )}

      <Modal open={showFieldForm} onClose={() => setShowFieldForm(false)} title="Add Field">
        <form onSubmit={handleAddField} className="space-y-4">
          <Input label="Field Name *" value={fieldForm.name} onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Size" type="number" value={fieldForm.size} onChange={(e) => setFieldForm({ ...fieldForm, size: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
              <select value={fieldForm.sizeUnit} onChange={(e) => setFieldForm({ ...fieldForm, sizeUnit: e.target.value })} className="input-field">
                <option value="acres">Acres</option><option value="hectares">Hectares</option>
              </select>
            </div>
          </div>
          <Input label="Soil Type" value={fieldForm.soilType} onChange={(e) => setFieldForm({ ...fieldForm, soilType: e.target.value })} />
          <Input label="Current Crop" value={fieldForm.currentCrop} onChange={(e) => setFieldForm({ ...fieldForm, currentCrop: e.target.value })} />
          <Input label="Notes" value={fieldForm.notes} onChange={(e) => setFieldForm({ ...fieldForm, notes: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setShowFieldForm(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Add Field</Button>
          </div>
        </form>
      </Modal>

      <Modal open={showCropForm} onClose={() => setShowCropForm(false)} title="Add Crop">
        <form onSubmit={handleAddCrop} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Field *</label>
            <select value={cropForm.fieldId} onChange={(e) => setCropForm({ ...cropForm, fieldId: e.target.value })} className="input-field" required>
              <option value="">Select field</option>
              {fields.map((f) => (<option key={f._id} value={f._id}>{f.name}</option>))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Crop Type *" value={cropForm.cropType} onChange={(e) => setCropForm({ ...cropForm, cropType: e.target.value })} placeholder="e.g. Maize, Beans" required />
            <Input label="Variety" value={cropForm.variety} onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })} placeholder="e.g. Hybrid" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Planting Date *" type="date" value={cropForm.plantingDate} onChange={(e) => setCropForm({ ...cropForm, plantingDate: e.target.value })} required />
            <Input label="Expected Harvest" type="date" value={cropForm.expectedHarvestDate} onChange={(e) => setCropForm({ ...cropForm, expectedHarvestDate: e.target.value })} />
          </div>
          <Input label="Notes" value={cropForm.notes} onChange={(e) => setCropForm({ ...cropForm, notes: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setShowCropForm(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Add Crop</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}