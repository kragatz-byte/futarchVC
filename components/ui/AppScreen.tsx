import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/constants/colors';
import { spacing } from '@/constants/theme';

type AppScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
};

export default function AppScreen({
  children,
  scroll = false,
  padded = true,
  style,
  contentContainerStyle,
}: AppScreenProps) {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    padded && styles.padded,
    {
      paddingTop: insets.top + spacing.sm,
      paddingBottom: insets.bottom + spacing.md,
    },
    style,
  ];

  if (scroll) {
    return (
      <View style={styles.root}>
        <ScrollView
          style={containerStyle}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    );
  }

  return <View style={[styles.root, containerStyle]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.background,
  },
  container: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.md + 2,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
});
