import { StyleSheet, View } from 'react-native';

import LeaderboardBadgeChip from '@/components/LeaderboardBadge';
import { AppText, Card, CardSubtitle, CardTitle } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { formatRelativeDate } from '@/lib/format';
import type { ProfileBadgeEarned } from '@/types';
import type { LeaderboardBadge } from '@/types/leaderboard';

type ProfileBadgesSectionProps = {
  badges: ProfileBadgeEarned[];
};

const KNOWN_BADGES: LeaderboardBadge[] = ['Top Scout', 'High Conviction', 'Rising Analyst'];

function isKnownBadge(label: ProfileBadgeEarned['label']): label is LeaderboardBadge {
  return (KNOWN_BADGES as string[]).includes(label);
}

export default function ProfileBadgesSection({ badges }: ProfileBadgesSectionProps) {
  return (
    <Card style={styles.card}>
      <CardTitle>Badges earned</CardTitle>
      <CardSubtitle>{badges.length} achievements on FutarchyVC</CardSubtitle>

      <View style={styles.list}>
        {badges.map((badge) => (
          <View key={badge.id} style={styles.badgeRow}>
            {isKnownBadge(badge.label) ? (
              <LeaderboardBadgeChip badge={badge.label} />
            ) : (
              <View style={styles.customBadge}>
                <AppText variant="caption" style={styles.customBadgeText}>
                  {badge.label}
                </AppText>
              </View>
            )}
            <View style={styles.badgeCopy}>
              <AppText variant="body" tone="muted">
                {badge.description}
              </AppText>
              <AppText variant="caption" tone="muted">
                Earned {formatRelativeDate(badge.earnedAt)}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  list: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  badgeRow: {
    gap: spacing.sm,
  },
  badgeCopy: {
    gap: spacing.xs,
  },
  customBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3E8FF',
    borderRadius: 9999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  customBadgeText: {
    color: '#6D28D9',
    fontWeight: '700',
    fontSize: 11,
  },
});
