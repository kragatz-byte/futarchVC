import type { Profile } from '@/types';

export const mockCurrentProfile: Profile = {
  id: 'current',
  username: 'You',
  campus: 'Columbia',
  avatarInitials: 'YO',
  bio: 'CS + Econ junior. Hunting breakout campus startups before demo day hype hits.',
  reputationScore: 756,
  forecastsMade: 34,
  investmentDecisionsMade: 3,
  watchlistCount: 2,
  accuracyRate: 68,
  rank: 4,
  badges: [
    {
      id: 'badge-1',
      label: 'Rising Analyst',
      description: 'Top 25% forecast volume this month',
      earnedAt: '2026-05-20T10:00:00Z',
    },
    {
      id: 'badge-2',
      label: 'High Conviction',
      description: 'Average conviction above 70 on invest decisions',
      earnedAt: '2026-05-15T14:00:00Z',
    },
    {
      id: 'badge-3',
      label: 'Early Believer',
      description: 'Invested before a startup hit 100 forecasts',
      earnedAt: '2026-05-08T09:00:00Z',
    },
    {
      id: 'badge-4',
      label: 'Campus Catalyst',
      description: 'Helped 3+ Columbia founders get community feedback',
      earnedAt: '2026-04-28T16:00:00Z',
    },
  ],
  recentActivity: [
    {
      id: 'act-mock-1',
      type: 'forecast',
      startupName: 'PitchPal',
      summary: 'Submitted 2 outcome forecasts · 78% avg probability',
      createdAt: '2026-05-27T18:00:00Z',
    },
    {
      id: 'act-mock-2',
      type: 'invest',
      startupName: 'LabLedger',
      summary: 'Invest decision · 76 conviction',
      createdAt: '2026-05-26T12:35:00Z',
    },
    {
      id: 'act-mock-3',
      type: 'pass',
      startupName: 'VentureBowl',
      summary: 'Passed · pre-product risk too high for now',
      createdAt: '2026-05-22T09:20:00Z',
    },
    {
      id: 'act-mock-4',
      type: 'watchlist',
      startupName: 'QuadLink',
      summary: 'Added to watchlist · leaning invest',
      createdAt: '2026-05-18T11:00:00Z',
    },
  ],
  defaultThesis:
    'I back campus-native distribution and founders who ship weekly. Skeptical of pre-revenue tools without retention data. Looking for AI-enabled workflows with clear ICP and repeat usage.',
};
