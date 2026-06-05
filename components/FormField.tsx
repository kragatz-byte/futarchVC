import { ReactNode } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { AppText } from '@/components/ui';
import { border, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
  children?: ReactNode;
};

export default function FormField({
  label,
  error,
  hint,
  children,
  style,
  ...inputProps
}: FormFieldProps) {
  return (
    <View style={styles.field}>
      <AppText variant="label" tone="muted">
        {label}
      </AppText>
      {children ?? (
        <TextInput
          placeholderTextColor={palette.muted}
          style={[styles.input, error && styles.inputError, style]}
          {...inputProps}
        />
      )}
      {hint && !error ? (
        <AppText variant="caption" tone="muted">
          {hint}
        </AppText>
      ) : null}
      {error ? (
        <AppText variant="caption" tone="risk">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  input: {
    backgroundColor: palette.offWhite,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    lineHeight: 22,
    color: palette.background,
    borderWidth: 1,
    borderColor: border.light,
  },
  inputError: {
    borderColor: palette.risk,
  },
});
