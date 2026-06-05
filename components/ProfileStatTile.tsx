import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

type ProfileStatTileProps = {
  label: string;
  value: string;
  accent?: boolean;
};

export default function ProfileStatTile({ label, value, accent }: ProfileStatTileProps) {
  return (
    <View style={[styles.tile, accent && styles.tileAccent]}>
      <AppText variant="title" tone={accent ? 'inverse' : 'default'} style={styles.value}>
        {value}
      </AppText>
      <AppText variant="caption" tone={accent ? 'inverseMuted' : 'muted'} style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: palette.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  tileAccent: {
    backgroundColor: palette.accent,
  },
  value: {
    fontSize: 22,
  },
  label: {
    lineHeight: 16,
  },
});
