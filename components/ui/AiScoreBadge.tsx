import { StyleSheet, View, ViewStyle } from 'react-native';

import { navy, palette, text } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import { formatScore } from '@/lib/format';

import AppText from './AppText';

type AiScoreBadgeSize = 'sm' | 'md' | 'lg';

type AiScoreBadgeProps = {
  score: number;
  size?: AiScoreBadgeSize;
  style?: ViewStyle;
};

function scoreTier(score: number): 'high' | 'mid' | 'low' {
  const display = score <= 10 ? score * 10 : score;
  if (display >= 75) return 'high';
  if (display >= 55) return 'mid';
  return 'low';
}

export default function AiScoreBadge({ score, size = 'md', style }: AiScoreBadgeProps) {
  const tier = scoreTier(score);
  const sizeStyle = styles[size];
  const tierStyle = tierStyles[tier];

  return (
    <View style={[styles.base, sizeStyle, tierStyle.container, style]}>
      <AppText
        variant={size === 'lg' ? 'title' : 'subtitle'}
        tone="inverse"
        style={[styles.score, size === 'sm' && styles.scoreSm]}>
        {formatScore(score)}
      </AppText>
      <AppText variant="caption" tone="inverseMuted" style={styles.unit}>
        /100
      </AppText>
      <AppText variant="caption" tone="inverseMuted" style={styles.label}>
        AI
      </AppText>
    </View>
  );
}

const tierStyles = {
  high: {
    container: {
      backgroundColor: palette.accent,
      borderColor: 'rgba(255,255,255,0.25)',
    },
  },
  mid: {
    container: {
      backgroundColor: navy[700],
      borderColor: 'rgba(59, 130, 246, 0.35)',
    },
  },
  low: {
    container: {
      backgroundColor: navy[800],
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radii.md,
  },
  sm: {
    minWidth: 48,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
  },
  md: {
    minWidth: 56,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  lg: {
    minWidth: 72,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
  },
  score: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  scoreSm: {
    fontSize: 17,
  },
  unit: {
    fontSize: 9,
    marginTop: -2,
    opacity: 0.85,
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: text.inverseMuted,
  },
});
