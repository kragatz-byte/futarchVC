import { ReactNode, useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { AppText, Card } from '@/components/ui';
import { border, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AccordionSectionProps = {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  tone?: 'default' | 'success' | 'warning';
};

export default function AccordionSection({
  title,
  children,
  defaultExpanded = false,
  tone = 'default',
}: AccordionSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((current) => !current);
  };

  return (
    <Card variant="flat" style={styles.card}>
      <Pressable
        onPress={toggle}
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
        accessibilityRole="button"
        accessibilityState={{ expanded }}>
        <View style={styles.titleRow}>
          {tone !== 'default' ? <View style={[styles.toneDot, styles[`${tone}Dot`]]} /> : null}
          <AppText variant="subtitle">{title}</AppText>
        </View>
        <SymbolView
          name={{
            ios: expanded ? 'chevron.up' : 'chevron.down',
            android: expanded ? 'expand_less' : 'expand_more',
            web: expanded ? 'expand_less' : 'expand_more',
          }}
          size={18}
          tintColor={palette.muted}
        />
      </Pressable>

      {expanded ? <View style={styles.content}>{children}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  headerPressed: {
    backgroundColor: palette.offWhite,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    paddingRight: spacing.sm,
  },
  toneDot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
  },
  successDot: {
    backgroundColor: palette.success,
  },
  warningDot: {
    backgroundColor: palette.warning,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: border.light,
  },
});
