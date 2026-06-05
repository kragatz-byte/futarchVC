/**
 * Supabase client for FutarchyVC (Expo).
 *
 * Setup
 * -----
 * 1. Create a project at https://supabase.com
 * 2. Copy `.env.example` to `.env` in the project root
 * 3. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY from
 *    Project Settings → API (Project URL + anon public key)
 * 4. Restart Expo after changing env vars: `npx expo start -c`
 * 5. Create tables using the SQL in README.md
 *
 * Without these variables the app uses mock data and local AsyncStorage only.
 * Never commit real keys; use `.env` (gitignored) for local development.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database';

import { isForcedDemoMode } from './demoMode';

let client: SupabaseClient<Database> | null = null;

export function isSupabaseConfigured(): boolean {
  if (isForcedDemoMode()) {
    return false;
  }

  const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(url && key);
}

/**
 * Returns a typed Supabase client, or null when env vars are missing.
 * Safe to call from services; always check for null before querying.
 */
export function getSupabase(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!client) {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL!.trim();
    const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!.trim();

    client = createClient<Database>(url, anonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }

  return client;
}
