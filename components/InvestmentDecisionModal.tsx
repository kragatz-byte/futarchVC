import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, PrimaryButton } from '@/components/ui';
import { border, navy, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import type { DecisionModalMode } from '@/contexts/DecisionContext';
import type { InvestmentDecisionType, Startup } from '@/types';

type InvestmentDecisionModalProps = {
  visible: boolean;
  startup: Startup | null;
  mode: DecisionModalMode;
  initialDecision: InvestmentDecisionType | null;
  onClose: () => void;
  onSubmitDecision: (input: {
    decision: InvestmentDecisionType;
    conviction: number;
    reasoning?: string;
  }) => Promise<void>;
  onSubmitWatchlist: (input: {
    lean: InvestmentDecisionType;
    conviction: number;
    reasoning?: string;
  }) => Promise<void>;
};

export default function InvestmentDecisionModal({
  visible,
  startup,
  mode,
  initialDecision,
  onClose,
  onSubmitDecision,
  onSubmitWatchlist,
}: InvestmentDecisionModalProps) {
  const insets = useSafeAreaInsets();
  const [decision, setDecision] = useState<InvestmentDecisionType>('invest');
  const [conviction, setConviction] = useState(65);
  const [reasoning, setReasoning] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) return;

    setDecision(initialDecision ?? 'invest');
    setConviction(initialDecision === 'pass' ? 45 : 65);
    setReasoning('');
    setSubmitting(false);
  }, [visible, initialDecision, startup?.id]);

  const title = useMemo(() => {
    if (!startup) return 'Record decision';

    if (mode === 'watchlist') {
      return `Watchlist ${startup.name}`;
    }

    return initialDecision === 'pass' ? `Pass on ${startup.name}` : `Invest in ${startup.name}`;
  }, [initialDecision, mode, startup]);

  const subtitle = useMemo(() => {
    if (mode === 'watchlist') {
      return 'Save this startup with your lean, conviction, and optional notes.';
    }

    return 'Human invest/pass with conviction. AI diligence informs you; it does not decide for you.';
  }, [mode]);

  const submitLabel = mode === 'watchlist' ? 'Save to Watchlist' : 'Submit Decision';

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      if (mode === 'watchlist') {
        await onSubmitWatchlist({
          lean: decision,
          conviction: Math.round(conviction),
          reasoning,
        });
      } else {
        await onSubmitDecision({
          decision,
          conviction: Math.round(conviction),
          reasoning,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!startup) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close modal" />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
            <View style={styles.handle} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}>
              <AppText variant="title">{title}</AppText>
              <AppText variant="body" tone="muted" style={styles.subtitle}>
                {subtitle}
              </AppText>

              <AppText variant="label" tone="muted" style={styles.sectionLabel}>
                Decision
              </AppText>
              <View style={styles.decisionRow}>
                <DecisionOption
                  label="Invest"
                  selected={decision === 'invest'}
                  tone="success"
                  onPress={() => setDecision('invest')}
                />
                <DecisionOption
                  label="Pass"
                  selected={decision === 'pass'}
                  tone="muted"
                  onPress={() => setDecision('pass')}
                />
              </View>

              <View style={styles.convictionHeader}>
                <AppText variant="label" tone="muted">
                  Conviction
                </AppText>
                <View style={styles.convictionBadge}>
                  <AppText variant="subtitle" tone="inverse">
                    {Math.round(conviction)}
                  </AppText>
                </View>
              </View>

              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={100}
                step={1}
                value={conviction}
                onValueChange={setConviction}
                minimumTrackTintColor={palette.accent}
                maximumTrackTintColor={border.light}
                thumbTintColor={palette.accent}
              />

              <View style={styles.sliderLabels}>
                <AppText variant="caption" tone="muted">
                  Low
                </AppText>
                <AppText variant="caption" tone="muted">
                  High
                </AppText>
              </View>

              <AppText variant="label" tone="muted" style={styles.sectionLabel}>
                Reasoning (optional)
              </AppText>
              <TextInput
                value={reasoning}
                onChangeText={setReasoning}
                placeholder="What shaped your view?"
                placeholderTextColor={palette.muted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={styles.input}
              />

              <PrimaryButton
                label={submitLabel}
                onPress={handleSubmit}
                loading={submitting}
                fullWidth
                style={styles.submitButton}
              />
              <Pressable onPress={onClose} style={styles.cancelButton}>
                <AppText variant="body" tone="muted" style={styles.cancelLabel}>
                  Cancel
                </AppText>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function DecisionOption({
  label,
  selected,
  tone,
  onPress,
}: {
  label: string;
  selected: boolean;
  tone: 'success' | 'muted';
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.decisionOption,
        selected && styles.decisionOptionSelected,
        selected && tone === 'success' && styles.decisionOptionInvest,
        selected && tone === 'muted' && styles.decisionOptionPass,
      ]}>
      <AppText
        variant="subtitle"
        tone={selected ? 'inverse' : 'default'}
        style={!selected ? styles.decisionOptionIdle : undefined}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(7, 26, 51, 0.55)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: palette.card,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    maxHeight: '90%',
    paddingTop: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: radii.full,
    backgroundColor: border.light,
    marginBottom: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  sectionLabel: {
    marginBottom: spacing.sm,
  },
  decisionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  decisionOption: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: border.light,
    backgroundColor: palette.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decisionOptionSelected: {
    borderColor: 'transparent',
  },
  decisionOptionInvest: {
    backgroundColor: palette.success,
  },
  decisionOptionPass: {
    backgroundColor: navy[600],
  },
  decisionOptionIdle: {
    color: palette.background,
  },
  convictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  convictionBadge: {
    backgroundColor: palette.accent,
    borderRadius: radii.full,
    minWidth: 44,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  input: {
    minHeight: 108,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: border.light,
    backgroundColor: palette.offWhite,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    lineHeight: 22,
    color: palette.background,
    marginBottom: spacing.lg,
  },
  submitButton: {
    marginBottom: spacing.sm,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  cancelLabel: {
    textAlign: 'center',
  },
});
