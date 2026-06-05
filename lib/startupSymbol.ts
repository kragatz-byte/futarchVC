/** Emoji “logos” for mock startups and founder submissions (no remote image fetch). */

const STARTUP_SYMBOLS: Record<string, string> = {
  quadlink: '🔗',
  labledger: '🧪',
  dormdash: '🍕',
  pitchpal: '🎤',
  roomreserve: '📚',
  venturebowl: '🏆',
};

const INDUSTRY_SYMBOLS: { match: RegExp; symbol: string }[] = [
  { match: /social|campus|community/i, symbol: '👥' },
  { match: /edtech|education|research/i, symbol: '📖' },
  { match: /food|delivery|marketplace/i, symbol: '🍔' },
  { match: /ai|ml|founder tool/i, symbol: '🤖' },
  { match: /fintech|forecast|finance/i, symbol: '📈' },
  { match: /infra|campus infra/i, symbol: '🏛️' },
  { match: /health|bio|med/i, symbol: '💊' },
  { match: /climate|energy|sustain/i, symbol: '🌱' },
];

export function symbolFromIndustry(industry: string): string {
  const trimmed = industry.trim();
  for (const { match, symbol } of INDUSTRY_SYMBOLS) {
    if (match.test(trimmed)) return symbol;
  }
  return '🚀';
}

export function symbolFromStartupId(startupId: string): string | undefined {
  const slug = startupId.split('-')[0]?.toLowerCase();
  return STARTUP_SYMBOLS[startupId] ?? (slug ? STARTUP_SYMBOLS[slug] : undefined);
}

/** Reads `symbol:🎤` from logoUrl, else id map, else industry heuristic. */
export function getStartupDisplaySymbol(startup: {
  id: string;
  industry: string;
  logoUrl?: string;
}): string {
  const fromUrl = startup.logoUrl?.startsWith('symbol:')
    ? startup.logoUrl.slice('symbol:'.length)
    : undefined;
  if (fromUrl) return fromUrl;

  return symbolFromStartupId(startup.id) ?? symbolFromIndustry(startup.industry);
}

export function logoUrlForSymbol(symbol: string): string {
  return `symbol:${symbol}`;
}
