import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

import { border, navy, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

import AppText from './AppText';

type LoadingStateProps = {
  message?: string;
  style?: ViewStyle;
};

export default function LoadingState({ message = 'Loading...', style }: LoadingStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.card}>
        <ActivityIndicator color={palette.accent} size="large" />
        {message ? (
          <AppText variant="body" tone="muted" style={styles.message}>
            {message}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: radii.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    minWidth: 220,
    borderWidth: 1,
    borderColor: border.light,
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
  },
});
