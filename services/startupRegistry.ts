/**
 * Single source of truth for startups/diligence: mock seeds, AsyncStorage submissions,
 * optional Supabase. Always falls back so demo mode never hard-depends on the network.
 */
import { loadSubmittedStartups, persistSubmittedStartups } from '@/lib/submissionStorage';
import { notifyStartupRefresh } from '@/lib/startupRefresh';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { DiligenceReport, FounderSubmissionInput, Startup } from '@/types';

import type { StartupAggregateStats } from './startupAggregates';

import {
  buildStartupFromSubmission,
  generateDiligenceWithDelay,
} from './generateDiligence';
import { mockDiligenceReports } from './mock/diligenceReports';
import { mockStartups } from './mock/startups';
import {
  fetchDiligenceByStartupIdFromSupabase,
  fetchStartupByIdFromSupabase,
  fetchStartupsFromSupabase,
} from './supabase/queries';
import {
  submitFounderStartupToSupabase,
  type SubmitPhaseMessage,
} from './supabase/submitStartup';

let submittedStartups: Startup[] = [];
let submittedDiligence: DiligenceReport[] = [];
let hydrated = false;
const aggregatePatches: Record<string, StartupAggregateStats> = {};

function withAggregatePatch(startup: Startup): Startup {
  const patch = aggregatePatches[startup.id];
  return patch ? { ...startup, ...patch } : startup;
}

export function patchStartupInRegistry(
  startupId: string,
  stats: StartupAggregateStats
): Startup | undefined {
  aggregatePatches[startupId] = { ...aggregatePatches[startupId], ...stats };

  let updated: Startup | undefined;

  submittedStartups = submittedStartups.map((startup) => {
    if (startup.id !== startupId) return startup;
    updated = { ...startup, ...stats };
    return updated;
  });

  if (!updated) {
    const mock = mockStartups.find((startup) => startup.id === startupId);
    if (mock) updated = { ...mock, ...stats };
  }

  notifyStartupRefresh(startupId);
  return updated;
}

async function ensureHydrated() {
  if (hydrated) return;

  const store = await loadSubmittedStartups();
  submittedStartups = store.bundles.map((bundle) => bundle.startup);
  submittedDiligence = store.bundles.map((bundle) => bundle.diligence);
  hydrated = true;
}

async function persistLocalBundle(startup: Startup, diligence: DiligenceReport) {
  submittedStartups = [startup, ...submittedStartups.filter((item) => item.id !== startup.id)];
  submittedDiligence = [
    diligence,
    ...submittedDiligence.filter((item) => item.startupId !== startup.id),
  ];

  const bundles = submittedStartups
    .map((item) => {
      const diligence = submittedDiligence.find((report) => report.startupId === item.id);
      return diligence ? { startup: item, diligence } : null;
    })
    .filter((bundle): bundle is { startup: Startup; diligence: DiligenceReport } =>
      Boolean(bundle)
    );

  await persistSubmittedStartups({ bundles });
}

export type SubmitFounderStartupOptions = {
  onPhase?: (message: SubmitPhaseMessage | 'Generating AI diligence...') => void;
};

export type SubmitFounderStartupResult = {
  startup: Startup;
  diligence: DiligenceReport;
  source: 'supabase' | 'local';
  /** Set when Supabase was configured but the cloud path failed and local fallback succeeded. */
  warning?: string;
};

async function submitFounderStartupLocally(
  input: FounderSubmissionInput,
  onPhase?: SubmitFounderStartupOptions['onPhase']
): Promise<{ startup: Startup; diligence: DiligenceReport }> {
  const startup = buildStartupFromSubmission(input);
  onPhase?.('Generating AI diligence...');
  const diligence = await generateDiligenceWithDelay(input, startup);
  const startupWithScore = { ...startup, aiScore: diligence.aiScore };
  await persistLocalBundle(startupWithScore, diligence);
  return { startup: startupWithScore, diligence };
}

export async function getAllStartups(): Promise<Startup[]> {
  await ensureHydrated();
  const remote = await fetchStartupsFromSupabase();
  const seeds = (remote ?? mockStartups).map(withAggregatePatch);
  const seedIds = new Set(seeds.map((startup) => startup.id));
  const uniqueSubmitted = submittedStartups
    .filter((startup) => !seedIds.has(startup.id))
    .map(withAggregatePatch);
  return [...uniqueSubmitted, ...seeds];
}

export async function getStartupById(id: string): Promise<Startup | undefined> {
  await ensureHydrated();
  const remote = await fetchStartupByIdFromSupabase(id);
  const startup =
    submittedStartups.find((item) => item.id === id) ??
    remote ??
    mockStartups.find((item) => item.id === id);

  return startup ? withAggregatePatch(startup) : undefined;
}

export async function getDiligenceByStartupId(
  startupId: string
): Promise<DiligenceReport | undefined> {
  await ensureHydrated();
  const remote = await fetchDiligenceByStartupIdFromSupabase(startupId);
  return (
    submittedDiligence.find((report) => report.startupId === startupId) ??
    remote ??
    mockDiligenceReports.find((report) => report.startupId === startupId)
  );
}

export async function submitFounderStartup(
  input: FounderSubmissionInput,
  options?: SubmitFounderStartupOptions
): Promise<SubmitFounderStartupResult> {
  await ensureHydrated();

  if (isSupabaseConfigured()) {
    const remote = await submitFounderStartupToSupabase(input, options?.onPhase);

    if (remote.ok) {
      await persistLocalBundle(remote.startup, remote.diligence);
      return {
        startup: remote.startup,
        diligence: remote.diligence,
        source: 'supabase',
      };
    }

    const local = await submitFounderStartupLocally(input, options?.onPhase);
    return {
      ...local,
      source: 'local',
      warning: remote.error,
    };
  }

  const local = await submitFounderStartupLocally(input, options?.onPhase);
  return { ...local, source: 'local' };
}

export function resetSubmittedStartupsForTests() {
  submittedStartups = [];
  submittedDiligence = [];
  hydrated = true;
}
