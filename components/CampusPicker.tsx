import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { CAMPUSES } from '@/constants/campuses';
import { border, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

type CampusPickerProps = {
  value: string;
  onChange: (campus: string) => void;
  error?: string;
};

export default function CampusPicker({ value, onChange, error }: CampusPickerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {CAMPUSES.map((campus) => {
          const selected = value === campus;

          return (
            <Pressable
              key={campus}
              onPress={() => onChange(campus)}
              style={[styles.chip, selected && styles.chipSelected]}>
              <AppText
                variant="caption"
                tone={selected ? 'inverse' : 'default'}
                style={!selected ? styles.chipIdle : undefined}>
                {campus}
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
