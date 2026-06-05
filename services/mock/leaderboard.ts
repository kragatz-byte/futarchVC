import type { CampusRankingEntry, ForecasterLeaderboardEntry, LeaderboardData } from '@/types';

const forecasters: ForecasterLeaderboardEntry[] = [
  {
    id: 'u1',
    rank: 1,
    username: 'Alex Rivera',
    campus: 'Stanford',
    reputationScore: 942,
    forecastCount: 58,
    accuracyPlaceholder: '78%',
    badge: 'Top Scout',
  },
  {
    id: 'u2',
    rank: 2,
    username: 'Priya Nair',
    campus: 'MIT',
    reputationScore: 918,
    forecastCount: 52,
    accuracyPlaceholder: '74%',
    badge: 'High Conviction',
  },
  {
    id: 'u3',
    rank: 3,
    username: 'Sam Okonkwo',
    campus: 'Berkeley',
    reputationScore: 891,
    forecastCount: 47,
    accuracyPlaceholder: '71%',
    badge: 'Rising Analyst',
  },
  {
    id: 'u4',
    rank: 4,
    username: 'You',
    campus: 'Columbia',
    reputationScore: 756,
    forecastCount: 34,
    accuracyPlaceholder: '68%',
    badge: 'Rising Analyst',
  },
  {
    id: 'u5',
    rank: 5,
    username: 'Jordan Ellis',
    campus: 'MIT',
    reputationScore: 724,
    forecastCount: 41,
    accuracyPlaceholder: '66%',
  },
  {
    id: 'u6',
    rank: 6,
    username: 'Maya Chen',
    campus: 'Stanford',
    reputationScore: 698,
    forecastCount: 29,
    accuracyPlaceholder: '64%',
    badge: 'Top Scout',
  },
  {
    id: 'u7',
    rank: 7,
    username: 'Ethan Morales',
    campus: 'Harvard',
    reputationScore: 682,
    forecastCount: 38,
    accuracyPlaceholder: '63%',
  },
  {
    id: 'u8',
    rank: 8,
    username: 'Aisha Patel',
    campus: 'Berkeley',
    reputationScore: 671,
    forecastCount: 33,
    accuracyPlaceholder: '62%',
    badge: 'High Conviction',
  },
  {
    id: 'u9',
    rank: 9,
    username: 'Riley Kim',
    campus: 'CMU',
    reputationScore: 654,
    forecastCount: 45,
    accuracyPlaceholder: '61%',
    badge: 'Rising Analyst',
  },
  {
    id: 'u10',
    rank: 10,
    username: 'Noah Brooks',
    campus: 'Harvard',
    reputationScore: 638,
    forecastCount: 27,
    accuracyPlaceholder: '59%',
  },
];

const mostActive: ForecasterLeaderboardEntry[] = [...forecasters]
  .sort((a, b) => b.forecastCount - a.forecastCount)
  .map((entry, index) => ({
    ...entry,
    rank: index + 1,
    badge:
      index === 0
        ? 'Top Scout'
        : index === 1
          ? 'High Conviction'
          : index === 2
            ? ('Rising Analyst' as const)
            : entry.badge,
  }));

const campusRankings: CampusRankingEntry[] = [
  {
    rank: 1,
    campus: 'Stanford',
    totalReputation: 4280,
    forecasterCount: 124,
    avgAccuracyPlaceholder: '72%',
    topForecaster: 'Alex Rivera',
    weeklyMomentum: '+186 pts',
  },
  {
    rank: 2,
    campus: 'MIT',
    totalReputation: 4012,
    forecasterCount: 118,
    avgAccuracyPlaceholder: '70%',
    topForecaster: 'Priya Nair',
    weeklyMomentum: '+142 pts',
  },
  {
    rank: 3,
    campus: 'Berkeley',
    totalReputation: 3894,
    forecasterCount: 109,
    avgAccuracyPlaceholder: '69%',
    topForecaster: 'Sam Okonkwo',
    weeklyMomentum: '+128 pts',
  },
  {
    rank: 4,
    campus: 'Harvard',
    totalReputation: 3521,
    forecasterCount: 97,
    avgAccuracyPlaceholder: '67%',
    topForecaster: 'Ethan Morales',
    weeklyMomentum: '+94 pts',
  },
  {
    rank: 5,
    campus: 'CMU',
    totalReputation: 3188,
    forecasterCount: 86,
    avgAccuracyPlaceholder: '65%',
    topForecaster: 'Riley Kim',
    weeklyMomentum: '+71 pts',
  },
];

export const mockLeaderboardData: LeaderboardData = {
  topForecasters: forecasters,
  mostActive,
  campusRankings,
};

/** @deprecated */
export const mockLeaderboard = forecasters.map((entry) => ({
  id: entry.id,
  rank: entry.rank,
  name: entry.username,
  university: entry.campus,
  reputationScore: entry.reputationScore,
  accuracyRate: parseInt(entry.accuracyPlaceholder, 10) || 0,
}));
