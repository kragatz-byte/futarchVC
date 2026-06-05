import { StyleSheet, View } from 'react-native';

import LeaderboardBadge from '@/components/LeaderboardBadge';
import { AppText } from '@/components/ui';
import { getInitials } from '@/lib/format';
import { border, navy, palette } from '@/constants/colors';
import { radii, shadows, spacing } from '@/constants/theme';
import type { ForecasterLeaderboardEntry } from '@/types';

type ForecasterLeaderboardRowProps = {
  entry: ForecasterLeaderboardEntry;
  isCurrentUser?: boolean;
};

export default function ForecasterLeaderboardRow({
  entry,
  isCurrentUser = entry.username === 'You',
}: ForecasterLeaderboardRowProps) {
  return (
    <View style={[styles.row, isCurrentUser && styles.rowHighlight]}>
      <View style={[styles.rankBadge, entry.rank <= 3 && styles.rankBadgeTop]}>
        <AppText variant="subtitle" tone={isCurrentUser ? 'inverse' : entry.rank <= 3 ? 'accent' : 'default'}>
          {entry.rank}
        </AppText>
      </View>

      <View style={[styles.avatar, isCurrentUser && styles.avatarHighlight]}>
        <AppText variant="caption" tone="inverse" style={styles.avatarText}>
          {getInitials(entry.username)}
        </AppText>
      </View>

      <View style={styles.main}>
        <View style={styles.nameRow}>
          <AppText variant="subtitle" tone={isCurrentUser ? 'inverse' : 'default'} numberOfLines={1}>
            {entry.username}
          </AppText>
          {entry.badge ? <LeaderboardBadge badge={entry.badge} /> : null}
        </View>
        <AppText variant="caption" tone={isCurrentUser ? 'inverseMuted' : 'muted'}>
          {entry.campus}
        </AppText>
        <View style={styles.metrics}>
          <Metric label="Rep" value={String(entry.reputationScore)} highlight={isCurrentUser} />
          <Metric label="Forecasts" value={String(entry.forecastCount)} highlight={isCurrentUser} />
          <Metric label="Accuracy" value={entry.accuracyPlaceholder} highlight={isCurrentUser} />
        </View>
      </View>
    </View>
  );
}

function Metric({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.metric}>
      <AppText variant="caption" tone={highlight ? 'inverseMuted' : 'muted'}>
        {label}
      </AppText>
      <AppText variant="caption" tone={highlight ? 'inverse' : 'default'} style={styles.metricValue}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: border.light,
    ...shadows.soft,
  },
  rowHighlight: {
    backgroundColor: navy[700],
    borderColor: palette.accent,
    ...shadows.feedCard,
  },
  rankBadge: {
    width: 28,
    alignItems: 'center',
  },
  rankBadgeTop: {
    backgroundColor: palette.offWhite,
    borderRadius: radii.sm,
    paddingVertical: spacing.xs,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: navy[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHighlight: {
    backgroundColor: palette.accent,
  },
  avatarText: {
    fontWeight: '700',
    fontSize: 13,
  },
  main: {
    flex: 1,
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  metric: {
    gap: 2,
  },
  metricValue: {
    fontWeight: '700',
  },
});
