import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText, PrimaryButton, SecondaryButton } from '@/components/ui';
import { palette } from '@/constants/colors';
import { radii, shadows, spacing } from '@/constants/theme';

type PlaceholderModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onClose: () => void;
};

export default function PlaceholderModal({
  visible,
  title,
  message,
  confirmLabel = 'Got it',
  onClose,
}: PlaceholderModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <AppText variant="title">{title}</AppText>
          <AppText variant="body" tone="muted" style={styles.message}>
            {message}
          </AppText>
          <PrimaryButton label={confirmLabel} onPress={onClose} fullWidth style={styles.primary} />
          <SecondaryButton label="Cancel" onPress={onClose} fullWidth />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: 'rgba(7, 26, 51, 0.72)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    backgroundColor: palette.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  message: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  primary: {
    marginBottom: spacing.sm,
  },
});
