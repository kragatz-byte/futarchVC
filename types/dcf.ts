/** Simulated 5-year DCF used for demo diligence (not live market data). */

export type DcfProjectionYear = {
  year: number;
  revenue: number;
  ebitdaMarginPct: number;
  fcf: number;
  discountFactor: number;
  pvFcf: number;
};

export type SimulatedDcfScenario = {
  scenario: 'bull' | 'bear';
  waccPct: number;
  terminalGrowthPct: number;
  years: DcfProjectionYear[];
  pvOperatingCashFlows: number;
  terminalFcf: number;
  terminalValue: number;
  enterpriseValue: number;
  netDebt: number;
  equityValue: number;
  postMoneyValuation: number;
  moicOnRound: number;
  impliedReturnIrrPct: number;
  assumptions: string[];
};
