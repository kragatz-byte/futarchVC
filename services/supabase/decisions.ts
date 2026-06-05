import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import type { InvestmentDecision } from '@/types';
import type { Database } from '@/types/database';

import { mapInvestmentDecisionToRow } from './mappers';
import { refreshStartupAggregatesInSupabase } from './startupAggregates';

export type SaveDecisionResult =
  | { ok: true; decision: InvestmentDecision }
  | { ok: false; error: string };

export async function saveInvestmentDecisionToSupabase(
  decision: InvestmentDecision
): Promise<SaveDecisionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase is not configured' };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, error: 'Supabase client unavailable' };
  }

  const payload: Database['public']['Tables']['investment_decisions']['Insert'] =
    mapInvestmentDecisionToRow(decision);

  const { error } = await supabase
    .from('investment_decisions')
    .upsert(payload, { onConflict: 'user_id,startup_id' });

  if (error) {
    return { ok: false, error: error.message };
  }

  await refreshStartupAggregatesInSupabase(decision.startupId);

  return { ok: true, decision };
}
