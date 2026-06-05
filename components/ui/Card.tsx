import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { border, palette } from '@/constants/colors';
import { radii, shadows, spacing } from '@/constants/theme';

import AppText from './AppText';

type CardVariant = 'elevated' | 'flat' | 'soft' | 'feed';

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  variant?: CardVariant;
  style?: ViewStyle;
};

export default function Card({ children, onPress, variant = 'elevated', style }: CardProps) {
  const cardStyle = [styles.base, styles[variant], style];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}>
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

export function CardLabel({ children }: { children: ReactNode }) {
  return (
    <AppText variant="label" tone="accent" style={styles.label}>
      {children}
    </AppText>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <AppText variant="subtitle" tone="default">
      {children}
    </AppText>
  );
}

export function CardSubtitle({ children }: { children: ReactNode }) {
  return (
    <AppText variant="body" tone="muted" style={styles.subtitle}>
      {children}
    </AppText>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  elevated: {
    backgroundColor: palette.card,
    padding: spacing.md,
    ...shadows.card,
  },
  feed: {
    backgroundColor: palette.card,
    ...shadows.feedCard,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: border.light,
  },
  flat: {
    backgroundColor: palette.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: border.light,
  },
  soft: {
    backgroundColor: palette.offWhite,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: border.light,
  },
  pressed: {
    opacity: 0.96,
  },
  label: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginTop: spacing.xs,
    lineHeight: 22,
  },
});
