import { Pressable, StyleSheet, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import StartupLogo from '@/components/StartupLogo';
import StartupScoreCorner from '@/components/StartupScoreCorner';
import { AppText, Card, TagChip } from '@/components/ui';
import { border, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import { formatCurrency } from '@/lib/format';
import type { Startup } from '@/types';

type StartupOverviewCardProps = {
  startup: Startup;
};

function formatWebsite(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export default function StartupOverviewCard({ startup }: StartupOverviewCardProps) {
  const openWebsite = () => {
    WebBrowser.openBrowserAsync(startup.websiteUrl);
  };

  return (
    <Card variant="feed" style={styles.card}>
      <View style={styles.heroRow}>
        <StartupLogo
          name={startup.name}
          startupId={startup.id}
          industry={startup.industry}
          logoUrl={startup.logoUrl}
          size="lg"
        />
        <View style={styles.heroCopy}>
          <AppText variant="title">{startup.name}</AppText>
          <AppText variant="body" tone="muted">
            {startup.tagline}
          </AppText>
        </View>
        <StartupScoreCorner aiScore={startup.aiScore} startup={startup} size="lg" />
      </View>

      <View style={styles.chips}>
        <TagChip label={startup.industry} tone="accent" />
      </View>

      <AppText variant="body" tone="muted" style={styles.description}>
        {startup.description}
      </AppText>

      <View style={styles.factsGrid}>
        <FactTile label="Raising" value={formatCurrency(startup.amountRaising)} />
        <FactTile label="Valuation" value={formatCurrency(startup.valuation)} />
        <FactTile label="Founder" value={startup.founderName} />
        <FactTile label="Traction" value={startup.traction} multiline />
      </View>

      <Pressable onPress={openWebsite} style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}>
        <AppText variant="label" tone="muted">
          Website
        </AppText>
        <AppText variant="body" tone="accent">
          {formatWebsite(startup.websiteUrl)}
        </AppText>
      </Pressable>
    </Card>
  );
}

function FactTile({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <View style={[styles.factTile, multiline && styles.factTileWide]}>
      <AppText variant="label" tone="muted" style={styles.factLabel}>
        {label}
      </AppText>
      <AppText variant="body" tone="default" style={multiline && styles.multiline}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  heroRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  heroCopy: {
    flex: 1,
    gap: spacing.xs,
    paddingTop: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  description: {
    lineHeight: 23,
  },
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  factTile: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: palette.offWhite,
    borderRadius: radii.md,
    padding: spacing.sm + 2,
    gap: 4,
    borderWidth: 1,
    borderColor: border.subtle,
  },
  factTileWide: {
    width: '100%',
  },
  factLabel: {
    fontSize: 10,
  },
  multiline: {
    lineHeight: 22,
  },
  linkRow: {
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: border.light,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.85,
  },
});
