import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import DailyBriefing from '../components/dashboard/DailyBriefing';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import AlertList from '../components/dashboard/AlertList';
import ProductionChart from '../components/dashboard/ProductionChart';
import UpcomingReminders from '../components/dashboard/UpcomingReminders';
import QuickActions from '../components/dashboard/QuickActions';
import { useAuth } from '../hooks/useAuth';
import { useAlerts } from '../hooks/useAlerts';
import { useWeather } from '../hooks/useWeather';
import { getBriefing } from '../api/briefingApi';
import { getAnimals } from '../api/animalApi';
import { getProduction } from '../api/productionApi';
import { Beef, Milk, Egg, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const { user, farm } = useAuth();
  const { alerts } = useAlerts();
  const { weather } = useWeather();
  const [briefing, setBriefing] = useState(null);
  const [animalCount, setAnimalCount] = useState(0);
  const [todayMilk, setTodayMilk] = useState(0);
  const [todayEggs, setTodayEggs] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [briefingRes, animalsRes, productionRes] = await Promise.all([
        getBriefing(),
        getAnimals({ limit: 1 }),
        getProduction({ limit: 100 }),
      ]);

      setBriefing(briefingRes.data.data);

      setAnimalCount(animalsRes.data.total || 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayRecords = productionRes.data.data.filter(
        (p) => new Date(p.date) >= today
      );

      setTodayMilk(
        todayRecords.filter((p) => p.type === 'milk').reduce((s, p) => s + p.quantity, 0)
      );
      setTodayEggs(
        todayRecords.filter((p) => p.type === 'eggs').reduce((s, p) => s + p.quantity, 0)
      );
    } catch {
      //
    }
  };

  return (
    <div>
      <PageHeader
        title={`Good ${getGreeting()}, ${user?.name?.split(' ')[0] || 'Farmer'}`}
        description={farm?.name || 'Your Farm'}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Beef} label="Animals" value={animalCount} color="primary" />
        <StatCard icon={Milk} label="Milk Today" value={`${todayMilk} L`} color="blue" />
        <StatCard icon={Egg} label="Eggs Today" value={todayEggs} color="yellow" />
        <StatCard
          icon={AlertTriangle}
          label="Active Alerts"
          value={alerts.filter((a) => a.status === 'active').length}
          color={alerts.filter((a) => a.level === 'critical').length > 0 ? 'red' : 'green'}
        />
      </div>

      <DailyBriefing briefing={briefing} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ProductionChart />
        </div>
        <div className="space-y-6">
          <WeatherWidget weather={weather} />
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Upcoming</h3>
            <UpcomingReminders reminders={briefing?.upcoming || []} />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
        <QuickActions />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Alerts</h3>
        <AlertList alerts={alerts} />
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}