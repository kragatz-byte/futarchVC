import { StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { AppText, Card, CardSubtitle, CardTitle } from '@/components/ui';
import { palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import { formatRelativeDate } from '@/lib/format';
import type { ProfileActivityItem, ProfileActivityType } from '@/types';

type RecentActivityListProps = {
  items: ProfileActivityItem[];
};

const ACTIVITY_META = {
  forecast: {
    icon: { ios: 'chart.line.uptrend.xyaxis', android: 'trending_up', web: 'trending_up' },
    color: palette.accent,
    label: 'Forecast',
  },
  invest: {
    icon: { ios: 'arrow.up.circle.fill', android: 'north_east', web: 'north_east' },
    color: palette.success,
    label: 'Invest',
  },
  pass: {
    icon: { ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' },
    color: palette.muted,
    label: 'Pass',
  },
  watchlist: {
    icon: { ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' },
    color: '#F59E0B',
    label: 'Watchlist',
  },
} as const satisfies Record<
  ProfileActivityType,
  { icon: { ios: string; android: string; web: string }; color: string; label: string }
>;

export default function RecentActivityList({ items }: RecentActivityListProps) {
  return (
    <Card style={styles.card}>
      <CardTitle>Recent activity</CardTitle>
      <CardSubtitle>Your latest moves on the platform</CardSubtitle>

      <View style={styles.list}>
        {items.map((item, index) => {
          const meta = ACTIVITY_META[item.type];

          return (
            <View
              key={item.id}
              style={[styles.row, index < items.length - 1 && styles.rowBorder]}>
              <View style={[styles.iconWrap, { backgroundColor: `${meta.color}18` }]}>
                <SymbolView name={meta.icon} size={18} tintColor={meta.color} />
              </View>
              <View style={styles.copy}>
                <View style={styles.titleRow}>
                  <AppText variant="subtitle">{item.startupName}</AppText>
                  <AppText variant="caption" tone="accent">
                    {meta.label}
                  </AppText>
                </View>
                <AppText variant="body" tone="muted" numberOfLines={2}>
                  {item.summary}
                </AppText>
                <AppText variant="caption" tone="muted">
                  {formatRelativeDate(item.createdAt)}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  list: {
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
});
