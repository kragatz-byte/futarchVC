import AsyncStorage from '@react-native-async-storage/async-storage';

import type { InvestmentDecision, StoredDecisions, WatchlistEntry } from '@/types';

const STORAGE_KEY = '@futarchyvc/decisions';

const emptyState: StoredDecisions = {
  decisions: [],
  watchlist: [],
};

export async function loadStoredDecisions(): Promise<StoredDecisions> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;

    const parsed = JSON.parse(raw) as StoredDecisions;
    return {
      decisions: parsed.decisions ?? [],
      watchlist: parsed.watchlist ?? [],
    };
  } catch {
    return emptyState;
  }
}

export async function persistDecisions(data: StoredDecisions): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createDecisionId(): string {
  return `decision-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createWatchlistId(): string {
  return `watchlist-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function upsertDecision(
  decisions: InvestmentDecision[],
  decision: InvestmentDecision
): InvestmentDecision[] {
  const withoutExisting = decisions.filter(
    (item) => !(item.startupId === decision.startupId && item.userId === decision.userId)
  );
  return [decision, ...withoutExisting];
}

export function upsertWatchlistEntry(
  watchlist: WatchlistEntry[],
  entry: WatchlistEntry
): WatchlistEntry[] {
  const withoutExisting = watchlist.filter(
    (item) => !(item.startupId === entry.startupId && item.userId === entry.userId)
  );
  return [entry, ...withoutExisting];
}
