import PageHeader from '../components/ui/PageHeader';
import WeatherDetail from '../components/weather/WeatherDetail';
import { useWeather } from '../hooks/useWeather';

export default function WeatherPage() {
  const { weather, loading } = useWeather();

  return (
    <div>
      <PageHeader
        title="Weather"
        description="Current conditions and forecast for your farm"
      />
      <WeatherDetail weather={weather} loading={loading} />
    </div>
  );
}