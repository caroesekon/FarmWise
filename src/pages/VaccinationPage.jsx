import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import VaccinationList from '../components/vaccination/VaccinationList';
import VaccinationForm from '../components/vaccination/VaccinationForm';
import { getVaccinations, getVets, scheduleVaccination, completeVaccination } from '../api/vaccinationApi';
import { getAnimals } from '../api/animalApi';
import { Plus, UserRound } from 'lucide-react';

export default function VaccinationPage() {
  const [vaccinations, setVaccinations] = useState([]);
  const [vets, setVets] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('vaccinations');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vaxRes, vetRes, animalRes] = await Promise.all([
        getVaccinations(),
        getVets(),
        getAnimals({ limit: 200 }),
      ]);
      setVaccinations(vaxRes.data.data);
      setVets(vetRes.data.data);
      setAnimals(animalRes.data.data);
    } catch {} finally { setLoading(false); }
  };

  const handleSchedule = async (data) => {
    setSubmitting(true);
    try { await scheduleVaccination(data); setShowForm(false); fetchData(); } catch {} finally { setSubmitting(false); }
  };

  const handleComplete = async (id) => {
    try { await completeVaccination(id, {}); fetchData(); } catch {}
  };

  return (
    <div>
      <PageHeader
        title="Vaccinations"
        description="Schedule and track animal vaccinations"
        action={<Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />Schedule</Button>}
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
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>{vet.email}</p>
                <p>{vet.phone}</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Gets alerts: 7 days before, 3 days before, and day of vaccination
              </p>
            </div>
          ))}
          {vets.length === 0 && <p className="col-span-full text-center py-12 text-gray-400">No vets added. Add a team member with Vet role.</p>}
        </div>
      ) : (
        <VaccinationList vaccinations={vaccinations} />
      )}

      <VaccinationForm open={showForm} onClose={() => setShowForm(false)} onSubmit={handleSchedule} loading={submitting} animals={animals} />
    </div>
  );
}