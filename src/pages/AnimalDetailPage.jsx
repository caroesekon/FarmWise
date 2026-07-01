import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnimal, updateAnimal } from '../api/animalApi';
import AnimalDetail from '../components/livestock/AnimalDetail';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { ANIMAL_CATEGORIES } from '../utils/constants';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';

export default function AnimalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchAnimal();
  }, [id]);

  const fetchAnimal = async () => {
    try {
      const res = await getAnimal(id);
      setAnimal(res.data.data);
      setForm(res.data.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await updateAnimal(id, {
        breed: form.breed,
        birthDate: form.birthDate,
        color: form.color,
        weight: form.weight?.current || form.weight,
        status: form.status,
        pen: form.pen,
        group: form.group,
        notes: form.notes,
      });
      setAnimal(res.data.data);
      setShowEdit(false);
    } catch {} finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await updateAnimal(id, { status: 'deceased' });
      navigate('/livestock');
    } catch {} finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/livestock')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{animal?.tag}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{animal?.breed}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowEdit(true)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="danger" onClick={() => setShowDelete(true)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <AnimalDetail animal={animal} />

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Animal" size="lg">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input label="Tag" value={form.tag} disabled />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Breed" name="breed" value={form.breed || ''} onChange={handleChange} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select name="category" value={form.category || ''} onChange={handleChange} className="input-field">
                {ANIMAL_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Birth Date" name="birthDate" type="date" value={form.birthDate ? form.birthDate.split('T')[0] : ''} onChange={handleChange} />
            <Input label="Color" name="color" value={form.color || ''} onChange={handleChange} />
            <Input label="Weight (kg)" name="weight" type="number" value={form.weight?.current || form.weight || ''} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pen" name="pen" value={form.pen || ''} onChange={handleChange} />
            <Input label="Group" name="group" value={form.group || ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select name="status" value={form.status || 'active'} onChange={handleChange} className="input-field">
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="deceased">Deceased</option>
              <option value="culled">Culled</option>
            </select>
          </div>
          <Input label="Notes" name="notes" value={form.notes || ''} onChange={handleChange} />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Save Changes</Button>
          </div>
        </form>
      </Modal>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Animal" size="sm">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This will mark <strong>{animal?.tag}</strong> as deceased. This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={submitting}>Mark as Deceased</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}