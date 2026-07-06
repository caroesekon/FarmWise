import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { getForecast, getSeasonal } from '../../api/weatherApi';
import { Cloud, CloudRain, Sun, Snowflake, Wind, Droplets, Thermometer, Calendar } from 'lucide-react';

const icons = {
  clear: Sun, clouds: Cloud, rain: CloudRain, snow: Snowflake, mist: Wind,
};

export default function WeatherDetail({ current, loading }) {
  const [forecast, setForecast] = useState([]);
  const [seasonal, setSeasonal] = useState(null);
  const [days, setDays] = useState(7);
  const [loadingForecast, setLoadingForecast] = useState(false);

  useEffect(() => {
    fetchForecast();
    fetchSeasonal();
  }, [days]);

  const fetchForecast = async () => {
    setLoadingForecast(true);
    try {
      const res = await getForecast(days);
      setForecast(res.data.data);
    } catch {} finally {
      setLoadingForecast(false);
    }
  };

  const fetchSeasonal = async () => {
    try {
      const res = await getSeasonal();
      setSeasonal(res.data.data);
    } catch {}
  };

  if (loading) return <Spinner className="py-20" />;

  const currentWeather = current || {};

  return (
    <div className="space-y-6">
      {seasonal && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30">
          <div className="flex items-start gap-3">
            <Calendar className="h-6 w-6 text-primary-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {seasonal.season} Season — {seasonal.weeklyAdvisory}
              </h3>
              {seasonal.weekAhead && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This week: {seasonal.weekAhead.daysWithRain} rainy days, {seasonal.weekAhead.totalRainfall}mm rain, avg {seasonal.weekAhead.avgHigh}°C
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{seasonal.advisory}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Weather</p>
            <div className="flex items-center gap-4 mt-2">
              {(() => {
                const Icon = icons[currentWeather.icon] || Cloud;
                return <Icon className="h-16 w-16 text-blue-600 dark:text-blue-400" />;
              })()}
              <div>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {currentWeather.temp || currentWeather.high ? `${currentWeather.temp || currentWeather.high}°C` : '—'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{currentWeather.summary}</p>
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
              <p className="font-semibold text-gray-900 dark:text-white">{currentWeather.high || '—'}° / {currentWeather.low || '—'}°</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Humidity</p>
              <p className="font-semibold text-gray-900 dark:text-white">{currentWeather.humidity || '—'}%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Wind className="h-5 w-5 text-teal-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Wind</p>
              <p className="font-semibold text-gray-900 dark:text-white">{currentWeather.windSpeed || '—'} m/s</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <CloudRain className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rainfall</p>
              <p className="font-semibold text-gray-900 dark:text-white">{currentWeather.rainfall || '0'}mm</p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Forecast</h3>
          <div className="flex gap-2">
            {[7, 14].map((d) => (
              <Button key={d} variant={days === d ? 'primary' : 'secondary'} size="sm" onClick={() => setDays(d)}>
                {d} Days
              </Button>
            ))}
          </div>
        </div>

        {loadingForecast ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {forecast.map((day) => {
              const Icon = icons[day.icon] || Cloud;
              return (
                <Card key={day.date} className="text-center">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {new Date(day.date).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <Icon className="h-8 w-8 mx-auto my-2 text-blue-500" />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{day.high}°</p>
                  <p className="text-xs text-gray-400">{day.low}°</p>
                  <div className="flex justify-center gap-2 mt-1 text-xs text-gray-400">
                    <span>{day.rainfall}mm</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}