import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import type { DiligenceReport, FounderSubmissionInput, Startup, StartupStatus } from '@/types';
import type { Database } from '@/types/database';

import {
  buildStartupFromSubmission,
  generateDiligenceWithDelay,
} from '../generateDiligence';
import { mapDiligenceToRow, mapStartupToRow } from './mappers';

export type SubmitPhaseMessage =
  | 'Saving your startup...'
  | 'Generating AI diligence...'
  | 'Saving diligence report...'
  | 'Finalizing analysis...';

export type SupabaseSubmitResult =
  | { ok: true; startup: Startup; diligence: DiligenceReport }
  | { ok: false; error: string };

function startupRow(
  startup: Startup,
  status: StartupStatus
): Database['public']['Tables']['startups']['Insert'] {
  return {
    ...mapStartupToRow({ ...startup, status }),
    status,
  };
}

export async function submitFounderStartupToSupabase(
  input: FounderSubmissionInput,
  onPhase?: (message: SubmitPhaseMessage) => void
): Promise<SupabaseSubmitResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase is not configured' };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, error: 'Supabase client unavailable' };
  }

  const startup = buildStartupFromSubmission(input);
  const pendingStartup: Startup = { ...startup, status: 'pending' };

  onPhase?.('Saving your startup...');

  const { error: insertStartupError } = await supabase
    .from('startups')
    .insert(startupRow(pendingStartup, 'pending'));

  if (insertStartupError) {
    return { ok: false, error: insertStartupError.message };
  }

  onPhase?.('Generating AI diligence...');

  let diligence: DiligenceReport;
  try {
    diligence = await generateDiligenceWithDelay(input, startup);
  } catch {
    await supabase.from('startups').delete().eq('id', startup.id);
    return { ok: false, error: 'Failed to generate diligence report' };
  }

  onPhase?.('Saving diligence report...');

  const diligencePayload: Database['public']['Tables']['diligence_reports']['Insert'] =
    mapDiligenceToRow(diligence);

  const { error: insertDiligenceError } = await supabase
    .from('diligence_reports')
    .insert(diligencePayload);

  if (insertDiligenceError) {
    await supabase.from('startups').delete().eq('id', startup.id);
    return { ok: false, error: insertDiligenceError.message };
  }

  onPhase?.('Finalizing analysis...');

  const { error: updateStatusError } = await supabase
    .from('startups')
    .update({ status: 'analyzed', ai_score: diligence.aiScore })
    .eq('id', startup.id);

  if (updateStatusError) {
    return { ok: false, error: updateStatusError.message };
  }

  const analyzedStartup: Startup = { ...startup, status: 'analyzed', aiScore: diligence.aiScore };

  return { ok: true, startup: analyzedStartup, diligence };
}
