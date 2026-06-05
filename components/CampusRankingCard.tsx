import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { border, navy, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import type { CampusRankingEntry } from '@/types';

type CampusRankingCardProps = {
  entry: CampusRankingEntry;
  maxReputation: number;
};

const CAMPUS_SHORT: Record<string, string> = {
  Stanford: 'STAN',
  MIT: 'MIT',
  Berkeley: 'CAL',
  Harvard: 'HRV',
  CMU: 'CMU',
};

export default function CampusRankingCard({ entry, maxReputation }: CampusRankingCardProps) {
  const progress = maxReputation > 0 ? entry.totalReputation / maxReputation : 0;
  const isTop = entry.rank === 1;

  return (
    <View style={[styles.card, isTop && styles.cardTop]}>
      <View style={styles.header}>
        <View style={[styles.rankCircle, isTop && styles.rankCircleTop]}>
          <AppText variant="subtitle" tone={isTop ? 'inverse' : 'accent'}>
            {entry.rank}
          </AppText>
        </View>
        <View style={styles.headerCopy}>
          <AppText variant="subtitle" tone={isTop ? 'inverse' : 'default'}>
            {entry.campus}
          </AppText>
          <AppText variant="caption" tone={isTop ? 'inverseMuted' : 'muted'}>
            {entry.forecasterCount} forecasters · {entry.weeklyMomentum}
          </AppText>
        </View>
        <View style={styles.scoreBlock}>
          <AppText variant="subtitle" tone={isTop ? 'inverse' : 'default'}>
            {entry.totalReputation.toLocaleString()}
          </AppText>
          <AppText variant="caption" tone={isTop ? 'inverseMuted' : 'muted'}>
            rep pts
          </AppText>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.round(progress * 100)}%` },
            isTop && styles.progressFillTop,
          ]}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.monogram}>
          <AppText variant="label" tone={isTop ? 'inverse' : 'accent'}>
            {CAMPUS_SHORT[entry.campus] ?? entry.campus.slice(0, 3).toUpperCase()}
          </AppText>
        </View>
        <View style={styles.footerCopy}>
          <AppText variant="caption" tone={isTop ? 'inverseMuted' : 'muted'}>
            Top scout: {entry.topForecaster}
          </AppText>
          <AppText variant="caption" tone={isTop ? 'inverseMuted' : 'muted'}>
            Avg accuracy: {entry.avgAccuracyPlaceholder}
          </AppText>
        </View>
        {isTop ? (
          <View style={styles.championTag}>
            <AppText variant="caption" style={styles.championText}>
              Campus #1
            </AppText>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: border.light,
    gap: spacing.md,
  },
  cardTop: {
    backgroundColor: navy[700],
    borderColor: palette.accent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rankCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: palette.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankCircleTop: {
    backgroundColor: palette.accent,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  scoreBlock: {
    alignItems: 'flex-end',
  },
  progressTrack: {
    height: 8,
    backgroundColor: palette.offWhite,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.accent,
    borderRadius: radii.full,
  },
  progressFillTop: {
    backgroundColor: '#F59E0B',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  monogram: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: palette.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerCopy: {
    flex: 1,
    gap: 2,
  },
  championTag: {
    backgroundColor: '#FEF3C7',
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  championText: {
    color: '#B45309',
    fontWeight: '700',
    fontSize: 11,
  },
});
