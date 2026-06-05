import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';

import { border, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

import AppText from './AppText';

type SecondaryButtonVariant = 'light' | 'ghost' | 'outline';

type SecondaryButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: SecondaryButtonVariant;
  style?: ViewStyle;
};

export default function SecondaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  variant = 'light',
  style,
}: SecondaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'light' && styles.light,
        variant === 'ghost' && styles.ghost,
        variant === 'outline' && styles.outline,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'ghost' ? palette.white : palette.accent}
          size="small"
        />
      ) : (
        <AppText
          variant="subtitle"
          tone={variant === 'ghost' ? 'inverse' : 'default'}
          style={[
            styles.label,
            variant === 'light' && styles.lightLabel,
            variant === 'outline' && styles.outlineLabel,
          ]}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.full,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  light: {
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: border.light,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: palette.accent,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: border.dark,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  lightLabel: {
    color: palette.background,
  },
  outlineLabel: {
    color: palette.accent,
  },
});
