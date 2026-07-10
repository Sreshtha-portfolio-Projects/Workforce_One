import { createClient } from '@supabase/supabase-js';
import config from '../config/config';

let supabaseBrowser = null;

export const getSupabaseBrowserClient = () => {
  if (supabaseBrowser) return supabaseBrowser;

  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    return null;
  }

  supabaseBrowser = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  return supabaseBrowser;
};
