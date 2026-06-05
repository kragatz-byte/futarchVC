import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { border } from '@/constants/colors';
import { spacing } from '@/constants/theme';

type DetailSectionHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

export default function DetailSectionHeader({
  title,
  subtitle,
  eyebrow,
}: DetailSectionHeaderProps) {
  return (
    <View style={styles.container}>
      {eyebrow ? (
        <AppText variant="label" tone="inverseMuted" style={styles.eyebrow}>
          {eyebrow}
        </AppText>
      ) : null}
      <AppText variant="title" tone="inverse">
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="body" tone="inverseMuted" style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  eyebrow: {
    marginBottom: 2,
  },
  subtitle: {
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  rule: {
    height: 1,
    backgroundColor: border.dark,
    marginTop: spacing.sm,
  },
});
