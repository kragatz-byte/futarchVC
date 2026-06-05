import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import CampusRankingCard from '@/components/CampusRankingCard';
import ForecasterLeaderboardRow from '@/components/ForecasterLeaderboardRow';
import ForecasterPodium from '@/components/ForecasterPodium';
import LeaderboardTabBar, { LeaderboardTab } from '@/components/LeaderboardTabBar';
import { AppScreen, AppText, Card, CardSubtitle, CardTitle, LoadingState } from '@/components/ui';
import { brandCopy } from '@/constants/copy';
import { palette } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { getLeaderboardData } from '@/services/leaderboard';
import { mockLeaderboardData } from '@/services/mock/leaderboard';
import type { LeaderboardData } from '@/types';

export default function LeaderboardScreen() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('forecasters');

  useEffect(() => {
    getLeaderboardData()
      .then((leaderboard) => setData(leaderboard))
      .catch(() => setData(mockLeaderboardData))
      .finally(() => setLoading(false));
  }, []);

  const maxCampusReputation = useMemo(() => {
    if (!data?.campusRankings.length) return 1;
    return Math.max(
      1,
      ...data.campusRankings.map((campus) => campus.totalReputation)
    );
  }, [data]);

  const tabHint = useMemo(() => {
    switch (activeTab) {
      case 'forecasters':
        return 'Ranked by reputation — spot talent before the crowd catches on.';
      case 'active':
        return 'Volume plus judgment. Stay in the game.';
      case 'campus':
        return 'Which campus has the sharpest scouts?';
      default:
        return '';
    }
  }, [activeTab]);

  if (loading || !data) {
    return (
      <AppScreen>
        <LoadingState message="Loading rankings..." />
      </AppScreen>
    );
  }

  const forecasterList =
    activeTab === 'forecasters' ? data.topForecasters : data.mostActive;
  const showPodium = forecasterList.length >= 3;
  const listEntries = showPodium ? forecasterList.slice(3) : forecasterList;

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AppText variant="display" tone="inverse">
          Leaderboard
        </AppText>
        <AppText variant="body" tone="inverse" style={styles.tagline}>
          {brandCopy.leaderboardTagline}
        </AppText>
        <AppText variant="caption" tone="inverseMuted" style={styles.subline}>
          {brandCopy.leaderboardSubline}
        </AppText>
      </View>

      <Card variant="feed" style={styles.heroCard}>
        <CardTitle>Reputation league</CardTitle>
        <CardSubtitle>
          Forecast, earn badges, and climb. Accuracy updates as startups resolve.
        </CardSubtitle>
      </Card>

      <LeaderboardTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <AppText variant="body" tone="inverseMuted" style={styles.tabHint}>
        {tabHint}
      </AppText>

      {activeTab === 'campus' ? (
        <View style={styles.campusList}>
          {data.campusRankings.map((campus) => (
            <CampusRankingCard
              key={campus.campus}
              entry={campus}
              maxReputation={maxCampusReputation}
            />
          ))}
        </View>
      ) : (
        <>
          {showPodium ? <ForecasterPodium entries={forecasterList} /> : null}
          {listEntries.length > 0 ? (
            <AppText variant="label" tone="inverseMuted" style={styles.listLabel}>
              {showPodium ? 'Full standings' : 'Standings'}
            </AppText>
          ) : null}
          {listEntries.map((entry) => (
            <ForecasterLeaderboardRow key={`${activeTab}-${entry.id}`} entry={entry} />
          ))}
        </>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  tagline: {
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  subline: {
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  heroCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  tabHint: {
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  campusList: {
    gap: spacing.sm,
  },
  listLabel: {
    marginBottom: spacing.sm,
  },
});
