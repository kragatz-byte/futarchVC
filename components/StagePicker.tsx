import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { border, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import type { StartupStage } from '@/types';

const STAGES: { value: StartupStage; label: string }[] = [
  { value: 'idea', label: 'Idea' },
  { value: 'mvp', label: 'MVP' },
  { value: 'pre-seed', label: 'Pre-seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'early-revenue', label: 'Early revenue' },
];

type StagePickerProps = {
  value: StartupStage | '';
  onChange: (stage: StartupStage) => void;
  error?: string;
};

export default function StagePicker({ value, onChange, error }: StagePickerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {STAGES.map((stage) => {
          const selected = value === stage.value;

          return (
            <Pressable
              key={stage.value}
              onPress={() => onChange(stage.value)}
              style={[styles.chip, selected && styles.chipSelected]}>
              <AppText
                variant="caption"
                tone={selected ? 'inverse' : 'default'}
                style={!selected ? styles.chipIdle : undefined}>
                {stage.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <AppText variant="caption" tone="risk">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: border.light,
    backgroundColor: palette.offWhite,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  chipSelected: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
  },
  chipIdle: {
    color: palette.background,
    fontWeight: '600',
  },
});
