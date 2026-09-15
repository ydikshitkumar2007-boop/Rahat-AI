import { createClient } from '@/lib/supabase/client';
import { MOCK_REPORTS } from '@/lib/constants/mockData';
import { CitizenReport } from '@/types';

export async function fetchReports(): Promise<CitizenReport[]> {
  try {
    const supabase = createClient();
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !reports || reports.length === 0) {
      return MOCK_REPORTS;
    }

    return reports as CitizenReport[];
  } catch {
    return MOCK_REPORTS;
  }
}

export async function submitReport(
  newReport: Omit<CitizenReport, 'id' | 'created_at' | 'verification_status'>
): Promise<CitizenReport> {
  const created: CitizenReport = {
    ...newReport,
    id: `rep-custom-${Date.now()}`,
    verification_status: 'pending',
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('reports')
      .insert([created])
      .select()
      .single();

    if (!error && data) {
      return data as CitizenReport;
    }
  } catch {
    // Fall back to local mock store insertion
  }

  // Prepend to mock list for local demo persistence
  MOCK_REPORTS.unshift(created);
  return created;
}
