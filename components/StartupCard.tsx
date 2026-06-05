import { Pressable, StyleSheet, View } from 'react-native';

import FeedActionButton from '@/components/FeedActionButton';
import StartupLogo from '@/components/StartupLogo';
import StartupScoreCorner from '@/components/StartupScoreCorner';
import { AppText, Card, PrimaryButton, TagChip } from '@/components/ui';
import { border, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import { formatCurrency } from '@/lib/format';
import type { Startup } from '@/types';

export type StartupCardAction = 'invest' | 'pass' | 'forecast';

type StartupCardProps = {
  startup: Startup;
  onPress: () => void;
  onViewDiligence: () => void;
  onAction: (action: StartupCardAction) => void;
};

export default function StartupCard({
  startup,
  onPress,
  onViewDiligence,
  onAction,
}: StartupCardProps) {
  return (
    <Card variant="feed" style={styles.card}>
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
        <View style={styles.topRow}>
          <StartupLogo
            name={startup.name}
            startupId={startup.id}
            industry={startup.industry}
            logoUrl={startup.logoUrl}
          />
          <View style={styles.identity}>
            <AppText variant="subtitle" style={styles.name}>
              {startup.name}
            </AppText>
            <AppText variant="body" tone="muted" numberOfLines={2} style={styles.tagline}>
              {startup.tagline}
            </AppText>
          </View>
          <StartupScoreCorner aiScore={startup.aiScore} startup={startup} size="md" />
        </View>

        <View style={styles.chips}>
          <TagChip label={startup.industry} tone="accent" />
        </View>

        <View style={styles.dealStrip}>
          <DealCell label="Raising" value={formatCurrency(startup.amountRaising)} />
          <View style={styles.dealDivider} />
          <DealCell label="Valuation" value={formatCurrency(startup.valuation)} />
        </View>

        <AppText variant="body" tone="muted" numberOfLines={2} style={styles.description}>
          {startup.description}
        </AppText>
      </Pressable>

      <View style={styles.actions}>
        <PrimaryButton label="View diligence" onPress={onViewDiligence} fullWidth />
        <View style={styles.actionRow}>
          <FeedActionButton label="Invest" variant="success" onPress={() => onAction('invest')} />
          <FeedActionButton label="Pass" variant="muted" onPress={() => onAction('pass')} />
          <FeedActionButton label="Forecast" variant="outline" onPress={() => onAction('forecast')} />
        </View>
      </View>
    </Card>
  );
}

function DealCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.dealCell}>
      <AppText variant="label" tone="muted" style={styles.dealLabel}>
        {label}
      </AppText>
      <AppText variant="subtitle">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.97,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  identity: {
    flex: 1,
    gap: 4,
    paddingTop: 2,
  },
  name: {
    letterSpacing: -0.2,
  },
  tagline: {
    lineHeight: 21,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dealStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: border.light,
    overflow: 'hidden',
  },
  dealCell: {
    flex: 1,
    padding: spacing.sm + 2,
    gap: 4,
    backgroundColor: palette.card,
  },
  dealLabel: {
    fontSize: 10,
  },
  dealDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: border.light,
  },
  description: {
    lineHeight: 22,
    fontSize: 14,
  },
  actions: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: border.light,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
