'use client';

import { useState, useEffect } from 'react';
import { fetchActiveAlerts } from '@/services/alerts';
import { Alert } from '@/types';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchActiveAlerts();
      setAlerts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  return { alerts, loading };
}
