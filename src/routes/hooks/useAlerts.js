import { useState, useEffect, useCallback } from 'react';
import { getAlerts } from '../api/alertApi';

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState({ critical: 0, high: 0 });
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await getAlerts({ status: 'active', limit: 50 });
      setAlerts(res.data.data);
      setSummary(res.data.summary || { critical: 0, high: 0 });
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  return { alerts, summary, loading, refetch: fetchAlerts };
}