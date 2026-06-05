import type {
  InvestmentDecision,
  ProfileActivityItem,
  Startup,
  StartupForecastSubmission,
  WatchlistEntry,
} from '@/types';

function startupNameMap(startups: Startup[]): Record<string, string> {
  return startups.reduce<Record<string, string>>((acc, startup) => {
    acc[startup.id] = startup.name;
    return acc;
  }, {});
}

export function buildLiveActivity(
  startups: Startup[],
  decisions: InvestmentDecision[],
  watchlist: WatchlistEntry[],
  forecastSubmissions: StartupForecastSubmission[]
): ProfileActivityItem[] {
  const names = startupNameMap(startups);
  const items: ProfileActivityItem[] = [];

  decisions.forEach((decision) => {
    items.push({
      id: `live-decision-${decision.id}`,
      type: decision.decision,
      startupName: names[decision.startupId] ?? decision.startupId,
      summary: `${decision.decision === 'invest' ? 'Invest' : 'Pass'} decision · ${decision.conviction} conviction`,
      createdAt: decision.createdAt,
    });
  });

  watchlist.forEach((entry) => {
    items.push({
      id: `live-watchlist-${entry.id}`,
      type: 'watchlist',
      startupName: names[entry.startupId] ?? entry.startupId,
      summary: `Watchlist${entry.lean ? ` · leaning ${entry.lean}` : ''} · ${entry.conviction} conviction`,
      createdAt: entry.createdAt,
    });
  });

  forecastSubmissions.forEach((submission) => {
    const count = submission.answers.length;
    const avgProb = Math.round(
      submission.answers.reduce((sum, answer) => sum + answer.probability, 0) / count
    );

    items.push({
      id: `live-forecast-${submission.id}`,
      type: 'forecast',
      startupName: names[submission.startupId] ?? submission.startupId,
      summary: `Submitted ${count} forecast${count === 1 ? '' : 's'} · ${avgProb}% avg probability`,
      createdAt: submission.updatedAt,
    });
  });

  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function mergeActivity(
  mockActivity: ProfileActivityItem[],
  liveActivity: ProfileActivityItem[],
  limit = 8
): ProfileActivityItem[] {
  const seen = new Set<string>();
  const merged: ProfileActivityItem[] = [];

  [...liveActivity, ...mockActivity].forEach((item) => {
    const key = `${item.type}-${item.startupName}-${item.summary.slice(0, 24)}`;
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(item);
  });

  return merged
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
