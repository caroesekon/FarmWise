import { useState, useEffect } from 'react';
import { getAnimals } from '../api/animalApi';

export function useAnimals(params = {}) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const fetchAnimals = async (queryParams = params) => {
    try {
      setLoading(true);
      const res = await getAnimals(queryParams);
      setAnimals(res.data.data);
      setPagination({
        page: res.data.currentPage,
        total: res.data.total,
        totalPages: res.data.totalPages,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch animals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  return { animals, loading, error, pagination, refetch: fetchAnimals };
}