import { StyleSheet, View, ViewStyle } from 'react-native';

import { palette, text } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

import AppText from './AppText';

type VoterSentimentBadgeSize = 'sm' | 'md' | 'lg';

type VoterSentimentBadgeProps = {
  percentInvest: number;
  percentPass: number;
  size?: VoterSentimentBadgeSize;
  style?: ViewStyle;
};

const fontScale = {
  sm: { row: 11, label: 9 },
  md: { row: 12, label: 10 },
  lg: { row: 14, label: 10 },
} as const;

export default function VoterSentimentBadge({
  percentInvest,
  percentPass,
  size = 'md',
  style,
}: VoterSentimentBadgeProps) {
  const invest = Math.round(percentInvest);
  const pass = Math.round(percentPass);
  const hasVotes = invest > 0 || pass > 0;
  const scale = fontScale[size];

  return (
    <View style={[styles.shell, styles[size], style]}>
      <View
        style={[
          styles.band,
          styles.bandTop,
          { backgroundColor: hasVotes ? palette.success : 'rgba(16, 185, 129, 0.35)' },
        ]}>
        <AppText tone="inverse" style={[styles.rowText, { fontSize: scale.row }]}>
          Invest {hasVotes ? `${invest}%` : '—'}
        </AppText>
        <AppText tone="inverse" style={[styles.eyebrow, { fontSize: scale.label }]}>
          VOTERS
        </AppText>
      </View>
      <View
        style={[
          styles.band,
          { backgroundColor: hasVotes ? palette.risk : 'rgba(239, 68, 68, 0.35)' },
        ]}>
        <AppText tone="inverse" style={[styles.rowText, { fontSize: scale.row }]}>
          Pass {hasVotes ? `${pass}%` : '—'}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'stretch',
  },
  sm: {
    minWidth: 56,
  },
  md: {
    minWidth: 64,
  },
  lg: {
    minWidth: 76,
    borderRadius: radii.lg,
  },
  band: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bandTop: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    gap: 2,
  },
  rowText: {
    fontWeight: '700',
    letterSpacing: -0.2,
    color: text.inverse,
  },
  eyebrow: {
    marginTop: 2,
    fontWeight: '700',
    letterSpacing: 1,
    color: 'rgba(255, 255, 255, 0.75)',
  },
});
