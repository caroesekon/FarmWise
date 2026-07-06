import { useState, useEffect } from 'react';
import { getFarm } from '../api/farmApi';

export function useFarm() {
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFarm = async () => {
    try {
      setLoading(true);
      const res = await getFarm();
      setFarm(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch farm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarm();
  }, []);

  return { farm, loading, error, refetch: fetchFarm };
}