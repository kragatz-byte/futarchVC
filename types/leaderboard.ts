export type LeaderboardBadge = 'Top Scout' | 'High Conviction' | 'Rising Analyst';

export type ForecasterLeaderboardEntry = {
  id: string;
  rank: number;
  username: string;
  campus: string;
  reputationScore: number;
  forecastCount: number;
  accuracyPlaceholder: string;
  badge?: LeaderboardBadge;
};

/** @deprecated Use ForecasterLeaderboardEntry */
export type LeaderboardEntry = {
  id: string;
  rank: number;
  name: string;
  university: string;
  reputationScore: number;
  accuracyRate: number;
};

export type CampusRankingEntry = {
  rank: number;
  campus: string;
  totalReputation: number;
  forecasterCount: number;
  avgAccuracyPlaceholder: string;
  topForecaster: string;
  weeklyMomentum: string;
};

export type LeaderboardData = {
  topForecasters: ForecasterLeaderboardEntry[];
  mostActive: ForecasterLeaderboardEntry[];
  campusRankings: CampusRankingEntry[];
};
