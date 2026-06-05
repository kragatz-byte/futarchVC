import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { AppText } from '@/components/ui';
import { border, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

type FeedActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'muted' | 'outline';
  style?: ViewStyle;
};

export default function FeedActionButton({
  label,
  onPress,
  variant = 'outline',
  style,
}: FeedActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        style,
      ]}>
      <AppText
        variant="caption"
        tone={variant === 'primary' || variant === 'success' ? 'inverse' : 'default'}
        style={[
          styles.label,
          variant === 'outline' && styles.outlineLabel,
          variant === 'muted' && styles.mutedLabel,
        ]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    minHeight: 38,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  primary: {
    backgroundColor: palette.accent,
  },
  success: {
    backgroundColor: palette.success,
  },
  muted: {
    backgroundColor: palette.offWhite,
    borderWidth: 1,
    borderColor: border.light,
  },
  outline: {
    backgroundColor: palette.card,
    borderWidth: 1.5,
    borderColor: palette.accent,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontWeight: '600',
    fontSize: 13,
  },
  outlineLabel: {
    color: palette.accent,
  },
  mutedLabel: {
    color: palette.muted,
  },
});
