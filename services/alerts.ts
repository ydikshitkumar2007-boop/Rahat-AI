import { createClient } from '@/lib/supabase/client';
import { MOCK_ALERTS } from '@/lib/constants/mockData';
import { Alert } from '@/types';

export async function fetchActiveAlerts(): Promise<Alert[]> {
  try {
    const supabase = createClient();
    const { data: alerts, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('status', 'active')
      .order('issued_at', { ascending: false });

    if (error || !alerts || alerts.length === 0) {
      return MOCK_ALERTS;
    }

    return alerts as Alert[];
  } catch {
    return MOCK_ALERTS;
  }
}
