import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { navy, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

const PHASE_HINTS: Record<string, string> = {
  'Saving your startup...': 'Creating your listing with pending review status...',
  'Generating AI diligence...': 'Analyzing market, traction, and competitive landscape...',
  'Saving diligence report...': 'Storing bull/bear cases, risks, and investment memo...',
  'Finalizing analysis...': 'Marking your startup as analyzed and ready to view...',
};

type SubmissionLoadingOverlayProps = {
  visible: boolean;
  message?: string;
};

export default function SubmissionLoadingOverlay({
  visible,
  message = 'Generating AI diligence...',
}: SubmissionLoadingOverlayProps) {
  const hint = PHASE_HINTS[message] ?? 'Analyzing market, traction, and competitive landscape...';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ActivityIndicator color={palette.accent} size="large" />
          <AppText variant="subtitle" tone="inverse" style={styles.title}>
            {message}
          </AppText>
          <AppText variant="body" tone="inverseMuted" style={styles.subtitle}>
            {hint}
          </AppText>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 26, 51, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: navy[800],
    borderRadius: radii.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: palette.accent,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },
});
