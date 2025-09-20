import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Read env from Vite/Astro public runtime
const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL) {
  console.warn('[supabaseClient] Missing PUBLIC_SUPABASE_URL. Set it in your .env.local or environment.')
}
if (!SUPABASE_ANON_KEY) {
  console.warn('[supabaseClient] Missing PUBLIC_SUPABASE_ANON_KEY. Set it in your .env.local or environment.')
}

let client: SupabaseClient | undefined

/**
 * Returns a singleton Supabase client configured with public anon key.
 * Safe to use on client and server in Astro/React with public env vars.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    client = createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return client
}

export default getSupabaseClient()
