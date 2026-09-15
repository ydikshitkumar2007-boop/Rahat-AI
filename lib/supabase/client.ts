import { createBrowserClient } from '@supabase/ssr';

export function sanitizeSupabaseUrl(url?: string): string {
  const defaultUrl = 'https://placeholder-url.supabase.co';
  if (!url || url.trim() === '') return defaultUrl;
  try {
    const parsed = new URL(url.trim());
    return parsed.origin;
  } catch {
    return url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/auth\/v1\/?$/, '').replace(/\/+$/, '') || defaultUrl;
  }
}

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseUrl = sanitizeSupabaseUrl(rawUrl);
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'placeholder-anon-key';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
