import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

export type SupabaseDb = any;

const supabaseOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
};

export const supabaseAdmin: SupabaseClient<SupabaseDb> = createClient<SupabaseDb>(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseOptions
);

export const supabasePublic: SupabaseClient<SupabaseDb> = createClient<SupabaseDb>(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  supabaseOptions
);
