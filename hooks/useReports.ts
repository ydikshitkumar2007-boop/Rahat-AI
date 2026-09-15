'use client';

import { useState, useEffect } from 'react';
import { fetchReports } from '@/services/reports';
import { CitizenReport } from '@/types';

export function useReports() {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchReports();
      setReports(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const refreshReports = async () => {
    const data = await fetchReports();
    setReports(data);
  };

  return { reports, loading, refreshReports };
}
