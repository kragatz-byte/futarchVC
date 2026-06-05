import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Startup } from '@/types';

import { computeAggregateStats } from '../startupAggregates';
import { patchStartupInRegistry } from '../startupRegistry';

export async function refreshStartupAggregatesInSupabase(
  startupId: string
): Promise<Startup | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: decisions, error: decisionsError } = await supabase
    .from('investment_decisions')
    .select('decision, conviction')
    .eq('startup_id', startupId);

  if (decisionsError) return null;

  const { data: forecasts, error: forecastsError } = await supabase
    .from('forecasts')
    .select('probability')
    .eq('startup_id', startupId);

  if (forecastsError) return null;

  const stats = computeAggregateStats({
    decisions: (decisions ?? []).map((row) => ({
      decision: row.decision,
      conviction: row.conviction,
    })),
    forecastProbabilities: (forecasts ?? []).map((row) => row.probability),
  });

  const { data: updatedStartup, error: updateError } = await supabase
    .from('startups')
    .update({
      percent_invest: stats.percentInvest,
      percent_pass: stats.percentPass,
      average_conviction: stats.averageConviction,
      average_forecast: stats.averageForecast,
    })
    .eq('id', startupId)
    .select('*')
    .maybeSingle();

  if (updateError || !updatedStartup) return null;

  return patchStartupInRegistry(startupId, stats) ?? null;
}
