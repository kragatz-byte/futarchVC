import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import ProfileBadgesSection from '@/components/ProfileBadgesSection';
import ProfileStatTile from '@/components/ProfileStatTile';
import RecentActivityList from '@/components/RecentActivityList';
import SectionHeader from '@/components/SectionHeader';
import ThesisSection from '@/components/ThesisSection';
import {
  AppScreen,
  AppText,
  Card,
  CardSubtitle,
  CardTitle,
  LoadingState,
  SecondaryButton,
} from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useDecisions } from '@/contexts/DecisionContext';
import { useForecasts } from '@/contexts/ForecastContext';
import { brandCopy, processDisclosure } from '@/constants/copy';
import { navy, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import { buildLiveActivity, mergeActivity } from '@/lib/buildProfileActivity';
import { formatPercent } from '@/lib/format';
import { getCurrentProfile } from '@/services/leaderboard';
import { mockCurrentProfile } from '@/services/mock/profile';
import { getStartups } from '@/services/startups';
import type { Profile } from '@/types';

export default function ProfileScreen() {
  const router = useRouter();
  const { userId, session, isDemoMode, signOut } = useAuth();
  const { decisions, watchlist } = useDecisions();
  const { forecasts } = useForecasts();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(() => {
    getCurrentProfile(userId, session?.user.user_metadata)
      .then((data) => setProfile(data))
      .catch(() => setProfile(mockCurrentProfile))
      .finally(() => setLoading(false));
  }, [session?.user.user_metadata, userId]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const userDecisions = useMemo(
    () => decisions.filter((item) => item.userId === userId),
    [decisions, userId]
  );

  const userWatchlist = useMemo(
    () => watchlist.filter((item) => item.userId === userId),
    [watchlist, userId]
  );

  const userForecasts = useMemo(
    () => forecasts.filter((item) => item.userId === userId),
    [forecasts, userId]
  );

  const liveForecastCount = useMemo(
    () => userForecasts.reduce((sum, submission) => sum + submission.answers.length, 0),
    [userForecasts]
  );

  const stats = useMemo(() => {
    if (!profile) return null;

    return {
      forecastsMade: liveForecastCount > 0 ? liveForecastCount : profile.forecastsMade,
      investmentDecisionsMade:
        userDecisions.length > 0 ? userDecisions.length : profile.investmentDecisionsMade,
      watchlistCount: userWatchlist.length > 0 ? userWatchlist.length : profile.watchlistCount,
    };
  }, [profile, liveForecastCount, userDecisions.length, userWatchlist.length]);

  const [activity, setActivity] = useState(profile?.recentActivity ?? []);

  useFocusEffect(
    useCallback(() => {
      if (!profile) return;

      getStartups()
        .then((startups) => {
          const live = buildLiveActivity(
            startups,
            userDecisions,
            userWatchlist,
            userForecasts
          );
          setActivity(mergeActivity(profile.recentActivity, live));
        })
        .catch(() => setActivity(profile.recentActivity));
    }, [profile, userDecisions, userWatchlist, userForecasts])
  );

  const handleLogout = () => {
    Alert.alert('Log out', isDemoMode ? 'Leave demo mode?' : 'Sign out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth');
        },
      },
    ]);
  };

  if (loading || !profile || !stats) {
    return (
      <AppScreen>
        <LoadingState message="Loading profile..." />
      </AppScreen>
    );
  }

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <SectionHeader
        title="Profile"
        subtitle={`${brandCopy.profileTagline} — ${brandCopy.profileEvidence}`}
      />

      <Card style={styles.heroCard}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <AppText variant="subtitle" tone="inverse" style={styles.avatarText}>
              {profile.avatarInitials}
            </AppText>
          </View>
          <View style={styles.identity}>
            <AppText variant="title" tone="inverse">
              {profile.username}
            </AppText>
            <AppText variant="body" tone="inverseMuted">
              {profile.campus}
            </AppText>
            <View style={styles.rankPill}>
              <AppText variant="caption" tone="inverse">
                Rank #{profile.rank} · {formatPercent(profile.accuracyRate)} accuracy
              </AppText>
            </View>
          </View>
        </View>
        <AppText variant="body" tone="inverseMuted" style={styles.bio}>
          {profile.bio}
        </AppText>
      </Card>

      <View style={styles.statsGrid}>
        <ProfileStatTile label="Reputation" value={String(profile.reputationScore)} accent />
        <ProfileStatTile label="Forecasts" value={String(stats.forecastsMade)} />
        <ProfileStatTile label="Decisions" value={String(stats.investmentDecisionsMade)} />
        <ProfileStatTile label="Watchlist" value={String(stats.watchlistCount)} />
      </View>

      <ProfileBadgesSection badges={profile.badges} />

      <RecentActivityList items={activity} />

      <ThesisSection defaultThesis={profile.defaultThesis} />

      <Card variant="flat" style={styles.disclosureCard}>
        <CardTitle>CS153 · Process & disclosure</CardTitle>
        <CardSubtitle>{processDisclosure}</CardSubtitle>
      </Card>

      <Card style={styles.accountCard}>
        <CardTitle>Account</CardTitle>
        <CardSubtitle>
          {isDemoMode
            ? 'You are in demo mode with mock data and local saves.'
            : session?.user.email ?? 'Signed in with Supabase.'}
        </CardSubtitle>
        <SecondaryButton label="Log out" onPress={handleLogout} fullWidth style={styles.logout} />
      </Card>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    backgroundColor: navy[800],
    borderWidth: 1,
    borderColor: palette.accent,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radii.full,
    backgroundColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: palette.white,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
  },
  identity: {
    flex: 1,
    gap: spacing.xs,
  },
  rankPill: {
    alignSelf: 'flex-start',
    backgroundColor: navy[700],
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  bio: {
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  disclosureCard: {
    marginBottom: spacing.md,
  },
  accountCard: {
    marginBottom: spacing.lg,
  },
  logout: {
    marginTop: spacing.md,
  },
});
