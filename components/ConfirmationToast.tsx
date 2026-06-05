import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui';
import { navy, palette } from '@/constants/colors';
import { radii, shadows, spacing } from '@/constants/theme';

type ConfirmationToastProps = {
  message: string;
  visible: boolean;
};

export default function ConfirmationToast({ message, visible }: ConfirmationToastProps) {
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={[styles.container, { bottom: insets.bottom + spacing.md }]}>
      <View style={styles.toast}>
        <AppText variant="body" tone="inverse" style={styles.message}>
          {message}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 1000,
  },
  toast: {
    backgroundColor: navy[700],
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: palette.accent,
    ...shadows.card,
  },
  message: {
    lineHeight: 22,
    textAlign: 'center',
  },
});
