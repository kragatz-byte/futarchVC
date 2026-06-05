import type { InvestmentDecision } from '@/types';

import { mockInvestmentDecisions as legacyMockDecisions } from './mock/investmentDecisions';

export async function getInvestmentDecisionsByStartupId(
  startupId: string
): Promise<InvestmentDecision[]> {
  return legacyMockDecisions.filter((decision) => decision.startupId === startupId);
}

export async function getInvestmentDecisionsByUserId(
  userId: string
): Promise<InvestmentDecision[]> {
  return legacyMockDecisions.filter((decision) => decision.userId === userId);
}

export async function getInvestmentDecisions(): Promise<InvestmentDecision[]> {
  return legacyMockDecisions;
}
