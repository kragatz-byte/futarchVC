export type InvestmentDecisionType = 'invest' | 'pass';

export type InvestmentDecision = {
  id: string;
  startupId: string;
  userId: string;
  decision: InvestmentDecisionType;
  conviction: number;
  reasoning?: string;
  createdAt: string;
};

export type WatchlistEntry = {
  id: string;
  startupId: string;
  userId: string;
  lean?: InvestmentDecisionType;
  conviction: number;
  reasoning?: string;
  createdAt: string;
};

export type StoredDecisions = {
  decisions: InvestmentDecision[];
  watchlist: WatchlistEntry[];
};
