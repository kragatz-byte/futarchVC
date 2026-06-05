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
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, PrimaryButton } from '@/components/ui';
import { border, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import type {
  ForecastAnswer,
  ForecastQuestion,
  ForecastQuestionId,
  Startup,
  StartupForecastSubmission,
} from '@/types';
import { FORECAST_QUESTIONS } from '@/types/forecast';

type QuestionDraft = {
  selected: boolean;
  probability: number;
  reasoning: string;
};

type QuestionDrafts = Record<ForecastQuestionId, QuestionDraft>;

const defaultDrafts = (): QuestionDrafts =>
  FORECAST_QUESTIONS.reduce(
    (acc, question) => ({
      ...acc,
      [question.id]: { selected: false, probability: 50, reasoning: '' },
    }),
    {} as QuestionDrafts
  );

function draftsFromSubmission(submission?: StartupForecastSubmission): QuestionDrafts {
  const drafts = defaultDrafts();

  if (!submission) return drafts;

  submission.answers.forEach((answer) => {
    drafts[answer.questionId] = {
      selected: true,
      probability: answer.probability,
      reasoning: answer.reasoning ?? '',
    };
  });

  return drafts;
}

type ForecastModalProps = {
  visible: boolean;
  startup: Startup | null;
  existingSubmission?: StartupForecastSubmission;
  onClose: () => void;
  onSubmit: (answers: ForecastAnswer[]) => Promise<void>;
};

export default function ForecastModal({
  visible,
  startup,
  existingSubmission,
  onClose,
  onSubmit,
}: ForecastModalProps) {
  const insets = useSafeAreaInsets();
  const [drafts, setDrafts] = useState<QuestionDrafts>(defaultDrafts);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;

    setDrafts(draftsFromSubmission(existingSubmission));
    setSubmitting(false);
    setError(null);
  }, [visible, existingSubmission, startup?.id]);

  const selectedCount = useMemo(
    () => FORECAST_QUESTIONS.filter((question) => drafts[question.id].selected).length,
    [drafts]
  );

  const updateDraft = (questionId: ForecastQuestionId, patch: Partial<QuestionDraft>) => {
    setDrafts((current) => ({
      ...current,
      [questionId]: { ...current[questionId], ...patch },
    }));
    setError(null);
  };

  const toggleQuestion = (questionId: ForecastQuestionId) => {
    setDrafts((current) => ({
      ...current,
      [questionId]: {
        ...current[questionId],
        selected: !current[questionId].selected,
      },
    }));
    setError(null);
  };

  const handleSubmit = async () => {
    const answers: ForecastAnswer[] = FORECAST_QUESTIONS.filter(
      (question) => drafts[question.id].selected
    ).map((question) => {
      const draft = drafts[question.id];
      return {
        questionId: question.id,
        probability: Math.round(draft.probability),
        reasoning: draft.reasoning.trim() || undefined,
      };
    });

    if (answers.length === 0) {
      setError('Select at least one question to forecast.');
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(answers);
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
              <AppText variant="title">Forecast {startup.name}</AppText>

              <View style={styles.callout}>
                <AppText variant="body" tone="muted" style={styles.calloutText}>
                  Record calibrated probabilities (and optional reasoning). Leaderboard reputation
                  reflects forecasting activity — outcomes resolve later.
                </AppText>
              </View>

              <AppText variant="label" tone="muted" style={styles.sectionLabel}>
                Select questions ({selectedCount} selected)
              </AppText>

              {FORECAST_QUESTIONS.map((question) => (
                <ForecastQuestionCard
                  key={question.id}
                  question={question}
                  draft={drafts[question.id]}
                  onToggle={() => toggleQuestion(question.id)}
                  onUpdate={(patch) => updateDraft(question.id, patch)}
                />
              ))}

              {error ? (
                <AppText variant="caption" tone="risk" style={styles.error}>
                  {error}
                </AppText>
              ) : null}

              <PrimaryButton
                label={selectedCount > 0 ? `Submit ${selectedCount} Forecasts` : 'Submit Forecasts'}
                onPress={handleSubmit}
                loading={submitting}
                disabled={selectedCount === 0}
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

function ForecastQuestionCard({
  question,
  draft,
  onToggle,
  onUpdate,
}: {
  question: ForecastQuestion;
  draft: QuestionDraft;
  onToggle: () => void;
  onUpdate: (patch: Partial<QuestionDraft>) => void;
}) {
  return (
    <View style={[styles.questionCard, draft.selected && styles.questionCardSelected]}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [styles.questionHeader, pressed && styles.questionHeaderPressed]}>
        <View style={[styles.checkbox, draft.selected && styles.checkboxSelected]}>
          {draft.selected ? (
            <SymbolView
              name={{ ios: 'checkmark', android: 'check', web: 'check' }}
              size={14}
              tintColor={palette.white}
            />
          ) : null}
        </View>
        <AppText variant="body" style={styles.questionLabel}>
          {question.label}
        </AppText>
      </Pressable>

      {draft.selected ? (
        <View style={styles.questionBody}>
          <View style={styles.probabilityHeader}>
            <AppText variant="caption" tone="muted">
              Probability
            </AppText>
            <View style={styles.probabilityBadge}>
              <AppText variant="subtitle" tone="inverse">
                {Math.round(draft.probability)}%
              </AppText>
            </View>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={draft.probability}
            onValueChange={(value) => onUpdate({ probability: value })}
            minimumTrackTintColor={palette.accent}
            maximumTrackTintColor={border.light}
            thumbTintColor={palette.accent}
          />

          <View style={styles.sliderLabels}>
            <AppText variant="caption" tone="muted">
              0%
            </AppText>
            <AppText variant="caption" tone="muted">
              100%
            </AppText>
          </View>

          <AppText variant="caption" tone="muted" style={styles.reasoningLabel}>
            Reasoning (optional)
          </AppText>
          <TextInput
            value={draft.reasoning}
            onChangeText={(text) => onUpdate({ reasoning: text })}
            placeholder="What signals inform this forecast?"
            placeholderTextColor={palette.muted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={styles.input}
          />
        </View>
      ) : null}
    </View>
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
    maxHeight: '92%',
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
  callout: {
    backgroundColor: palette.offWhite,
    borderRadius: radii.md,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: border.light,
  },
  calloutText: {
    lineHeight: 22,
  },
  sectionLabel: {
    marginBottom: spacing.sm,
  },
  questionCard: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: border.light,
    backgroundColor: palette.card,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  questionCardSelected: {
    borderColor: palette.accent,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
  },
  questionHeaderPressed: {
    backgroundColor: palette.offWhite,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: border.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxSelected: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
  },
  questionLabel: {
    flex: 1,
    lineHeight: 22,
    color: palette.background,
  },
  questionBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: border.light,
  },
  probabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  probabilityBadge: {
    backgroundColor: palette.accent,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minWidth: 52,
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 36,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  reasoningLabel: {
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: 80,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: border.light,
    backgroundColor: palette.offWhite,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    lineHeight: 22,
    color: palette.background,
  },
  error: {
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: spacing.sm,
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
