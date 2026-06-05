import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { productCapabilities } from '@/constants/copy';
import { palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

export default function ProductCapabilities() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {productCapabilities.map((item) => (
          <View key={item.id} style={styles.pill}>
            <AppText style={styles.emoji}>{item.emoji}</AppText>
            <AppText variant="caption" tone="inverse" style={styles.pillLabel}>
              {item.label}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: palette.cuteMuted,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 3,
    borderWidth: 1,
    borderColor: palette.cuteBorder,
  },
  emoji: {
    fontSize: 13,
    lineHeight: 16,
  },
  pillLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
