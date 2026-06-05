import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { border, navy, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import type { LeaderboardBadge as BadgeType } from '@/types';

const BADGE_STYLES: Record<
  BadgeType,
  { backgroundColor: string; borderColor: string; textColor: string }
> = {
  'Top Scout': {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.45)',
    textColor: '#D97706',
  },
  'High Conviction': {
    backgroundColor: palette.accentMuted,
    borderColor: border.accent,
    textColor: palette.accent,
  },
  'Rising Analyst': {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    textColor: palette.success,
  },
};

type LeaderboardBadgeProps = {
  badge: BadgeType;
};

export default function LeaderboardBadge({ badge }: LeaderboardBadgeProps) {
  const tone = BADGE_STYLES[badge];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: tone.backgroundColor, borderColor: tone.borderColor },
      ]}>
      <View style={styles.dot} />
      <AppText variant="caption" style={[styles.label, { color: tone.textColor }]}>
        {badge}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 1,
    borderWidth: 1,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: radii.full,
    backgroundColor: navy[600],
    opacity: 0.5,
  },
  label: {
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.2,
  },
});
