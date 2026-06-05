import { Pressable, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { AppText } from '@/components/ui';
import { border, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

type UploadPlaceholderButtonProps = {
  label: string;
  onPress?: () => void;
};

export default function UploadPlaceholderButton({
  label,
  onPress,
}: UploadPlaceholderButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <SymbolView
        name={{ ios: 'arrow.up.doc', android: 'upload', web: 'upload' }}
        size={20}
        tintColor={palette.accent}
      />
      <AppText variant="body" tone="accent" style={styles.label}>
        {label}
      </AppText>
      <AppText variant="caption" tone="muted">
        Coming soon
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 88,
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: border.light,
    backgroundColor: palette.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.md,
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: '#EFF6FF',
  },
  label: {
    fontWeight: '600',
  },
});
