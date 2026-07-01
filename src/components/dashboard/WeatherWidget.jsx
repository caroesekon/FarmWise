import Card from '../ui/Card';
import { Cloud, CloudRain, Sun, Snowflake, Wind } from 'lucide-react';

const icons = {
  clear: Sun,
  clouds: Cloud,
  rain: CloudRain,
  snow: Snowflake,
  mist: Wind,
};

export default function WeatherWidget({ weather, loading }) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </Card>
    );
  }

  if (!weather) return null;

  const Icon = icons[weather.icon] || Cloud;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Weather Today</p>
          <div className="flex items-center gap-2 mt-1">
            <Icon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {weather.high ? `${weather.high}°C` : '—'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{weather.summary}</p>
            </div>
          </div>
        </div>
        <div className="text-right text-xs text-gray-500 dark:text-gray-400 space-y-1">
          {weather.humidity && <p>Humidity: {weather.humidity}%</p>}
          {weather.windSpeed && <p>Wind: {weather.windSpeed} m/s</p>}
        </div>
      </div>
    </Card>
  );
}