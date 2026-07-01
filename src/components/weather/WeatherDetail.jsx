import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import { Cloud, CloudRain, Sun, Snowflake, Wind, Droplets, Thermometer, Eye } from 'lucide-react';

const icons = {
  clear: Sun,
  clouds: Cloud,
  rain: CloudRain,
  snow: Snowflake,
  mist: Wind,
};

export default function WeatherDetail({ weather, loading }) {
  if (loading) return <Spinner className="py-20" />;

  if (!weather || weather.summary === 'Weather data unavailable') {
    return (
      <Card className="text-center py-12">
        <Cloud className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Weather Unavailable</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add a weather API key to see forecast data.</p>
      </Card>
    );
  }

  const Icon = icons[weather.icon] || Cloud;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Weather</p>
            <div className="flex items-center gap-4 mt-2">
              <Icon className="h-16 w-16 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {weather.high ? `${weather.high}°C` : '—'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{weather.summary}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <Thermometer className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">High / Low</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {weather.high ? `${weather.high}°` : '—'} / {weather.low ? `${weather.low}°` : '—'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Humidity</p>
              <p className="font-semibold text-gray-900 dark:text-white">{weather.humidity ? `${weather.humidity}%` : '—'}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Wind className="h-5 w-5 text-teal-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Wind</p>
              <p className="font-semibold text-gray-900 dark:text-white">{weather.windSpeed ? `${weather.windSpeed} m/s` : '—'}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <CloudRain className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rainfall</p>
              <p className="font-semibold text-gray-900 dark:text-white">{weather.rainfall ? `${weather.rainfall}mm` : '0mm'}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}