import { createClient } from '@/lib/supabase/client';
import { MOCK_STATIONS } from '@/lib/constants/mockData';
import { StationWithMetrics } from '@/types';

export async function fetchStations(): Promise<StationWithMetrics[]> {
  try {
    const supabase = createClient();
    const { data: stations, error } = await supabase
      .from('stations')
      .select('*')
      .order('risk_level', { ascending: false });

    if (error || !stations || stations.length === 0) {
      return MOCK_STATIONS;
    }

    return stations as StationWithMetrics[];
  } catch {
    return MOCK_STATIONS;
  }
}

export async function fetchStationById(id: string): Promise<StationWithMetrics | null> {
  const stations = await fetchStations();
  return stations.find((s) => s.id === id) || null;
}
