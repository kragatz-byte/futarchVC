import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { border, navy, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';

export type LeaderboardTab = 'forecasters' | 'active' | 'campus';

type LeaderboardTabBarProps = {
  activeTab: LeaderboardTab;
  onTabChange: (tab: LeaderboardTab) => void;
};

const TABS: { id: LeaderboardTab; label: string }[] = [
  { id: 'forecasters', label: 'Top Forecasters' },
  { id: 'active', label: 'Most Active' },
  { id: 'campus', label: 'Campus' },
];

export default function LeaderboardTabBar({ activeTab, onTabChange }: LeaderboardTabBarProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const selected = activeTab === tab.id;

        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            style={[styles.tab, selected && styles.tabSelected]}>
            <AppText
              variant="caption"
              tone={selected ? 'inverse' : 'inverseMuted'}
              style={[styles.tabLabel, selected && styles.tabLabelSelected]}>
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: navy[800],
    borderRadius: radii.md,
    padding: spacing.xs,
    gap: spacing.xs,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: border.dark,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.sm,
    alignItems: 'center',
  },
  tabSelected: {
    backgroundColor: palette.accent,
  },
  tabLabel: {
    textAlign: 'center',
    fontWeight: '600',
  },
  tabLabelSelected: {
    fontWeight: '700',
  },
});
