import { StyleSheet, View } from 'react-native';

import BrandLogo from '@/components/BrandLogo';
import { AppText } from '@/components/ui';
import { brandCopy } from '@/constants/copy';
import { palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

type FeedHeaderProps = {
  opportunityCount?: number;
};

export default function FeedHeader({ opportunityCount }: FeedHeaderProps) {
  return (
    <View style={styles.container}>
      <BrandLogo />
      <AppText variant="subtitle" tone="inverse" style={styles.tagline}>
        {brandCopy.feedTagline}
      </AppText>
      <AppText variant="body" tone="inverseMuted" style={styles.mission}>
        {brandCopy.feedMission}
      </AppText>
      {opportunityCount !== undefined && opportunityCount > 0 ? (
        <View style={styles.countRow}>
          <View style={styles.countPill}>
            <AppText variant="caption" tone="inverse" style={styles.countText}>
              {brandCopy.feedLiveCount(opportunityCount)}
            </AppText>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
    alignItems: 'center',
  },
  tagline: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: -0.35,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  mission: {
    textAlign: 'center',
    lineHeight: 22,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    fontWeight: '500',
  },
  countRow: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  countPill: {
    backgroundColor: palette.cuteMuted,
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: palette.cuteBorder,
  },
  countText: {
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.15,
  },
});
