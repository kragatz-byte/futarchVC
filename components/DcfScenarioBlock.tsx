import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { border, palette } from '@/constants/colors';
import { formatCurrency } from '@/lib/format';
import { radii, spacing } from '@/constants/theme';
import type { SimulatedDcfScenario } from '@/types/dcf';

type DcfScenarioBlockProps = {
  scenario: SimulatedDcfScenario;
  tone?: 'success' | 'warning';
};

export default function DcfScenarioBlock({ scenario, tone = 'success' }: DcfScenarioBlockProps) {
  const labelTone = tone === 'success' ? 'success' : 'warning';

  return (
    <View style={styles.wrap}>
      <AppText variant="label" tone={labelTone} style={styles.heading}>
        Simulated {scenario.scenario} case DCF (5-year, demo model)
      </AppText>
      <View style={styles.summaryRow}>
        <Metric label="WACC" value={`${scenario.waccPct}%`} />
        <Metric label="Terminal g" value={`${scenario.terminalGrowthPct}%`} />
        <Metric label="MOIC" value={`${scenario.moicOnRound.toFixed(1)}x`} />
      </View>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Cell flex={0.6} text="Yr" header />
          <Cell flex={1.4} text="Revenue" header />
          <Cell flex={0.9} text="EBITDA%" header />
          <Cell flex={1.2} text="FCF" header />
          <Cell flex={1.2} text="PV" header />
        </View>
        {scenario.years.map((row) => (
          <View key={row.year} style={styles.tableRow}>
            <Cell flex={0.6} text={`${row.year}`} />
            <Cell flex={1.4} text={formatCurrency(row.revenue)} />
            <Cell flex={0.9} text={`${row.ebitdaMarginPct}%`} />
            <Cell flex={1.2} text={formatCurrency(row.fcf)} />
            <Cell flex={1.2} text={formatCurrency(row.pvFcf)} />
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <AppText variant="caption" tone="muted">
          EV {formatCurrency(scenario.enterpriseValue)} · Equity{' '}
          {formatCurrency(scenario.equityValue)} · vs post-money{' '}
          {formatCurrency(scenario.postMoneyValuation)}
        </AppText>
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
      <AppText variant="subtitle">{value}</AppText>
    </View>
  );
}

function Cell({
  text,
  flex,
  header,
}: {
  text: string;
  flex: number;
  header?: boolean;
}) {
  return (
    <View style={[styles.cell, { flex }]}>
      <AppText
        variant="caption"
        tone={header ? 'muted' : 'default'}
        style={header ? styles.headerText : styles.cellText}
        numberOfLines={1}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  heading: {
    marginBottom: spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metric: {
    flex: 1,
    backgroundColor: palette.offWhite,
    borderRadius: radii.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: border.light,
    gap: 2,
  },
  table: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: border.light,
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: palette.offWhite,
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: border.light,
  },
  cell: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: '700',
    fontSize: 10,
  },
  cellText: {
    fontSize: 10,
  },
  footer: {
    marginTop: spacing.xs,
  },
});
