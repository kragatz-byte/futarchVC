import type { MockDiligenceOutput } from '@/services/generateDiligenceMock';

/** Raw JSON shape from the OpenAI diligence prompt (snake_case). */
export type RawDiligenceJson = {
  executive_summary?: unknown;
  market_analysis?: unknown;
  competitor_analysis?: unknown;
  bull_case?: unknown;
  bear_case?: unknown;
  risks?: unknown;
  investment_memo?: unknown;
  suggested_questions?: unknown;
  ai_score?: unknown;
};

function extractJsonCandidate(text: string): string {
  const trimmed = text.trim();

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

function sanitizeJsonString(json: string): string {
  return json
    .replace(/^\uFEFF/, '')
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/[\u0000-\u001F]+/g, ' ');
}

function parseJsonLoose(text: string): unknown {
  const candidate = sanitizeJsonString(extractJsonCandidate(text));
  return JSON.parse(candidate);
}

function toNonEmptyString(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function toStringArray(value: unknown, fallback: string[]): string[] {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
    if (items.length) return items;
  }

  if (typeof value === 'string' && value.trim()) {
    const lines = value
      .split(/\n+/)
      .map((line) => line.replace(/^[-*•\d.)]+\s*/, '').trim())
      .filter(Boolean);
    if (lines.length) return lines;
  }

  return fallback;
}

/** OpenAI prompt uses 0–100; legacy mock scores may be 0–10 and are scaled up. */
function clampAiScore(value: unknown, fallback: number): number {
  const numeric =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseFloat(value)
        : Number.NaN;

  if (!Number.isFinite(numeric)) return fallback;

  const normalized = numeric <= 10 ? numeric * 10 : numeric;
  return Math.min(100, Math.max(0, Math.round(normalized)));
}

export function normalizeDiligenceJson(
  raw: unknown,
  fallback: MockDiligenceOutput
): MockDiligenceOutput | null {
  if (!raw || typeof raw !== 'object') return null;

  const record = raw as RawDiligenceJson;

  return {
    executiveSummary: toNonEmptyString(
      record.executive_summary,
      fallback.executiveSummary
    ),
    marketAnalysis: toNonEmptyString(record.market_analysis, fallback.marketAnalysis),
    competitorAnalysis: toNonEmptyString(
      record.competitor_analysis,
      fallback.competitorAnalysis
    ),
    bullCase: toNonEmptyString(record.bull_case, fallback.bullCase),
    bearCase: toNonEmptyString(record.bear_case, fallback.bearCase),
    risks: toStringArray(record.risks, fallback.risks),
    investmentMemo: toNonEmptyString(record.investment_memo, fallback.investmentMemo),
    suggestedQuestions: toStringArray(
      record.suggested_questions,
      fallback.suggestedQuestions
    ),
    aiScore: clampAiScore(record.ai_score, fallback.aiScore),
  };
}

export function parseDiligenceResponse(
  text: string,
  fallback: MockDiligenceOutput
): MockDiligenceOutput | null {
  try {
    const parsed = parseJsonLoose(text);
    return normalizeDiligenceJson(parsed, fallback);
  } catch {
    return null;
  }
}
