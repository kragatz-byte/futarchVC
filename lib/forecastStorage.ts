import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StartupForecastSubmission } from '@/types';

const STORAGE_KEY = '@futarchyvc/forecasts';

export async function loadStoredForecasts(): Promise<StartupForecastSubmission[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as StartupForecastSubmission[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function persistForecasts(forecasts: StartupForecastSubmission[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(forecasts));
}

export function createForecastSubmissionId(): string {
  return `forecast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function upsertForecastSubmission(
  forecasts: StartupForecastSubmission[],
  submission: StartupForecastSubmission
): StartupForecastSubmission[] {
  const withoutExisting = forecasts.filter(
    (item) => !(item.startupId === submission.startupId && item.userId === submission.userId)
  );
  return [submission, ...withoutExisting];
}
