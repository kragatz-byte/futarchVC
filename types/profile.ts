import type { LeaderboardBadge } from './leaderboard';

export type ProfileActivityType = 'forecast' | 'invest' | 'pass' | 'watchlist';

export type ProfileActivityItem = {
  id: string;
  type: ProfileActivityType;
  startupName: string;
  summary: string;
  createdAt: string;
};

export type ProfileBadgeEarned = {
  id: string;
  label: LeaderboardBadge | 'Early Believer' | 'Campus Catalyst';
  description: string;
  earnedAt: string;
};

export type Profile = {
  id: string;
  username: string;
  campus: string;
  avatarInitials: string;
  bio: string;
  reputationScore: number;
  forecastsMade: number;
  investmentDecisionsMade: number;
  watchlistCount: number;
  accuracyRate: number;
  rank: number;
  badges: ProfileBadgeEarned[];
  recentActivity: ProfileActivityItem[];
  defaultThesis: string;
};

/** @deprecated Use username */
export type LegacyProfile = Profile & { name?: string };
