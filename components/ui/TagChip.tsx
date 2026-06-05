import { StyleSheet, View, ViewStyle } from 'react-native';

import { border, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

import AppText from './AppText';

type TagChipTone = 'accent' | 'neutral' | 'success' | 'warning' | 'risk';

type TagChipProps = {
  label: string;
  tone?: TagChipTone;
  style?: ViewStyle;
};

const toneStyles: Record<
  TagChipTone,
  { backgroundColor: string; borderColor: string; textTone: 'accent' | 'muted' | 'success' | 'warning' | 'risk' }
> = {
  accent: {
    backgroundColor: palette.accentMuted,
    borderColor: border.accent,
    textTone: 'accent',
  },
  neutral: {
    backgroundColor: palette.offWhite,
    borderColor: border.light,
    textTone: 'muted',
  },
  success: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    textTone: 'success',
  },
  warning: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    textTone: 'warning',
  },
  risk: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    textTone: 'risk',
  },
};

export default function TagChip({ label, tone = 'accent', style }: TagChipProps) {
  const toneStyle = toneStyles[tone];

  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: toneStyle.backgroundColor, borderColor: toneStyle.borderColor },
        style,
      ]}>
      <AppText variant="caption" tone={toneStyle.textTone} style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 1,
    borderWidth: 1,
  },
  label: {
    fontWeight: '600',
    fontSize: 12,
  },
});
