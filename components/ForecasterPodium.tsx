import { StyleSheet, View } from 'react-native';

import LeaderboardBadge from '@/components/LeaderboardBadge';
import { AppText } from '@/components/ui';
import { getInitials } from '@/lib/format';
import { navy, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import type { ForecasterLeaderboardEntry } from '@/types';

type ForecasterPodiumProps = {
  entries: ForecasterLeaderboardEntry[];
};

const PODIUM_ORDER = [1, 0, 2] as const;
const PODIUM_HEIGHTS = [72, 96, 56];
const MEDAL_COLORS = ['#C0C0C0', '#F59E0B', '#CD7F32'];

export default function ForecasterPodium({ entries }: ForecasterPodiumProps) {
  const topThree = entries.slice(0, 3);
  if (topThree.length < 3) return null;

  return (
    <View style={styles.container}>
      <AppText variant="label" tone="inverseMuted" style={styles.label}>
        This week's breakout scouts
      </AppText>
      <View style={styles.podiumRow}>
        {PODIUM_ORDER.map((slotIndex, displayIndex) => {
          const entry = topThree[slotIndex];
          const isFirst = slotIndex === 0;

          return (
            <View key={entry.id} style={styles.slot}>
              <View style={[styles.avatar, isFirst && styles.avatarFirst]}>
                <AppText variant="caption" tone="inverse" style={isFirst ? styles.avatarTextLg : undefined}>
                  {getInitials(entry.username)}
                </AppText>
              </View>
              <AppText
                variant="caption"
                tone="inverse"
                numberOfLines={1}
                style={[styles.name, isFirst && styles.nameFirst]}>
                {entry.username}
              </AppText>
              <AppText variant="caption" tone="inverseMuted" numberOfLines={1}>
                {entry.campus}
              </AppText>
              <View
                style={[
                  styles.pedestal,
                  {
                    height: PODIUM_HEIGHTS[displayIndex],
                    backgroundColor: isFirst ? palette.accent : navy[700],
                    borderColor: MEDAL_COLORS[displayIndex],
                  },
                ]}>
                <AppText variant="subtitle" tone="inverse">
                  #{entry.rank}
                </AppText>
                <AppText variant="caption" tone="inverseMuted">
                  {entry.reputationScore}
                </AppText>
              </View>
              {entry.badge ? (
                <View style={styles.badgeWrap}>
                  <LeaderboardBadge badge={entry.badge} />
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    maxWidth: 110,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: navy[600],
    borderWidth: 2,
    borderColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  avatarFirst: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderColor: '#F59E0B',
    borderWidth: 3,
  },
  avatarTextLg: {
    fontSize: 14,
    fontWeight: '700',
  },
  name: {
    fontWeight: '600',
    textAlign: 'center',
  },
  nameFirst: {
    fontWeight: '700',
  },
  pedestal: {
    width: '100%',
    marginTop: spacing.sm,
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
    borderTopWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  badgeWrap: {
    marginTop: spacing.sm,
    transform: [{ scale: 0.9 }],
  },
});
