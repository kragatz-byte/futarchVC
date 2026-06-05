import type {
  DiligenceReportRow,
  ForecastRow,
  InvestmentDecisionRow,
  LeaderboardEntryRow,
  ProfileRow,
  StartupRow,
} from '@/types/database';
import type {
  CampusRankingEntry,
  DiligenceReport,
  ForecasterLeaderboardEntry,
  ForecastAnswer,
  InvestmentDecision,
  LeaderboardData,
  Profile,
  Startup,
  StartupForecastSubmission,
} from '@/types';

function finiteNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function mapStartupRow(row: StartupRow): Startup {
  return {
    id: row.id,
    name: row.name ?? '',
    tagline: row.tagline ?? '',
    description: row.description ?? '',
    websiteUrl: row.website_url ?? '',
    logoUrl: row.logo_url ?? '',
    industry: row.industry ?? '',
    stage: row.stage ?? 'mvp',
    status: row.status,
    amountRaising: finiteNumber(row.amount_raising),
    valuation: finiteNumber(row.valuation),
    traction: row.traction ?? '',
    founderName: row.founder_name ?? '',
    founderEmail: row.founder_email ?? undefined,
    aiScore: finiteNumber(row.ai_score),
    percentInvest: finiteNumber(row.percent_invest),
    percentPass: finiteNumber(row.percent_pass),
    averageConviction: finiteNumber(row.average_conviction),
    averageForecast: finiteNumber(row.average_forecast),
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

export function mapStartupToRow(startup: Startup): StartupRow {
  return {
    id: startup.id,
    name: startup.name,
    tagline: startup.tagline,
    description: startup.description,
    website_url: startup.websiteUrl,
    logo_url: startup.logoUrl,
    industry: startup.industry,
    stage: startup.stage,
    status: startup.status ?? 'active',
    amount_raising: startup.amountRaising,
    valuation: startup.valuation,
    traction: startup.traction,
    founder_name: startup.founderName,
    founder_email: startup.founderEmail ?? null,
    ai_score: startup.aiScore,
    percent_invest: startup.percentInvest,
    percent_pass: startup.percentPass,
    average_conviction: startup.averageConviction,
    average_forecast: startup.averageForecast,
    created_at: startup.createdAt,
  };
}

function toStringArrayField(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
  }
  return [];
}

export function mapDiligenceRow(row: DiligenceReportRow): DiligenceReport {
  return {
    id: row.id,
    startupId: row.startup_id,
    executiveSummary: row.executive_summary ?? '',
    marketAnalysis: row.market_analysis ?? '',
    competitorAnalysis: row.competitor_analysis ?? '',
    bullCase: row.bull_case ?? '',
    bearCase: row.bear_case ?? '',
    risks: toStringArrayField(row.risks),
    investmentMemo: row.investment_memo ?? '',
    suggestedQuestions: toStringArrayField(row.suggested_questions),
    aiScore: typeof row.ai_score === 'number' && Number.isFinite(row.ai_score) ? row.ai_score : 0,
    generatedAt: row.generated_at ?? new Date().toISOString(),
  };
}

export function mapDiligenceToRow(report: DiligenceReport): DiligenceReportRow {
  return {
    id: report.id,
    startup_id: report.startupId,
    executive_summary: report.executiveSummary,
    market_analysis: report.marketAnalysis,
    competitor_analysis: report.competitorAnalysis,
    bull_case: report.bullCase,
    bear_case: report.bearCase,
    risks: report.risks,
    investment_memo: report.investmentMemo,
    suggested_questions: report.suggestedQuestions,
    ai_score: report.aiScore,
    generated_at: report.generatedAt,
  };
}

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    username: row.username ?? 'Investor',
    campus: row.campus ?? '',
    avatarInitials: row.avatar_initials ?? '??',
    bio: row.bio ?? '',
    reputationScore: finiteNumber(row.reputation_score),
    forecastsMade: finiteNumber(row.forecasts_made),
    investmentDecisionsMade: finiteNumber(row.investment_decisions_made),
    watchlistCount: finiteNumber(row.watchlist_count),
    accuracyRate: finiteNumber(row.accuracy_rate),
    rank: finiteNumber(row.rank),
    badges: Array.isArray(row.badges) ? row.badges : [],
    recentActivity: Array.isArray(row.recent_activity) ? row.recent_activity : [],
    defaultThesis: row.default_thesis ?? '',
  };
}

export function mapInvestmentDecisionRow(row: InvestmentDecisionRow): InvestmentDecision {
  return {
    id: row.id,
    startupId: row.startup_id,
    userId: row.user_id,
    decision: row.decision,
    conviction: row.conviction,
    reasoning: row.reasoning ?? undefined,
    createdAt: row.created_at,
  };
}

export function mapInvestmentDecisionToRow(
  decision: InvestmentDecision
): InvestmentDecisionRow {
  return {
    id: decision.id,
    startup_id: decision.startupId,
    user_id: decision.userId,
    decision: decision.decision,
    conviction: decision.conviction,
    reasoning: decision.reasoning ?? null,
    created_at: decision.createdAt,
  };
}

function forecastRowToAnswer(row: ForecastRow): ForecastAnswer {
  return {
    questionId: row.question,
    probability: row.probability,
    reasoning: row.reasoning ?? undefined,
  };
}

export function mapForecastRowsToSubmission(rows: ForecastRow[]): StartupForecastSubmission | null {
  const first = rows[0];
  if (!first) return null;
  const latestUpdated = rows.reduce(
    (latest, row) => (row.updated_at > latest ? row.updated_at : latest),
    first.updated_at
  );
  const earliestCreated = rows.reduce(
    (earliest, row) => (row.created_at < earliest ? row.created_at : earliest),
    first.created_at
  );

  return {
    id: `forecast-bundle-${first.user_id}-${first.startup_id}`,
    startupId: first.startup_id,
    userId: first.user_id,
    answers: rows.map(forecastRowToAnswer),
    createdAt: earliestCreated,
    updatedAt: latestUpdated,
  };
}

export function groupForecastRows(rows: ForecastRow[]): StartupForecastSubmission[] {
  const groups = new Map<string, ForecastRow[]>();

  for (const row of rows) {
    const key = `${row.user_id}:${row.startup_id}`;
    const bucket = groups.get(key) ?? [];
    bucket.push(row);
    groups.set(key, bucket);
  }

  return Array.from(groups.values())
    .map(mapForecastRowsToSubmission)
    .filter((submission): submission is StartupForecastSubmission => submission !== null);
}

export function mapLeaderboardRows(rows: LeaderboardEntryRow[]): LeaderboardData | null {
  const topForecasters = rows
    .filter((row) => row.category === 'top_forecaster')
    .map(mapForecasterRow)
    .sort((a, b) => a.rank - b.rank);

  const mostActive = rows
    .filter((row) => row.category === 'most_active')
    .map(mapForecasterRow)
    .sort((a, b) => a.rank - b.rank);

  const campusRankings = rows
    .filter((row) => row.category === 'campus')
    .map(mapCampusRow)
    .sort((a, b) => a.rank - b.rank);

  if (!topForecasters.length && !mostActive.length && !campusRankings.length) {
    return null;
  }

  return {
    topForecasters: topForecasters.length ? topForecasters : [],
    mostActive: mostActive.length ? mostActive : [],
    campusRankings: campusRankings.length ? campusRankings : [],
  };
}

function mapForecasterRow(row: LeaderboardEntryRow): ForecasterLeaderboardEntry {
  return {
    id: row.id,
    rank: row.rank,
    username: row.username ?? 'Unknown',
    campus: row.campus,
    reputationScore: row.reputation_score ?? 0,
    forecastCount: row.forecast_count ?? 0,
    accuracyPlaceholder: row.accuracy_placeholder ?? '—',
    badge: row.badge ?? undefined,
  };
}

function mapCampusRow(row: LeaderboardEntryRow): CampusRankingEntry {
  return {
    rank: row.rank,
    campus: row.campus,
    totalReputation: row.total_reputation ?? 0,
    forecasterCount: row.forecaster_count ?? 0,
    avgAccuracyPlaceholder: row.avg_accuracy_placeholder ?? '—',
    topForecaster: row.top_forecaster ?? '—',
    weeklyMomentum: row.weekly_momentum ?? '—',
  };
}
