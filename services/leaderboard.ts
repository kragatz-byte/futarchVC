import { DEMO_USER_ID } from '@/constants/auth';
import { initialsFromName } from '@/lib/initials';
import type { LeaderboardData, LeaderboardEntry, Profile } from '@/types';

import { mockCurrentProfile } from './mock/profile';
import { mockLeaderboard, mockLeaderboardData } from './mock/leaderboard';
import { fetchLeaderboardFromSupabase, fetchProfileFromSupabase } from './supabase/queries';

function mergeLeaderboardData(
  remote: LeaderboardData,
  fallback: LeaderboardData
): LeaderboardData {
  return {
    topForecasters: remote.topForecasters.length
      ? remote.topForecasters
      : fallback.topForecasters,
    mostActive: remote.mostActive.length ? remote.mostActive : fallback.mostActive,
    campusRankings: remote.campusRankings.length
      ? remote.campusRankings
      : fallback.campusRankings,
  };
}

export async function getLeaderboardData(): Promise<LeaderboardData> {
  const remote = await fetchLeaderboardFromSupabase();
  if (!remote) {
    return mockLeaderboardData;
  }
  return mergeLeaderboardData(remote, mockLeaderboardData);
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return mockLeaderboard;
}

function profileFromAuthMetadata(
  userId: string,
  metadata: Record<string, unknown> | undefined
): Profile {
  const username =
    typeof metadata?.username === 'string' ? metadata.username : 'Investor';
  const campus = typeof metadata?.campus === 'string' ? metadata.campus : '';
  const fullName =
    typeof metadata?.full_name === 'string' ? metadata.full_name : username;

  return {
    id: userId,
    username,
    campus,
    avatarInitials: initialsFromName(fullName, username),
    bio: '',
    reputationScore: 0,
    forecastsMade: 0,
    investmentDecisionsMade: 0,
    watchlistCount: 0,
    accuracyRate: 0,
    rank: 0,
    badges: [],
    recentActivity: [],
    defaultThesis: '',
  };
}

export async function getCurrentProfile(
  userId: string = DEMO_USER_ID,
  metadata?: Record<string, unknown>
): Promise<Profile> {
  if (userId === DEMO_USER_ID) {
    const remote = await fetchProfileFromSupabase(DEMO_USER_ID);
    return remote ?? mockCurrentProfile;
  }

  const remote = await fetchProfileFromSupabase(userId);
  if (remote) return remote;

  return profileFromAuthMetadata(userId, metadata);
}

/** @deprecated Use getCurrentProfile */
export async function getCurrentUser(): Promise<Profile> {
  return getCurrentProfile();
}
