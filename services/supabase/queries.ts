import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import type {
  DiligenceReport,
  InvestmentDecision,
  LeaderboardData,
  Profile,
  Startup,
  StartupForecastSubmission,
} from '@/types';
import type { Database } from '@/types/database';

import {
  mapDiligenceRow,
  mapDiligenceToRow,
  groupForecastRows,
  mapInvestmentDecisionRow,
  mapLeaderboardRows,
  mapProfileRow,
  mapStartupRow,
  mapStartupToRow,
} from './mappers';

function logSupabaseWarning(scope: string, message: string) {
  if (__DEV__) {
    console.warn(`[Supabase:${scope}] ${message} — using mock/local data`);
  }
}

export async function fetchStartupsFromSupabase(): Promise<Startup[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('startups')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    logSupabaseWarning('startups', error.message);
    return null;
  }

  if (!data?.length) return null;
  return data.map(mapStartupRow);
}

export async function fetchStartupByIdFromSupabase(
  id: string
): Promise<Startup | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.from('startups').select('*').eq('id', id).maybeSingle();

  if (error) {
    logSupabaseWarning('startup', error.message);
    return null;
  }

  return data ? mapStartupRow(data) : null;
}

export async function fetchDiligenceByStartupIdFromSupabase(
  startupId: string
): Promise<DiligenceReport | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('diligence_reports')
    .select('*')
    .eq('startup_id', startupId)
    .maybeSingle();

  if (error) {
    logSupabaseWarning('diligence', error.message);
    return null;
  }

  return data ? mapDiligenceRow(data) : null;
}

export async function fetchProfileFromSupabase(
  profileId = 'current'
): Promise<Profile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .maybeSingle();

  if (error) {
    logSupabaseWarning('profile', error.message);
    return null;
  }

  return data ? mapProfileRow(data) : null;
}

export async function fetchLeaderboardFromSupabase(): Promise<LeaderboardData | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('leaderboard_entries')
    .select('*')
    .order('rank', { ascending: true });

  if (error) {
    logSupabaseWarning('leaderboard', error.message);
    return null;
  }

  if (!data?.length) return null;
  return mapLeaderboardRows(data);
}

export async function upsertStartupAndDiligence(
  startup: Startup,
  diligence: DiligenceReport
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabase();
  if (!supabase) return;

  const startupPayload: Database['public']['Tables']['startups']['Insert'] =
    mapStartupToRow(startup);

  const { error: startupError } = await supabase
    .from('startups')
    .upsert(startupPayload, { onConflict: 'id' });

  if (startupError) {
    logSupabaseWarning('upsert-startup', startupError.message);
    return;
  }

  const diligencePayload: Database['public']['Tables']['diligence_reports']['Insert'] =
    mapDiligenceToRow(diligence);

  const { error: diligenceError } = await supabase
    .from('diligence_reports')
    .upsert(diligencePayload, { onConflict: 'id' });

  if (diligenceError) {
    logSupabaseWarning('upsert-diligence', diligenceError.message);
  }
}

export async function fetchForecastsForUser(
  userId: string
): Promise<StartupForecastSubmission[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('forecasts')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    logSupabaseWarning('forecasts', error.message);
    return null;
  }

  if (!data?.length) return null;
  return groupForecastRows(data);
}

export async function fetchDecisionsForUser(
  userId: string
): Promise<InvestmentDecision[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('investment_decisions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    logSupabaseWarning('decisions', error.message);
    return null;
  }

  if (!data?.length) return null;
  return data.map(mapInvestmentDecisionRow);
}
