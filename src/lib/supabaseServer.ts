import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Server-side secret key. This should not be exposed to the browser.
// Service role key is required to bypass RLS and perform secure payment status updates.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for server-side Supabase client.');
}

export const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});
