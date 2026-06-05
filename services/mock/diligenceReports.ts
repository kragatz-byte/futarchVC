import { buildDiligenceFromStartup } from '@/services/buildDiligenceContent';

import { mockStartups } from './startups';

export const mockDiligenceReports = mockStartups.map((startup) =>
  buildDiligenceFromStartup(startup)
);
