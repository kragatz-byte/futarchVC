import { StyleSheet, View, ViewStyle } from 'react-native';

import { border, navy, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

import AppText from './AppText';
import PrimaryButton from './PrimaryButton';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconRing}>
        <View style={styles.iconDot} />
      </View>
      <AppText variant="title" tone="inverse" style={styles.title}>
        {title}
      </AppText>
      {description ? (
        <AppText variant="body" tone="inverseMuted" style={styles.description}>
          {description}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  iconRing: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: border.dark,
    backgroundColor: navy[800],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  iconDot: {
    width: 12,
    height: 12,
    borderRadius: radii.full,
    backgroundColor: palette.accent,
    opacity: 0.7,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 23,
    maxWidth: 280,
  },
  action: {
    marginTop: spacing.sm,
    minWidth: 200,
  },
});
