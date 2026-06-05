import type { DiligenceReport } from '@/types';

import { getAllStartups, getDiligenceByStartupId } from './startupRegistry';

export async function getDiligenceReportByStartupId(
  startupId: string
): Promise<DiligenceReport | undefined> {
  return getDiligenceByStartupId(startupId);
}

export async function getDiligenceReports(): Promise<DiligenceReport[]> {
  const startups = await getAllStartups();
  const reports = await Promise.all(
    startups.map((startup) => getDiligenceByStartupId(startup.id))
  );
  return reports.filter((report): report is DiligenceReport => Boolean(report));
}
