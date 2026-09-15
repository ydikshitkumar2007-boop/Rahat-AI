'use client';

import { useState, useEffect } from 'react';
import { fetchStations } from '@/services/stations';
import { StationWithMetrics } from '@/types';

export function useStations() {
  const [stations, setStations] = useState<StationWithMetrics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchStations();
        setStations(data);
      } catch (err) {
        setError('Failed to fetch station metrics');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return { stations, loading, error, refresh: fetchStations };
}
