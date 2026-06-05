import type { InvestmentDecision, Startup, StartupForecastSubmission } from '@/types';

export type StartupAggregateStats = Pick<
  Startup,
  'percentInvest' | 'percentPass' | 'averageConviction' | 'averageForecast'
>;

export function computeAggregateStats(input: {
  decisions: Pick<InvestmentDecision, 'decision' | 'conviction'>[];
  forecastProbabilities: number[];
}): StartupAggregateStats {
  const { decisions, forecastProbabilities } = input;
  const totalDecisions = decisions.length;

  if (totalDecisions === 0) {
    return {
      percentInvest: 0,
      percentPass: 0,
      averageConviction: 0,
      averageForecast:
        forecastProbabilities.length > 0
          ? Math.round(
              forecastProbabilities.reduce((sum, value) => sum + value, 0) /
                forecastProbabilities.length
            )
          : 0,
    };
  }

  const investCount = decisions.filter((item) => item.decision === 'invest').length;
  const passCount = decisions.filter((item) => item.decision === 'pass').length;
  const convictionSum = decisions.reduce((sum, item) => sum + item.conviction, 0);

  return {
    percentInvest: Math.round((investCount / totalDecisions) * 100),
    percentPass: Math.round((passCount / totalDecisions) * 100),
    averageConviction: Math.round(convictionSum / totalDecisions),
    averageForecast:
      forecastProbabilities.length > 0
        ? Math.round(
            forecastProbabilities.reduce((sum, value) => sum + value, 0) /
              forecastProbabilities.length
          )
        : 0,
  };
}

export function computeLocalStartupAggregates(
  startupId: string,
  decisions: InvestmentDecision[],
  forecasts: StartupForecastSubmission[]
): StartupAggregateStats {
  const startupDecisions = decisions.filter((item) => item.startupId === startupId);
  const forecastProbabilities = forecasts
    .filter((item) => item.startupId === startupId)
    .flatMap((item) => item.answers.map((answer) => answer.probability));

  return computeAggregateStats({
    decisions: startupDecisions,
    forecastProbabilities,
  });
}
