import { useState, useEffect } from 'react';
import { getWeather } from '../api/weatherApi';

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [extremeAlerts, setExtremeAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    try {
      const res = await getWeather();
      setWeather(res.data.data.forecast);
      setExtremeAlerts(res.data.data.extremeAlerts);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return { weather, extremeAlerts, loading, refetch: fetchWeather };
}