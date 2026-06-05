import { formatCurrency, formatPercent } from '@/lib/format';
import type { SimulatedDcfScenario, DcfProjectionYear } from '@/types/dcf';
import type { FounderSubmissionInput } from '@/types';

const STAGE_BASE_REVENUE: Record<FounderSubmissionInput['stage'], number> = {
  idea: 0,
  mvp: 120_000,
  'pre-seed': 350_000,
  seed: 900_000,
  'early-revenue': 2_400_000,
};

const BULL_GROWTH = [0.95, 0.72, 0.52, 0.38, 0.28];
const BEAR_GROWTH = [0.32, 0.18, 0.12, 0.08, 0.05];

function discountFactor(wacc: number, year: number): number {
  return 1 / Math.pow(1 + wacc, year);
}

function projectYears(
  baseRevenue: number,
  growthRates: number[],
  marginPath: number[],
  wacc: number
): { years: DcfProjectionYear[]; pvSum: number; terminalFcf: number } {
  let revenue = Math.max(baseRevenue, 50_000);
  const years: DcfProjectionYear[] = [];
  let pvSum = 0;

  for (let i = 0; i < 5; i++) {
    if (i > 0) revenue *= 1 + growthRates[i - 1];
    const margin = marginPath[i] ?? marginPath[marginPath.length - 1];
    const fcf = revenue * (margin / 100) * 0.82;
    const df = discountFactor(wacc, i + 1);
    const pv = fcf * df;
    pvSum += pv;
    years.push({
      year: i + 1,
      revenue,
      ebitdaMarginPct: margin,
      fcf,
      discountFactor: df,
      pvFcf: pv,
    });
  }

  const last = years[years.length - 1];
  return { years, pvSum, terminalFcf: last?.fcf ?? 0 };
}

function terminalValue(terminalFcf: number, wacc: number, terminalGrowth: number): number {
  const spread = wacc - terminalGrowth;
  if (spread <= 0.01) return terminalFcf * 12;
  return (terminalFcf * (1 + terminalGrowth)) / spread;
}

export function buildSimulatedDcfScenarios(input: {
  name: string;
  stage: FounderSubmissionInput['stage'];
  amountRaising: number;
  valuation: number;
  industry: string;
}): { bull: SimulatedDcfScenario; bear: SimulatedDcfScenario } {
  const baseRevenue = STAGE_BASE_REVENUE[input.stage];
  const waccBull = 0.14;
  const waccBear = 0.19;
  const tgBull = 0.03;
  const tgBear = 0.015;
  const ownership = input.valuation > 0 ? input.amountRaising / input.valuation : 0.15;

  const bullMargins = [8, 14, 22, 28, 32];
  const bearMargins = [5, 8, 10, 11, 12];

  const bullProj = projectYears(baseRevenue, BULL_GROWTH, bullMargins, waccBull);
  const bearProj = projectYears(
    baseRevenue * 0.85,
    BEAR_GROWTH,
    bearMargins,
    waccBear
  );

  const bullTv = terminalValue(bullProj.terminalFcf, waccBull, tgBull);
  const bearTv = terminalValue(bearProj.terminalFcf, waccBear, tgBear);
  const bullEv =
    bullProj.pvSum + bullTv * discountFactor(waccBull, 5);
  const bearEv =
    bearProj.pvSum + bearTv * discountFactor(waccBear, 5);

  const netDebt = 0;
  const bullEquity = bullEv - netDebt;
  const bearEquity = Math.max(bearEv - netDebt, input.valuation * 0.35);

  const bullMoic = ownership > 0 ? (bullEquity * ownership) / input.amountRaising : 2.5;
  const bearMoic = ownership > 0 ? (bearEquity * ownership) / input.amountRaising : 0.6;

  const bull: SimulatedDcfScenario = {
    scenario: 'bull',
    waccPct: waccBull * 100,
    terminalGrowthPct: tgBull * 100,
    years: bullProj.years,
    pvOperatingCashFlows: bullProj.pvSum,
    terminalFcf: bullProj.terminalFcf,
    terminalValue: bullTv,
    enterpriseValue: bullEv,
    netDebt,
    equityValue: bullEquity,
    postMoneyValuation: input.valuation,
    moicOnRound: Math.round(bullMoic * 10) / 10,
    impliedReturnIrrPct: Math.min(85, Math.round((Math.pow(bullMoic, 1 / 5) - 1) * 100)),
    assumptions: [
      `Simulated model calibrated to ${input.stage} stage and ${input.industry} comps (demo assumptions).`,
      `Base year revenue anchor ${formatCurrency(baseRevenue || 120_000)} scaling with founder traction narrative.`,
      `WACC ${formatPercent(waccBull * 100)} reflects early-stage equity risk; terminal growth ${formatPercent(tgBull * 100)}.`,
      `EBITDA margins expand to ${bullMargins[4]}% by year 5 under share-gain case.`,
      `Round ownership ~${formatPercent(ownership * 100)} on ${formatCurrency(input.amountRaising)} raise at ${formatCurrency(input.valuation)} post-money.`,
    ],
  };

  const bear: SimulatedDcfScenario = {
    scenario: 'bear',
    waccPct: waccBear * 100,
    terminalGrowthPct: tgBear * 100,
    years: bearProj.years,
    pvOperatingCashFlows: bearProj.pvSum,
    terminalFcf: bearProj.terminalFcf,
    terminalValue: bearTv,
    enterpriseValue: bearEv,
    netDebt,
    equityValue: bearEquity,
    postMoneyValuation: input.valuation,
    moicOnRound: Math.round(bearMoic * 10) / 10,
    impliedReturnIrrPct: Math.max(-15, Math.round((Math.pow(Math.max(bearMoic, 0.1), 1 / 5) - 1) * 100)),
    assumptions: [
      'Bear case assumes slower monetization, higher churn, and delayed campus expansion.',
      `WACC ${formatPercent(waccBear * 100)} with terminal growth ${formatPercent(tgBear * 100)} (compressed terminal multiple).`,
      'Revenue growth decelerates after year 2; margins plateau below bull trajectory.',
      'No debt assumed; downside protected only by cash runway from current round.',
      'Model for educational/demo purposes — not a fairness opinion or offer to sell securities.',
    ],
  };

  return { bull, bear };
}

function formatProjectionTable(scenario: SimulatedDcfScenario): string {
  const header =
    'Year | Revenue | EBITDA % | FCF | PV of FCF\n' +
    scenario.years
      .map(
        (y) =>
          `Y${y.year} | ${formatCurrency(y.revenue)} | ${y.ebitdaMarginPct}% | ${formatCurrency(y.fcf)} | ${formatCurrency(y.pvFcf)}`
      )
      .join('\n');

  return [
    header,
    '',
    `PV of 5-yr cash flows: ${formatCurrency(scenario.pvOperatingCashFlows)}`,
    `Terminal FCF (Y5): ${formatCurrency(scenario.terminalFcf)}`,
    `Terminal value (Gordon): ${formatCurrency(scenario.terminalValue)}`,
    `Enterprise value: ${formatCurrency(scenario.enterpriseValue)}`,
    `Equity value: ${formatCurrency(scenario.equityValue)}`,
    `Implied MOIC on this round: ${scenario.moicOnRound.toFixed(1)}x`,
    `Illustrative 5-yr IRR: ~${scenario.impliedReturnIrrPct}%`,
  ].join('\n');
}

/** Narrative + assumptions only (table rendered separately in UI). */
export function formatDcfCaseIntro(
  scenario: SimulatedDcfScenario,
  startupName: string,
  tone: 'bull' | 'bear'
): string {
  const lead =
    tone === 'bull'
      ? `Bull case (simulated DCF): ${startupName} executes on distribution and retention, earning the right to raise a priced Series A from a position of strength.`
      : `Bear case (simulated DCF): ${startupName} struggles to convert early engagement into durable revenue, forcing a flat or down round within 24 months.`;

  const assumptions = scenario.assumptions.map((a) => `• ${a}`).join('\n');

  return [
    lead,
    '',
    'DCF assumptions',
    assumptions,
    '',
    tone === 'bull'
      ? `Under this path, implied equity value of ${formatCurrency(scenario.equityValue)} vs. current post-money of ${formatCurrency(scenario.postMoneyValuation)} supports ${scenario.moicOnRound.toFixed(1)}x MOIC for this check size — contingent on milestone delivery. See 5-year projection table below.`
      : `Under this path, equity value compresses toward ${formatCurrency(scenario.equityValue)}, implying ~${scenario.moicOnRound.toFixed(1)}x MOIC and material downside if follow-on capital is scarce. See 5-year projection table below.`,
  ].join('\n');
}

/** Full text export including ASCII table (OpenAI / plain-text fallback). */
export function formatDcfCaseNarrative(
  scenario: SimulatedDcfScenario,
  startupName: string,
  tone: 'bull' | 'bear'
): string {
  return [
    formatDcfCaseIntro(scenario, startupName, tone),
    '',
    'Five-year projection (simulated)',
    formatProjectionTable(scenario),
  ].join('\n');
}
