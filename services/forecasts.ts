import type { StartupForecastSubmission } from '@/types';

import { mockForecastSubmissions } from './mock/forecasts';

export async function getForecastSubmissionsByStartupId(
  startupId: string
): Promise<StartupForecastSubmission[]> {
  return mockForecastSubmissions.filter((submission) => submission.startupId === startupId);
}

export async function getForecastSubmissionsByUserId(
  userId: string
): Promise<StartupForecastSubmission[]> {
  return mockForecastSubmissions.filter((submission) => submission.userId === userId);
}

export async function getForecastSubmissions(): Promise<StartupForecastSubmission[]> {
  return mockForecastSubmissions;
}
