import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import FormField from '@/components/FormField';
import SectionHeader from '@/components/SectionHeader';
import StagePicker from '@/components/StagePicker';
import SubmissionLoadingOverlay from '@/components/SubmissionLoadingOverlay';
import UploadPlaceholderButton from '@/components/UploadPlaceholderButton';
import {
  AppScreen,
  AppText,
  Card,
  CardSubtitle,
  CardTitle,
  PrimaryButton,
  SecondaryButton,
} from '@/components/ui';
import { brandCopy } from '@/constants/copy';
import { spacing } from '@/constants/theme';
import { validateSubmissionForm } from '@/lib/validateSubmission';
import { submitFounderStartup } from '@/services/startupRegistry';
import { EMPTY_SUBMISSION_FORM, type FounderSubmissionForm } from '@/types';
import type { StartupStage } from '@/types/startup';

export default function SubmitScreen() {
  const router = useRouter();
  const [form, setForm] = useState<FounderSubmissionForm>(EMPTY_SUBMISSION_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FounderSubmissionForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Generating AI diligence...');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = <K extends keyof FounderSubmissionForm>(
    key: K,
    value: FounderSubmissionForm[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleUploadPlaceholder = (assetType: 'deck' | 'logo') => {
    Alert.alert(
      'Upload coming soon',
      assetType === 'deck'
        ? 'Pitch deck uploads will be available when storage is connected.'
        : 'Logo uploads will be available when storage is connected.'
    );
  };

  const handleSubmit = async () => {
    const { errors: validationErrors, data } = validateSubmissionForm(form);

    if (!data) {
      setErrors(validationErrors);
      return;
    }

    setSubmitError(null);
    setLoadingMessage('Saving your startup...');
    setSubmitting(true);

    try {
      const result = await submitFounderStartup(data, {
        onPhase: (message) => setLoadingMessage(message),
      });

      if (result.warning) {
        Alert.alert(
          'Saved on this device',
          `Cloud sync failed (${result.warning}). Your startup and diligence are available locally.`,
          [{ text: 'OK', onPress: () => router.push(`/startup/${result.startup.id}`) }]
        );
        return;
      }

      router.push(`/startup/${result.startup.id}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong while submitting. Please try again.';
      setSubmitError(message);
      Alert.alert('Submission failed', message);
    } finally {
      setSubmitting(false);
      setLoadingMessage('Generating AI diligence...');
    }
  };

  return (
    <>
      <AppScreen scroll contentContainerStyle={styles.content}>
        <SectionHeader
          title="Submit"
          subtitle={brandCopy.submitTagline}
        />

        <Card variant="feed" style={styles.formCard}>
          <CardTitle>{brandCopy.submitAiLabel}</CardTitle>
          <CardSubtitle>{brandCopy.submitFlow}</CardSubtitle>

          <FormField
            label="Startup name *"
            value={form.name}
            onChangeText={(text) => updateField('name', text)}
            placeholder="e.g. QuadLink"
            error={errors.name}
          />

          <FormField
            label="Tagline *"
            value={form.tagline}
            onChangeText={(text) => updateField('tagline', text)}
            placeholder="One-line pitch"
            error={errors.tagline}
          />

          <FormField
            label="Description *"
            value={form.description}
            onChangeText={(text) => updateField('description', text)}
            placeholder="What are you building and why now?"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={styles.textArea}
            error={errors.description}
          />

          <FormField
            label="Website URL *"
            value={form.websiteUrl}
            onChangeText={(text) => updateField('websiteUrl', text)}
            placeholder="https://yourstartup.com"
            autoCapitalize="none"
            keyboardType="url"
            error={errors.websiteUrl}
          />

          <FormField
            label="Industry *"
            value={form.industry}
            onChangeText={(text) => updateField('industry', text)}
            placeholder="e.g. EdTech, Fintech, AI"
            error={errors.industry}
          />

          <View style={styles.fieldBlock}>
            <AppText variant="label" tone="muted">
              Stage *
            </AppText>
            <StagePicker
              value={form.stage}
              onChange={(stage: StartupStage) => updateField('stage', stage)}
              error={errors.stage}
            />
          </View>

          <View style={styles.moneyRow}>
            <View style={styles.moneyField}>
              <FormField
                label="Amount raising *"
                value={form.amountRaising}
                onChangeText={(text) => updateField('amountRaising', text)}
                placeholder="500K"
                keyboardType="default"
                error={errors.amountRaising}
                hint="Use 500K or 500000"
              />
            </View>
            <View style={styles.moneyField}>
              <FormField
                label="Valuation *"
                value={form.valuation}
                onChangeText={(text) => updateField('valuation', text)}
                placeholder="3M"
                keyboardType="default"
                error={errors.valuation}
                hint="Post-money"
              />
            </View>
          </View>

          <FormField
            label="Traction *"
            value={form.traction}
            onChangeText={(text) => updateField('traction', text)}
            placeholder="Users, revenue, pilots, retention..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textArea}
            error={errors.traction}
          />

          <View style={styles.moneyRow}>
            <View style={styles.moneyField}>
              <FormField
                label="Founder name *"
                value={form.founderName}
                onChangeText={(text) => updateField('founderName', text)}
                placeholder="Your name"
                error={errors.founderName}
              />
            </View>
            <View style={styles.moneyField}>
              <FormField
                label="Founder email *"
                value={form.founderEmail}
                onChangeText={(text) => updateField('founderEmail', text)}
                placeholder="you@university.edu"
                autoCapitalize="none"
                keyboardType="email-address"
                error={errors.founderEmail}
              />
            </View>
          </View>

          <AppText variant="label" tone="muted" style={styles.uploadLabel}>
            Optional uploads
          </AppText>
          <View style={styles.uploadRow}>
            <UploadPlaceholderButton
              label="Upload Pitch Deck"
              onPress={() => handleUploadPlaceholder('deck')}
            />
            <UploadPlaceholderButton
              label="Upload Logo"
              onPress={() => handleUploadPlaceholder('logo')}
            />
          </View>

          {submitError ? (
            <View style={styles.errorBanner}>
              <AppText variant="body" tone="risk">
                {submitError}
              </AppText>
            </View>
          ) : null}

          <PrimaryButton
            label="Submit for AI diligence"
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
            fullWidth
            style={styles.submitButton}
          />
          <SecondaryButton
            label="Clear form"
            onPress={() => {
              setForm(EMPTY_SUBMISSION_FORM);
              setErrors({});
            }}
            fullWidth
          />
        </Card>
      </AppScreen>

      <SubmissionLoadingOverlay visible={submitting} message={loadingMessage} />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  formCard: {
    gap: spacing.md,
    padding: spacing.md,
  },
  fieldBlock: {
    gap: spacing.xs,
  },
  textArea: {
    minHeight: 112,
    paddingTop: spacing.sm + 2,
  },
  moneyRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  moneyField: {
    flex: 1,
  },
  uploadLabel: {
    marginTop: spacing.xs,
  },
  uploadRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  errorBanner: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.35)',
  },
});
