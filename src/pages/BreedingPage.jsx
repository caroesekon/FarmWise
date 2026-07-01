import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import BreedingTimeline from '../components/breeding/BreedingTimeline';
import BreedingForm from '../components/breeding/BreedingForm';
import { getBreedingRecords, addBreedingEvent } from '../api/breedingApi';
import { getAnimals } from '../api/animalApi';
import { Plus } from 'lucide-react';

export default function BreedingPage() {
  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [breedRes, animalRes] = await Promise.all([
        getBreedingRecords({ limit: 50 }),
        getAnimals({ limit: 200 }),
      ]);
      setRecords(breedRes.data.data);
      setAnimals(animalRes.data.data);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data) => {
    setSubmitting(true);
    try {
      await addBreedingEvent(data);
      setShowForm(false);
      fetchData();
    } catch {
      //
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Breeding"
        description="Track heat cycles, insemination, and calving"
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        }
      />

      <BreedingTimeline records={records} />

      <BreedingForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAdd}
        loading={submitting}
        animals={animals}
      />
    </div>
  );
}