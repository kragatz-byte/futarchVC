import type { InvestmentDecision } from '@/types';

export const mockInvestmentDecisions: InvestmentDecision[] = [
  {
    id: 'decision-1',
    startupId: 'pitchpal',
    userId: 'current',
    decision: 'invest',
    conviction: 82,
    reasoning: 'Best GTM in cohort; accelerator partnerships de-risk distribution.',
    createdAt: '2026-05-27T18:05:00Z',
  },
  {
    id: 'decision-2',
    startupId: 'labledger',
    userId: 'current',
    decision: 'invest',
    conviction: 76,
    reasoning: 'Rare campus startup with real ARR and expansion inside accounts.',
    createdAt: '2026-05-26T12:35:00Z',
  },
  {
    id: 'decision-3',
    startupId: 'venturebowl',
    userId: 'current',
    decision: 'pass',
    conviction: 58,
    reasoning: 'Too early without a live forecasting loop or legal clarity.',
    createdAt: '2026-05-22T09:20:00Z',
  },
  {
    id: 'decision-4',
    startupId: 'dormdash',
    userId: 'u3',
    decision: 'invest',
    conviction: 64,
    reasoning: 'Pilot order volume proves demand; watching unit economics closely.',
    createdAt: '2026-05-21T11:00:00Z',
  },
];
