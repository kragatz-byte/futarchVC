import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import type { ForecastAnswer, ForecastQuestionId, StartupForecastSubmission } from '@/types';
import type { Database } from '@/types/database';

import { groupForecastRows, mapForecastRowsToSubmission } from './mappers';
import { refreshStartupAggregatesInSupabase } from './startupAggregates';

export type SaveForecastsResult =
  | { ok: true; submission: StartupForecastSubmission }
  | { ok: false; error: string };

function forecastRowId(userId: string, startupId: string, question: ForecastQuestionId) {
  return `forecast-${userId}-${startupId}-${question}`;
}

function mapAnswerToRow(
  submission: StartupForecastSubmission,
  answer: ForecastAnswer
): Database['public']['Tables']['forecasts']['Insert'] {
  const timestamp = submission.updatedAt;

  return {
    id: forecastRowId(submission.userId, submission.startupId, answer.questionId),
    startup_id: submission.startupId,
    user_id: submission.userId,
    question: answer.questionId,
    probability: answer.probability,
    reasoning: answer.reasoning?.trim() || null,
    resolved: false,
    created_at: submission.createdAt,
    updated_at: timestamp,
  };
}

export async function saveForecastsToSupabase(
  submission: StartupForecastSubmission
): Promise<SaveForecastsResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase is not configured' };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, error: 'Supabase client unavailable' };
  }

  const rows = submission.answers.map((answer) => mapAnswerToRow(submission, answer));

  const { error } = await supabase
    .from('forecasts')
    .upsert(rows, { onConflict: 'user_id,startup_id,question' });

  if (error) {
    return { ok: false, error: error.message };
  }

  await refreshStartupAggregatesInSupabase(submission.startupId);

  return { ok: true, submission };
}

export async function fetchForecastSubmissionsForUser(
  userId: string
): Promise<StartupForecastSubmission[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('forecasts')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error || !data?.length) return null;

  return groupForecastRows(data);
}

export async function fetchForecastSubmissionForUserStartup(
  userId: string,
  startupId: string
): Promise<StartupForecastSubmission | undefined> {
  const supabase = getSupabase();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from('forecasts')
    .select('*')
    .eq('user_id', userId)
    .eq('startup_id', startupId);

  if (error || !data?.length) return undefined;

  return mapForecastRowsToSubmission(data) ?? undefined;
}
